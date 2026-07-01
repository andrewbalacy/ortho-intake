// Confidence reflects how directly a value was extracted from FHIR:
//   High   — primary, human-authored text field (e.g. code.text, reasonCode[0].text)
//   Medium — coded display from a terminology system (e.g. SNOMED coding[].display)
//   Low    — computed fallback, default, or field absent entirely
export type Confidence = "High" | "Medium" | "Low";

export interface FieldSource {
  resource: "Patient" | "Encounter" | "Condition" | "AllergyIntolerance";
  field: string;      // JSONPath-style field descriptor, e.g. "reasonCode[0].text"
  resourceId: string; // FHIR resource ID of the originating resource
}

export interface AnnotatedField {
  value: string;
  confidence: Confidence;
  source: FieldSource;
}

// Mirrors IntakeData fields but carries provenance for every derived value.
// Kept separate from IntakeData so existing components need no changes.
export interface ExplainabilityData {
  demographics: {
    name: AnnotatedField;
    dob: AnnotatedField;
    sex: AnnotatedField;
    mrn: AnnotatedField;
  };
  visit: {
    reasonForVisit: AnnotatedField;
    appointmentType: AnnotatedField;
  };
  conditions: AnnotatedField[];
  allergies: AnnotatedField[];
  encounters: Array<{
    type: AnnotatedField;
    date: AnnotatedField;
  }>;
}
