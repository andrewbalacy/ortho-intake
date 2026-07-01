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
  transformConditions,
  transformAllergies,
  transformEncounters,
  mostRecentRawEncounter,
  buildChartContext,
} from "./transforms";
import type { IntakeData } from "@/types/patient";

// Resolves the patient to use for the intake view.
// Prefers FHIR_PATIENT_ID env var; falls back to the first patient
// returned by the sandbox so the app works without configuration.
async function resolvePatient(): Promise<FHIRPatient> {
  const configured = process.env.FHIR_PATIENT_ID;
  if (configured) {
    return fhirFetch<FHIRPatient>(`/Patient/${configured}`);
  }

  const bundle = await fhirFetch<FHIRBundle<FHIRPatient>>(
    "/Patient?_count=1&_sort=_id",
  );
  const patient = bundle.entry?.[0]?.resource;
  if (!patient) {
    throw new Error("No patients found in FHIR sandbox.");
  }
  return patient;
}

export async function fetchIntakeData(): Promise<IntakeData> {
  const patientData = await resolvePatient();
  const pid = patientData.id;

  // Fetch clinical resources in parallel.
  // Individual resource failures degrade gracefully to empty arrays
  // so a missing Condition bundle never blocks the rest of the view.
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

  // Most recent encounter in raw form — used to populate reason-for-visit
  // and appointment type, which live on Encounter not Patient in FHIR R4.
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
