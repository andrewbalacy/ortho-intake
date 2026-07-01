import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClinicalSnapshot from "@/components/dashboard/ClinicalSnapshot";
import PatientOverviewCard from "@/components/patient/PatientOverviewCard";
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
};

export default function Home() {
  return (
    <AppShell>
      <DashboardHeader patient={intakeData.patient} />
      <ClinicalSnapshot />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientOverviewCard patient={intakeData.patient} />
        <AllergiesCard allergies={intakeData.allergies} />
        <ConditionsCard conditions={intakeData.conditions} />
        <RecentEncountersCard encounters={intakeData.recentEncounters} />
      </div>
    </AppShell>
  );
}
