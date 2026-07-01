import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ChartContext from "@/components/dashboard/ChartContext";
import AllergiesCard from "@/components/patient/AllergiesCard";
import ConditionsCard from "@/components/patient/ConditionsCard";
import RecentEncountersCard from "@/components/patient/RecentEncountersCard";
import { fetchPatientList, fetchIntakeData } from "@/lib/fhir/service";

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

  const [patientList, intake] = await Promise.all([
    fetchPatientList(),
    fetchIntakeData(resolvedId),
  ]);

  return (
    <AppShell
      patientList={patientList}
      currentPatientId={intake.patient.fhirId}
    >
      <div className="p-6 space-y-5">
        {/* Patient hero card */}
        <DashboardHeader patient={intake.patient} />

        {/* Summary cards row */}
        <SummaryCards
          appointmentType={intake.patient.appointmentType}
          conditions={intake.conditions}
          encounters={intake.recentEncounters}
          allergies={intake.allergies}
        />

        {/* Pre-intake briefing */}
        <ChartContext items={intake.chartContext} />

        {/* Clinical cards grid */}
        <div className="grid grid-cols-3 gap-5">
          <ConditionsCard conditions={intake.conditions} />
          <AllergiesCard allergies={intake.allergies} />
          <RecentEncountersCard
            encounters={intake.recentEncounters}
            patientId={intake.patient.fhirId}
          />
        </div>
      </div>
    </AppShell>
  );
}
