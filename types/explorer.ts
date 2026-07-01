import type {
  FHIRPatient,
  FHIRCondition,
  FHIRAllergyIntolerance,
  FHIREncounter,
} from "@/lib/fhir/types";
import type { IntakeData } from "@/types/patient";

export interface ResourceGroup<T> {
  ok: boolean;
  resources: T[];
  error?: string;
}

// Combines raw FHIR resources with the transformed IntakeData OrthoIntake derives from them.
// Used exclusively by the FHIR Explorer — the primary Patient Intake view uses IntakeData only.
export interface ExplorerData {
  patient: FHIRPatient;
  conditions: ResourceGroup<FHIRCondition>;
  allergies: ResourceGroup<FHIRAllergyIntolerance>;
  encounters: ResourceGroup<FHIREncounter>;
  intake: IntakeData;
}
