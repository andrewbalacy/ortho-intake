import { fhirFetch } from "./client";
import type {
  FHIRBundle,
  FHIRPatient,
  FHIRCondition,
  FHIRAllergyIntolerance,
  FHIREncounter,
} from "./types";
import {
  transformPatient,
  transformPatientSummary,
  transformConditions,
  transformAllergies,
  transformEncounters,
  mostRecentRawEncounter,
  buildChartContext,
} from "./transforms";
import type { IntakeData, PatientSummary } from "@/types/patient";

// Resolves which patient to load.
// Priority: explicit ID argument → FHIR_PATIENT_ID env var → first sandbox patient.
async function resolvePatient(patientId?: string): Promise<FHIRPatient> {
  const id = patientId ?? process.env.FHIR_PATIENT_ID;
  if (id) {
    return fhirFetch<FHIRPatient>(`/Patient/${id}`);
  }

  // No patient configured — fall back to first available synthetic patient
  const bundle = await fhirFetch<FHIRBundle<FHIRPatient>>(
    "/Patient?_count=1&_sort=_id",
  );
  const patient = bundle.entry?.[0]?.resource;
  if (!patient) {
    throw new Error("No patients found in FHIR sandbox.");
  }
  return patient;
}

// Fetches a short list of patients for the sidebar selector.
export async function fetchPatientList(): Promise<PatientSummary[]> {
  const bundle = await fhirFetch<FHIRBundle<FHIRPatient>>(
    "/Patient?_count=10&_sort=_id",
  );
  return (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((p) => p.id)
    .map(transformPatientSummary);
}

// Fetches and transforms all intake data for a given patient.
// Accepts an optional patient ID; falls back to env var or first sandbox patient.
export async function fetchIntakeData(patientId?: string): Promise<IntakeData> {
  const patientData = await resolvePatient(patientId);
  const pid = patientData.id;

  // Fetch clinical resources in parallel.
  // Individual failures degrade gracefully to empty arrays.
  const [conditionsResult, allergiesResult, encountersResult] =
    await Promise.allSettled([
      fhirFetch<FHIRBundle<FHIRCondition>>(`/Condition?patient=${pid}`),
      fhirFetch<FHIRBundle<FHIRAllergyIntolerance>>(
        `/AllergyIntolerance?patient=${pid}`,
      ),
      fhirFetch<FHIRBundle<FHIREncounter>>(
        `/Encounter?patient=${pid}&_count=10`,
      ),
    ]);

  const conditions =
    conditionsResult.status === "fulfilled"
      ? transformConditions(conditionsResult.value)
      : [];

  const allergies =
    allergiesResult.status === "fulfilled"
      ? transformAllergies(allergiesResult.value)
      : [];

  const encounters =
    encountersResult.status === "fulfilled"
      ? transformEncounters(encountersResult.value)
      : [];

  const latestEncounter =
    encountersResult.status === "fulfilled"
      ? mostRecentRawEncounter(encountersResult.value)
      : undefined;

  return {
    patient: transformPatient(patientData, latestEncounter),
    conditions,
    allergies,
    recentEncounters: encounters,
    chartContext: buildChartContext(conditions, allergies, encounters),
  };
}
