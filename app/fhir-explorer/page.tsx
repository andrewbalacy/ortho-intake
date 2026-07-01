import AppShell from "@/components/layout/AppShell";
import ExplorerView from "@/components/explorer/ExplorerView";
import { fetchPatientList, fetchExplorerData } from "@/lib/fhir/service";

// searchParams is a Promise in Next.js 16 — must be awaited.
export default async function FhirExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>;
}) {
  const { patient: urlPatientId } = await searchParams;
  const resolvedId = urlPatientId ?? process.env.FHIR_PATIENT_ID;

  const [patientList, explorerData] = await Promise.all([
    fetchPatientList(),
    fetchExplorerData(resolvedId),
  ]);

  return (
    <AppShell
      patientList={patientList}
      currentPatientId={explorerData.intake.patient.fhirId}
    >
      <ExplorerView data={explorerData} />
    </AppShell>
  );
}
