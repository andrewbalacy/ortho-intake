import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChartContext from "@/components/dashboard/ChartContext";
import AllergiesCard from "@/components/patient/AllergiesCard";
import ConditionsCard from "@/components/patient/ConditionsCard";
import RecentEncountersCard from "@/components/patient/RecentEncountersCard";
import { IntakeData } from "@/types/patient";

const intakeData: IntakeData = {
  patient: {
    name: "Maria Thompson",
    dob: "04/12/1968",
    age: 58,
    sex: "Female",
    mrn: "SYN-20491",
    reasonForVisit: "Right shoulder pain",
    appointmentType: "Orthopedic Walk-In",
    provider: "—",
  },
  allergies: [
    { substance: "Penicillin" },
    { substance: "Latex" },
  ],
  conditions: [
    { name: "Osteoarthritis" },
    { name: "History of shoulder impingement" },
    { name: "Hypertension" },
  ],
  recentEncounters: [
    { type: "Orthopedic walk-in visit", date: "2026-05-14" },
    { type: "Physical therapy evaluation", date: "2026-04-22" },
    { type: "Primary care follow-up", date: "2026-03-30" },
  ],
  chartContext: [
    "Right shoulder impingement documented in prior encounter history.",
    "Penicillin and Latex allergies on record — verify at time of intake.",
    "Prior orthopedic visit 46 days ago (2026-05-14).",
    "Physical therapy evaluation available from 2026-04-22.",
  ],
};

export default function Home() {
  return (
    <AppShell>
      <DashboardHeader patient={intakeData.patient} />
      <ChartContext items={intakeData.chartContext} />
      {/* Medical background — read before encounters */}
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

      {/* Encounter history — chronological context */}
      <div className="px-12 py-10">
        <RecentEncountersCard encounters={intakeData.recentEncounters} />
      </div>
    </AppShell>
  );
}
