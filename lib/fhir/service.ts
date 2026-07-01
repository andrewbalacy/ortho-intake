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
import type { ExplorerData } from "@/types/explorer";
import { scorePatient } from "@/lib/relevance";
// TODO: field-level provenance (ExplainabilityData / buildExplainabilityData) was removed
// from the UI; the annotation logic lived in lib/fhir/explainability.ts and types/explainability.ts.

// Both fetchIntakeData and fetchExplorerData must use this count so that
// mostRecentRawEncounter operates on an identical candidate pool in each view.
// The FHIR server returns bundle entries in an unspecified order (not sorted by
// date), so a smaller count can miss the most-recently-dated encounter entirely,
// causing the two views to select different encounters and disagree on
// Reason for Visit, appointment type, and encounter history.
const ENCOUNTER_FETCH_COUNT = 50;

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

// Fetches raw FHIR resources alongside the transformed IntakeData for the FHIR Explorer.
// Reuses the same network calls to avoid duplication — transforms are applied to the
// already-fetched bundles rather than calling fetchIntakeData separately.
export async function fetchExplorerData(patientId?: string): Promise<ExplorerData> {
  const patientData = await resolvePatient(patientId);
  const pid = patientData.id;

  const [conditionsResult, allergiesResult, encountersResult] = await Promise.allSettled([
    fhirFetch<FHIRBundle<FHIRCondition>>(`/Condition?patient=${pid}&_count=50`),
    fhirFetch<FHIRBundle<FHIRAllergyIntolerance>>(`/AllergyIntolerance?patient=${pid}&_count=50`),
    fhirFetch<FHIRBundle<FHIREncounter>>(`/Encounter?patient=${pid}&_count=${ENCOUNTER_FETCH_COUNT}`),
  ]);

  const condBundle =
    conditionsResult.status === "fulfilled"
      ? conditionsResult.value
      : { resourceType: "Bundle" as const, entry: [] };
  const allergyBundle =
    allergiesResult.status === "fulfilled"
      ? allergiesResult.value
      : { resourceType: "Bundle" as const, entry: [] };
  const encounterBundle =
    encountersResult.status === "fulfilled"
      ? encountersResult.value
      : { resourceType: "Bundle" as const, entry: [] };

  const conditions = transformConditions(condBundle);
  const allergies = transformAllergies(allergyBundle);
  const encounters = transformEncounters(encounterBundle);
  const latestEncounter = mostRecentRawEncounter(encounterBundle);

  return {
    patient: patientData,
    conditions: {
      ok: conditionsResult.status === "fulfilled",
      resources: (condBundle.entry ?? []).map((e) => e.resource),
      error: conditionsResult.status === "rejected"
        ? String(conditionsResult.reason)
        : undefined,
    },
    allergies: {
      ok: allergiesResult.status === "fulfilled",
      resources: (allergyBundle.entry ?? []).map((e) => e.resource),
      error: allergiesResult.status === "rejected"
        ? String(allergiesResult.reason)
        : undefined,
    },
    encounters: {
      ok: encountersResult.status === "fulfilled",
      resources: (encounterBundle.entry ?? []).map((e) => e.resource),
      error: encountersResult.status === "rejected"
        ? String(encountersResult.reason)
        : undefined,
    },
    intake: {
      patient: transformPatient(patientData, latestEncounter),
      conditions,
      allergies,
      recentEncounters: encounters,
      chartContext: buildChartContext(conditions, allergies, encounters),
    },
  };
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
        `/Encounter?patient=${pid}&_count=${ENCOUNTER_FETCH_COUNT}`,
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
