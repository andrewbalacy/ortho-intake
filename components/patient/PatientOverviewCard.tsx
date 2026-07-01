import { Patient } from "@/types/patient";

interface Props {
  patient: Patient;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  );
}

export default function PatientOverviewCard({ patient }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Patient Overview
      </h2>
      <Row label="Full Name" value={patient.name} />
      <Row label="Date of Birth" value={patient.dob} />
      <Row label="Age" value={`${patient.age} years`} />
      <Row label="Sex" value={patient.sex} />
      <Row label="MRN" value={patient.mrn} />
      <Row label="Reason for Visit" value={patient.reasonForVisit} />
    </div>
  );
}
