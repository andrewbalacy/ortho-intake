import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartContext from "@/components/dashboard/ChartContext";
import AllergiesCard from "@/components/patient/AllergiesCard";
import ConditionsCard from "@/components/patient/ConditionsCard";
import RecentEncountersCard from "@/components/patient/RecentEncountersCard";
import { fetchIntakeData } from "@/lib/fhir/service";

export default async function Home() {
  const intakeData = await fetchIntakeData();

  return (
    <AppShell>
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
