import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
}

export default function DashboardHeader({ patient }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{patient.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            DOB: {patient.dob}&ensp;&middot;&ensp;{patient.age} y/o&ensp;&middot;&ensp;{patient.sex}&ensp;&middot;&ensp;MRN:{" "}
            <span className="font-mono">{patient.mrn}</span>
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">
            Reason for Visit
          </p>
          <p className="text-sm font-medium text-gray-800 mt-0.5">{patient.reasonForVisit}</p>
        </div>
      </div>
    </div>
  );
}
