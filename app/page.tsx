import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartContext from "@/components/dashboard/ChartContext";
import AllergiesCard from "@/components/patient/AllergiesCard";
import ConditionsCard from "@/components/patient/ConditionsCard";
import RecentEncountersCard from "@/components/patient/RecentEncountersCard";
import { fetchIntakeData, fetchPatientList } from "@/lib/fhir/service";

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

  // Patient list and intake data are independent — fetch in parallel.
  const [patientList, intakeData] = await Promise.all([
    fetchPatientList(),
    fetchIntakeData(resolvedId),
  ]);

  return (
    <AppShell
      patientList={patientList}
      currentPatientId={intakeData.patient.fhirId}
    >
      <DashboardHeader patient={intakeData.patient} />
      <ChartContext items={intakeData.chartContext} />

      {/* Medical background — conditions and allergies before encounter history */}
      <div className="px-12 py-10 border-b border-gray-100">
        <div className="grid grid-cols-2">
          <div className="pr-16">
            <ConditionsCard conditions={intakeData.conditions} />
          </div>
          <div className="border-l border-gray-100 pl-16">
            <AllergiesCard allergies={intakeData.allergies} />
          </div>
        </div>
      </div>

      {/* Encounter history */}
      <div className="px-12 py-10">
        <RecentEncountersCard encounters={intakeData.recentEncounters} />
      </div>
    </AppShell>
  );
}
