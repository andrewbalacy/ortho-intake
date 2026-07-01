import PatientList from "./PatientList";
import type { PatientSummary } from "@/types/patient";

interface NavItemProps {
  label: string;
  active?: boolean;
  future?: boolean;
}

function NavItem({ label, active, future }: NavItemProps) {
  if (active) {
    return (
      <div className="relative flex items-center px-3 py-2 rounded-lg bg-brand/10">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r-full" />
        <span className="text-[13px] font-medium text-brand pl-1">{label}</span>
      </div>
    );
  }

  if (future) {
    return (
      <div className="flex items-center px-3 py-2 rounded-lg cursor-default select-none">
        <span className="text-[13px] text-gray-300">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
      <span className="text-[13px] text-gray-600">{label}</span>
    </div>
  );
}

interface Props {
  patients?: PatientSummary[];
  currentPatientId?: string;
}

export default function Sidebar({ patients, currentPatientId }: Props) {
  return (
    <aside className="w-52 shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Wordmark */}
      <div className="px-5 pt-8 pb-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
          <span className="text-[13px] font-semibold tracking-tight text-gray-900">
            OrthoIntake
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-0.5 flex-shrink-0">
        <NavItem label="Patient Intake" active />
        <NavItem label="FHIR Explorer" future />
        <NavItem label="Encounter Timeline" future />
        <NavItem label="About" future />
      </nav>

      {/* Patient list */}
      {patients && patients.length > 0 && currentPatientId !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100 px-3 flex-shrink-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-gray-400 px-3 mb-2">
            Patients
          </p>
          <PatientList patients={patients} currentPatientId={currentPatientId} />
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* SMART Sandbox status */}
      <div className="px-5 py-5 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-[11px] text-gray-500">SMART Sandbox</span>
        </div>
        <p className="mt-1 text-[10px] text-gray-400 leading-relaxed">
          Connected · Synthetic data
        </p>
      </div>
    </aside>
  );
}
