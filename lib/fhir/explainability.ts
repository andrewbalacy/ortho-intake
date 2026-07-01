// Annotated extraction layer — mirrors every fallback chain in transforms.ts
// but records which path was taken (field + confidence) alongside the value.
// Imports shared helpers from transforms.ts to guarantee identical extraction
// rules; do not duplicate those helpers here.

import type {
  FHIRPatient,
  FHIRCondition,
  FHIRAllergyIntolerance,
  FHIREncounter,
  FHIRBundle,
} from "./types";
import {
  cleanDisplay,
  hasPeriod,
  getEncounterDate,
  mostRecentRawEncounter,
} from "./transforms";
import type {
  ExplainabilityData,
  AnnotatedField,
  Confidence,
} from "@/types/explainability";

// ---------------------------------------------------------------------------
// Patient demographics
// ---------------------------------------------------------------------------

function annotateName(patient: FHIRPatient): AnnotatedField {
  const official = patient.name?.find((n) => n.use === "official");
  const name = official ?? patient.name?.[0];
  if (!name) {
    return {
      value: "Unknown Patient",
      confidence: "Low",
      source: { resource: "Patient", field: "name", resourceId: patient.id },
    };
  }
  const given = name.given?.join(" ") ?? "";
  const family = name.family ?? "";
  const value = [given, family].filter(Boolean).join(" ");
  if (official) {
    return {
      value,
      confidence: "High",
      source: { resource: "Patient", field: "name[use=official]", resourceId: patient.id },
    };
  }
  return {
    value,
    confidence: "Medium",
    source: { resource: "Patient", field: "name[0]", resourceId: patient.id },
  };
}

function annotateDOB(patient: FHIRPatient): AnnotatedField {
  if (!patient.birthDate) {
    return {
      value: "—",
      confidence: "Low",
      source: { resource: "Patient", field: "birthDate", resourceId: patient.id },
    };
  }
  const [y, m, d] = patient.birthDate.split("-");
  return {
    value: `${m}/${d}/${y}`,
    confidence: "High",
    source: { resource: "Patient", field: "birthDate", resourceId: patient.id },
  };
}

function annotateSex(patient: FHIRPatient): AnnotatedField {
  const map: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
    unknown: "Unknown",
  };
  const mapped = map[patient.gender ?? ""];
  return {
    value: mapped ?? "Unknown",
    confidence: patient.gender && patient.gender !== "unknown" ? "High" : "Low",
    source: { resource: "Patient", field: "gender", resourceId: patient.id },
  };
}

function annotateMRN(patient: FHIRPatient): AnnotatedField {
  const fmt = (raw: string) =>
    raw.includes("-") && raw.length > 12
      ? `SYN-${raw.slice(-6).toUpperCase()}`
      : raw;

  const mrId = patient.identifier?.find((id) =>
    id.type?.coding?.some((c) => c.code === "MR"),
  );
  if (mrId) {
    return {
      value: fmt(mrId.value ?? patient.id),
      confidence: "High",
      source: {
        resource: "Patient",
        field: "identifier[type.coding.code=MR].value",
        resourceId: patient.id,
      },
    };
  }
  const first = patient.identifier?.[0];
  if (first) {
    return {
      value: fmt(first.value ?? patient.id),
      confidence: "Medium",
      source: {
        resource: "Patient",
        field: "identifier[0].value",
        resourceId: patient.id,
      },
    };
  }
  return {
    value: fmt(patient.id),
    confidence: "Low",
    source: { resource: "Patient", field: "id", resourceId: patient.id },
  };
}

// ---------------------------------------------------------------------------
// Visit context (derived from the most recent encounter)
// ---------------------------------------------------------------------------

function annotateReasonForVisit(encounter: FHIREncounter | undefined): AnnotatedField {
  if (!encounter) {
    return {
      value: "Not documented",
      confidence: "Low",
      source: { resource: "Encounter", field: "—", resourceId: "—" },
    };
  }
  const id = encounter.id ?? "—";

  // Mirrors extractReasonForVisit in transforms.ts — same priority order.
  if (encounter.reasonCode?.[0]?.text) {
    return {
      value: encounter.reasonCode[0].text,
      confidence: "High",
      source: { resource: "Encounter", field: "reasonCode[0].text", resourceId: id },
    };
  }
  const reasonDisplay = encounter.reasonCode?.[0]?.coding?.[0]?.display;
  if (reasonDisplay) {
    return {
      value: reasonDisplay,
      confidence: "Medium",
      source: { resource: "Encounter", field: "reasonCode[0].coding[0].display", resourceId: id },
    };
  }
  if (encounter.type?.[0]?.text) {
    return {
      value: encounter.type[0].text,
      confidence: "Medium",
      source: { resource: "Encounter", field: "type[0].text", resourceId: id },
    };
  }
  const typeDisplay = encounter.type?.[0]?.coding?.[0]?.display;
  if (typeDisplay) {
    return {
      value: typeDisplay,
      confidence: "Low",
      source: { resource: "Encounter", field: "type[0].coding[0].display", resourceId: id },
    };
  }
  return {
    value: "See chart",
    confidence: "Low",
    source: { resource: "Encounter", field: "—", resourceId: id },
  };
}

const CLASS_MAP: Record<string, string> = {
  AMB: "Ambulatory Visit",
  IMP: "Inpatient",
  EMER: "Emergency Visit",
  HH: "Home Health",
  VR: "Virtual Visit",
};

function annotateAppointmentType(encounter: FHIREncounter | undefined): AnnotatedField {
  if (!encounter) {
    return {
      value: "Clinical Visit",
      confidence: "Low",
      source: { resource: "Encounter", field: "—", resourceId: "—" },
    };
  }
  const id = encounter.id ?? "—";

  // Mirrors extractAppointmentType in transforms.ts — same priority order.
  const mapped = CLASS_MAP[encounter.class?.code?.toUpperCase() ?? ""];
  if (mapped) {
    return {
      value: mapped,
      confidence: "High",
      source: { resource: "Encounter", field: "class.code", resourceId: id },
    };
  }
  if (encounter.type?.[0]?.text) {
    return {
      value: encounter.type[0].text,
      confidence: "Medium",
      source: { resource: "Encounter", field: "type[0].text", resourceId: id },
    };
  }
  return {
    value: "Clinical Visit",
    confidence: "Low",
    source: { resource: "Encounter", field: "—", resourceId: id },
  };
}

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------

function annotateConditions(bundle: FHIRBundle<FHIRCondition>): AnnotatedField[] {
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((c) => {
      const status = c.clinicalStatus?.coding?.[0]?.code;
      return !status || status === "active";
    })
    .map((c): AnnotatedField => {
      const id = c.id ?? "—";
      if (c.code?.text) {
        return {
          value: cleanDisplay(c.code.text),
          confidence: "High",
          source: { resource: "Condition", field: "code.text", resourceId: id },
        };
      }
      const display = c.code?.coding?.find((coding) => coding.display)?.display;
      if (display) {
        return {
          value: cleanDisplay(display),
          confidence: "Medium",
          source: { resource: "Condition", field: "code.coding[].display", resourceId: id },
        };
      }
      return {
        value: "Unknown condition",
        confidence: "Low",
        source: { resource: "Condition", field: "—", resourceId: id },
      };
    });
}

// ---------------------------------------------------------------------------
// Allergies
// ---------------------------------------------------------------------------

function annotateAllergies(
  bundle: FHIRBundle<FHIRAllergyIntolerance>,
): AnnotatedField[] {
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((a) => {
      const status = a.clinicalStatus?.coding?.[0]?.code;
      return !status || status === "active";
    })
    .map((a): AnnotatedField => {
      const id = a.id ?? "—";
      if (a.code?.text) {
        return {
          value: a.code.text,
          confidence: "High",
          source: { resource: "AllergyIntolerance", field: "code.text", resourceId: id },
        };
      }
      const display = a.code?.coding?.find((c) => c.display)?.display;
      if (display) {
        return {
          value: display,
          confidence: "Medium",
          source: { resource: "AllergyIntolerance", field: "code.coding[].display", resourceId: id },
        };
      }
      return {
        value: "Unknown allergen",
        confidence: "Low",
        source: { resource: "AllergyIntolerance", field: "—", resourceId: id },
      };
    });
}

// ---------------------------------------------------------------------------
// Encounters
// ---------------------------------------------------------------------------

function annotateEncounters(
  bundle: FHIRBundle<FHIREncounter>,
): Array<{ type: AnnotatedField; date: AnnotatedField }> {
  // Uses the same hasPeriod filter and getEncounterDate sort as transformEncounters
  // so the annotated encounter list is ordered identically to the displayed list.
  const raw = (bundle.entry ?? []).map((e) => e.resource).filter(hasPeriod);
  const sorted = [...raw].sort((a, b) => getEncounterDate(b) - getEncounterDate(a));

  return sorted.slice(0, 5).map((e) => {
    const id = e.id ?? "—";

    // Type — same fallback chain as transformEncounters
    let type: AnnotatedField;
    if (e.type?.[0]?.text) {
      type = {
        value: cleanDisplay(e.type[0].text),
        confidence: "High",
        source: { resource: "Encounter", field: "type[0].text", resourceId: id },
      };
    } else if (e.type?.[0]?.coding?.[0]?.display) {
      type = {
        value: cleanDisplay(e.type[0].coding![0].display!),
        confidence: "Medium",
        source: { resource: "Encounter", field: "type[0].coding[0].display", resourceId: id },
      };
    } else if (e.class?.display) {
      type = {
        value: cleanDisplay(e.class.display),
        confidence: "Low",
        source: { resource: "Encounter", field: "class.display", resourceId: id },
      };
    } else {
      type = {
        value: "Clinical encounter",
        confidence: "Low",
        source: { resource: "Encounter", field: "—", resourceId: id },
      };
    }

    // Date — period.start preferred, period.end as fallback
    let date: AnnotatedField;
    if (e.period?.start) {
      date = {
        value: e.period.start.slice(0, 10),
        confidence: "High",
        source: { resource: "Encounter", field: "period.start", resourceId: id },
      };
    } else if (e.period?.end) {
      date = {
        value: e.period.end.slice(0, 10),
        confidence: "Medium",
        source: { resource: "Encounter", field: "period.end", resourceId: id },
      };
    } else {
      date = {
        value: "—",
        confidence: "Low",
        source: { resource: "Encounter", field: "period", resourceId: id },
      };
    }

    return { type, date };
  });
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

export function buildExplainabilityData(
  patient: FHIRPatient,
  condBundle: FHIRBundle<FHIRCondition>,
  allergyBundle: FHIRBundle<FHIRAllergyIntolerance>,
  encounterBundle: FHIRBundle<FHIREncounter>,
): ExplainabilityData {
  // Uses mostRecentRawEncounter from transforms.ts so reason-for-visit and
  // appointment-type attribution targets the same encounter used in IntakeData.
  const latest = mostRecentRawEncounter(encounterBundle);

  return {
    demographics: {
      name: annotateName(patient),
      dob: annotateDOB(patient),
      sex: annotateSex(patient),
      mrn: annotateMRN(patient),
    },
    visit: {
      reasonForVisit: annotateReasonForVisit(latest),
      appointmentType: annotateAppointmentType(latest),
    },
    conditions: annotateConditions(condBundle),
    allergies: annotateAllergies(allergyBundle),
    encounters: annotateEncounters(encounterBundle),
  };
}
