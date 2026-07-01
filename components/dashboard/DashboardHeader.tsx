import { Patient } from "@/types/patient";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface Props {
  patient: Patient;
}

export default function DashboardHeader({ patient }: Props) {
  const initials = getInitials(patient.name);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-8 pt-7 pb-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Patient Intake
          </span>
          <svg
            className="w-3 h-3 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-[11px] font-semibold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
            {patient.appointmentType}
          </span>
        </div>

        {/* Patient hero row */}
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-brand">{initials}</span>
          </div>

          {/* Name + demographics */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[2.75rem] font-bold tracking-tight text-gray-900 leading-none">
              {patient.name}
            </h1>

            <div className="mt-3.5 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {patient.age} years old · {patient.dob}
              </span>

              <span className="w-px h-3.5 bg-gray-200 flex-shrink-0" />

              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {patient.sex}
              </span>

              <span className="w-px h-3.5 bg-gray-200 flex-shrink-0" />

              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                MRN{" "}
                <span className="font-mono text-gray-700 tracking-tight">
                  {patient.mrn}
                </span>
              </span>
            </div>

            {/* Clinical metadata */}
            <div className="mt-5 flex gap-12 flex-wrap">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Reason for Visit
                </p>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {patient.reasonForVisit}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Provider
                </p>
                <p className="text-sm text-gray-500 leading-snug">
                  {patient.provider || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
