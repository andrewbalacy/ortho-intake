import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartContext from "@/components/dashboard/ChartContext";
import AllergiesCard from "@/components/patient/AllergiesCard";
import ConditionsCard from "@/components/patient/ConditionsCard";
import RecentEncountersCard from "@/components/patient/RecentEncountersCard";
import ExplainabilityPanel from "@/components/explainability/ExplainabilityPanel";
import { fetchPatientList, fetchPatientDashboard } from "@/lib/fhir/service";

// searchParams is a Promise in Next.js 16 — must be awaited.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>;
}) {
  const { patient: urlPatientId } = await searchParams;

  // URL param takes priority; env var is the pinned demo fallback;
  // service resolves to first sandbox patient if neither is set.
  const resolvedId = urlPatientId ?? process.env.FHIR_PATIENT_ID;

  // Patient list and dashboard data are independent — fetch in parallel.
  // fetchPatientDashboard returns IntakeData + ExplainabilityData in one pass.
  const [patientList, dashboard] = await Promise.all([
    fetchPatientList(),
    fetchPatientDashboard(resolvedId),
  ]);

  const { intake, explainability } = dashboard;

  return (
    <AppShell
      patientList={patientList}
      currentPatientId={intake.patient.fhirId}
    >
      <DashboardHeader patient={intake.patient} />
      <ChartContext items={intake.chartContext} />

      {/* Medical background — conditions and allergies before encounter history */}
      <div className="px-12 py-10 border-b border-gray-100">
        <div className="grid grid-cols-2">
          <div className="pr-16">
            <ConditionsCard conditions={intake.conditions} />
          </div>
          <div className="border-l border-gray-100 pl-16">
            <AllergiesCard allergies={intake.allergies} />
          </div>
        </div>
      </div>

      {/* Encounter history */}
      <div className="px-12 py-10 border-b border-gray-100">
        <RecentEncountersCard encounters={intake.recentEncounters} />
      </div>

      {/* Data provenance — field-level attribution for every derived value */}
      <div className="px-12 py-10">
        <ExplainabilityPanel data={explainability} />
      </div>
    </AppShell>
  );
}
