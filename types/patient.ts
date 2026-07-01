export interface Patient {
  fhirId: string; // FHIR resource ID — used for URL navigation
  name: string;
  dob: string;
  age: number;
  sex: string;
  mrn: string;
  reasonForVisit: string;
  appointmentType: string;
  provider: string;
}

// Lightweight shape used in the sidebar patient list
export interface PatientSummary {
  id: string;  // FHIR resource ID
  name: string;
  age: number;
  sex: string;
  relevanceScore: number; // specialty relevance score (0 = no signal)
}

export interface Allergy {
  substance: string;
}

export interface Condition {
  name: string;
}

export interface Encounter {
  type: string;
  date: string;
}

export interface IntakeData {
  patient: Patient;
  allergies: Allergy[];
  conditions: Condition[];
  recentEncounters: Encounter[];
  chartContext: string[];
}
