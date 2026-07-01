import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
}

export default function DashboardHeader({ patient }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Breadcrumb with appointment type badge */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Patient Intake
        </span>
        <span className="text-gray-300 select-none">·</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand/10 text-brand tracking-wide">
          {patient.appointmentType}
        </span>
      </div>

      {/* Hero: patient name */}
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
        {patient.name}
      </h1>
      <p className="mt-2.5 text-sm text-gray-500">
        {patient.age} y/o · {patient.sex} · DOB {patient.dob} · MRN{" "}
        <span className="font-mono tracking-tight text-gray-600">{patient.mrn}</span>
      </p>

      {/* Clinical metadata */}
      <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
            Reason for Visit
          </p>
          <p className="text-base font-medium text-gray-900">{patient.reasonForVisit}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
            Primary Provider
          </p>
          <p className="text-base text-gray-500">{patient.provider}</p>
        </div>
      </div>
    </div>
  );
}
