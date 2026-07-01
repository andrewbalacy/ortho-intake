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
import { scorePatient } from "@/lib/relevance";

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

// Fetches a candidate pool of patients, scores each for orthopedic relevance,
// and returns them sorted highest-score first. Zero-score patients still appear.
export async function fetchPatientList(): Promise<PatientSummary[]> {
  const bundle = await fhirFetch<FHIRBundle<FHIRPatient>>(
    "/Patient?_count=20&_sort=_id",
  );

  const patients = (bundle.entry ?? [])
    .map((e) => e.resource)
    .filter((p) => p.id);

  if (patients.length === 0) return [];

  // Fetch conditions for all candidates in parallel; individual failures are tolerated.
  const conditionResults = await Promise.allSettled(
    patients.map((p) =>
      fhirFetch<FHIRBundle<FHIRCondition>>(`/Condition?patient=${p.id}&_count=50`),
    ),
  );

  const scored: PatientSummary[] = patients.map((patient, i) => {
    const condBundle =
      conditionResults[i].status === "fulfilled"
        ? conditionResults[i].value
        : { resourceType: "Bundle" as const, entry: [] };

    const conditionNames = transformConditions(condBundle).map((c) => c.name);
    const relevanceScore = scorePatient(conditionNames);

    return { ...transformPatientSummary(patient), relevanceScore };
  });

  // Higher relevance first; ties preserve original order.
  return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
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
