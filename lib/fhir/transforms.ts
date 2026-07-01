import type {
  FHIRPatient,
  FHIRCondition,
  FHIRAllergyIntolerance,
  FHIREncounter,
  FHIRBundle,
} from "./types";
import type { Patient, Condition, Allergy, Encounter } from "@/types/patient";

// ---------------------------------------------------------------------------
// Patient
// ---------------------------------------------------------------------------

function extractName(patient: FHIRPatient): string {
  const name =
    patient.name?.find((n) => n.use === "official") ?? patient.name?.[0];
  if (!name) return "Unknown Patient";
  const given = name.given?.join(" ") ?? "";
  const family = name.family ?? "";
  return [given, family].filter(Boolean).join(" ");
}

function calculateAge(birthDate?: string): number {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDOB(birthDate?: string): string {
  if (!birthDate) return "—";
  const [y, m, d] = birthDate.split("-");
  return `${m}/${d}/${y}`;
}

function formatSex(gender?: string): string {
  return (
    { male: "Male", female: "Female", other: "Other", unknown: "Unknown" }[
      gender ?? ""
    ] ?? "Unknown"
  );
}

function extractMRN(patient: FHIRPatient): string {
  // Prefer identifier with HL7 type code "MR" (medical record number)
  const mrId = patient.identifier?.find((id) =>
    id.type?.coding?.some((c) => c.code === "MR"),
  );
  const raw = mrId?.value ?? patient.identifier?.[0]?.value ?? patient.id;
  // UUID-shaped values are hard to read; abbreviate to last 6 chars
  if (raw.includes("-") && raw.length > 12) {
    return `SYN-${raw.slice(-6).toUpperCase()}`;
  }
  return raw;
}

function extractReasonForVisit(encounter?: FHIREncounter): string {
  if (!encounter) return "Not documented";
  return (
    encounter.reasonCode?.[0]?.text ??
    encounter.reasonCode?.[0]?.coding?.[0]?.display ??
    encounter.type?.[0]?.text ??
    encounter.type?.[0]?.coding?.[0]?.display ??
    "See chart"
  );
}

function extractAppointmentType(encounter?: FHIREncounter): string {
  if (!encounter) return "Clinical Visit";
  const classMap: Record<string, string> = {
    AMB: "Ambulatory Visit",
    IMP: "Inpatient",
    EMER: "Emergency Visit",
    HH: "Home Health",
    VR: "Virtual Visit",
  };
  const mapped = classMap[encounter.class?.code?.toUpperCase() ?? ""];
  return mapped ?? encounter.type?.[0]?.text ?? "Clinical Visit";
}

export function transformPatient(
  patient: FHIRPatient,
  mostRecentEncounter?: FHIREncounter,
): Patient {
  return {
    name: extractName(patient),
    age: calculateAge(patient.birthDate),
    dob: formatDOB(patient.birthDate),
    sex: formatSex(patient.gender),
    mrn: extractMRN(patient),
    reasonForVisit: extractReasonForVisit(mostRecentEncounter),
    appointmentType: extractAppointmentType(mostRecentEncounter),
    provider: "—",
  };
}

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------

// SNOMED display strings append semantic tags like "(disorder)" — strip them.
function cleanDisplay(raw: string): string {
  return raw
    .replace(/\s*\((disorder|finding|procedure|situation|regime\/therapy)\)$/i, "")
    .trim();
}

export function transformConditions(
  bundle: FHIRBundle<FHIRCondition>,
): Condition[] {
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((c) => {
      const status = c.clinicalStatus?.coding?.[0]?.code;
      // Include active and conditions without a documented status
      return !status || status === "active";
    })
    .map((c) => {
      const raw =
        c.code?.text ??
        c.code?.coding?.find((coding) => coding.display)?.display ??
        "Unknown condition";
      return { name: cleanDisplay(raw) };
    });
}

// ---------------------------------------------------------------------------
// Allergies
// ---------------------------------------------------------------------------

export function transformAllergies(
  bundle: FHIRBundle<FHIRAllergyIntolerance>,
): Allergy[] {
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((a) => {
      const status = a.clinicalStatus?.coding?.[0]?.code;
      return !status || status === "active";
    })
    .map((a) => ({
      substance:
        a.code?.text ??
        a.code?.coding?.find((c) => c.display)?.display ??
        "Unknown allergen",
    }));
}

// ---------------------------------------------------------------------------
// Encounters
// ---------------------------------------------------------------------------

function sortByDate(encounters: FHIREncounter[]): FHIREncounter[] {
  return [...encounters].sort((a, b) => {
    const da = new Date(a.period?.start ?? 0).getTime();
    const db = new Date(b.period?.start ?? 0).getTime();
    return db - da; // most recent first
  });
}

export function transformEncounters(
  bundle: FHIRBundle<FHIREncounter>,
): Encounter[] {
  const raw = (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((e) => e.period?.start); // only encounters with a date

  return sortByDate(raw)
    .slice(0, 5)
    .map((e) => {
      const typeRaw =
        e.type?.[0]?.text ??
        e.type?.[0]?.coding?.[0]?.display ??
        e.class?.display ??
        "Clinical encounter";
      return {
        type: cleanDisplay(typeRaw),
        date: e.period!.start!.slice(0, 10),
      };
    });
}

// Exposed separately so the service can identify the most recent raw encounter
// for extracting reason-for-visit and appointment type context.
export function mostRecentRawEncounter(
  bundle: FHIRBundle<FHIREncounter>,
): FHIREncounter | undefined {
  const withDates = (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((e) => e.period?.start);
  return sortByDate(withDates)[0];
}

// ---------------------------------------------------------------------------
// Chart context (Pre-Intake Briefing)
// ---------------------------------------------------------------------------

export function buildChartContext(
  conditions: Condition[],
  allergies: Allergy[],
  encounters: Encounter[],
): string[] {
  const notes: string[] = [];

  if (allergies.length === 1) {
    notes.push(
      `${allergies[0].substance} allergy on record — verify at time of intake.`,
    );
  } else if (allergies.length > 1) {
    const listed = allergies
      .slice(0, 2)
      .map((a) => a.substance)
      .join(" and ");
    const suffix = allergies.length > 2 ? ` (+${allergies.length - 2} more)` : "";
    notes.push(`${listed}${suffix} allergies on record — verify at time of intake.`);
  }

  if (encounters.length > 0) {
    notes.push(
      `Most recent encounter: ${encounters[0].type} on ${encounters[0].date}.`,
    );
  }

  if (encounters.length > 1) {
    const prior = encounters.length - 1;
    notes.push(
      `${prior} prior encounter${prior !== 1 ? "s" : ""} available in chart.`,
    );
  }

  if (conditions.length > 0) {
    const listed = conditions
      .slice(0, 2)
      .map((c) => c.name)
      .join("; ");
    const suffix =
      conditions.length > 2 ? ` (+${conditions.length - 2} more)` : "";
    notes.push(`Active conditions include ${listed}${suffix}.`);
  }

  return notes;
}
