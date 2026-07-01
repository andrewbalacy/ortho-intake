import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
}

export default function DashboardHeader({ patient }: Props) {
  return (
    <header className="px-10 pt-10 pb-9 border-b border-gray-100">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
          Patient Intake
        </span>
        <span className="text-gray-200 select-none">·</span>
        <span className="text-[11px] font-medium text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
          {patient.appointmentType}
        </span>
      </div>

      {/* Patient name — the hero */}
      <h1 className="text-5xl font-semibold tracking-tight text-gray-900 leading-none">
        {patient.name}
      </h1>

      {/* Demographics */}
      <div className="mt-5 flex items-center gap-4 flex-wrap">
        <span className="text-sm text-gray-600">{patient.age} years old</span>
        <span className="text-gray-200 select-none">·</span>
        <span className="text-sm text-gray-600">{patient.sex}</span>
        <span className="text-gray-200 select-none">·</span>
        <span className="text-sm text-gray-600">DOB {patient.dob}</span>
        <span className="text-gray-200 select-none">·</span>
        <span className="text-sm text-gray-600">
          MRN{" "}
          <span className="font-mono text-gray-700 tracking-tight">{patient.mrn}</span>
        </span>
      </div>

      {/* Clinical metadata */}
      <div className="mt-8 grid grid-cols-2 gap-8 max-w-md">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-2">
            Reason for Visit
          </p>
          <p className="text-[15px] font-medium text-gray-900 leading-snug">
            {patient.reasonForVisit}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-2">
            Provider
          </p>
          <p className="text-[15px] text-gray-400 leading-snug">{patient.provider}</p>
        </div>
      </div>
    </header>
  );
}
