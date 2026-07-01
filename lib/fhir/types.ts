// Minimal FHIR R4 type definitions — only the fields OrthoIntake reads.
// Not intended to be exhaustive; shaped around what the sandbox actually returns.

export interface FHIRCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRBundle<T> {
  resourceType: "Bundle";
  total?: number;
  entry?: Array<{ resource: T }>;
}

export interface FHIRPatient {
  resourceType: "Patient";
  id: string;
  name?: Array<{
    use?: string;
    family?: string;
    given?: string[];
  }>;
  birthDate?: string;
  gender?: "male" | "female" | "other" | "unknown";
  identifier?: Array<{
    use?: string;
    type?: { coding?: FHIRCoding[] };
    system?: string;
    value?: string;
  }>;
}

export interface FHIRCondition {
  resourceType: "Condition";
  id?: string;
  clinicalStatus?: FHIRCodeableConcept;
  code?: FHIRCodeableConcept;
  recordedDate?: string;
  onsetDateTime?: string;
}

export interface FHIRAllergyIntolerance {
  resourceType: "AllergyIntolerance";
  id?: string;
  clinicalStatus?: FHIRCodeableConcept;
  code?: FHIRCodeableConcept;
}

export interface FHIREncounter {
  resourceType: "Encounter";
  id?: string;
  status?: string;
  class?: FHIRCoding;
  type?: FHIRCodeableConcept[];
  reasonCode?: FHIRCodeableConcept[];
  period?: {
    start?: string;
    end?: string;
  };
}
