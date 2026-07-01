import Sidebar from "./Sidebar";
import type { PatientSummary } from "@/types/patient";

interface Props {
  children: React.ReactNode;
  patientList?: PatientSummary[];
  currentPatientId?: string;
}

export default function AppShell({ children, patientList, currentPatientId }: Props) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar patients={patientList} currentPatientId={currentPatientId} />
      <main className="flex-1 min-w-0 bg-surface">{children}</main>
    </div>
  );
}
