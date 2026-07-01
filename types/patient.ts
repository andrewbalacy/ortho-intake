export interface Patient {
  name: string;
  dob: string;
  age: number;
  sex: string;
  mrn: string;
  reasonForVisit: string;
  appointmentType: string;
  provider: string;
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
