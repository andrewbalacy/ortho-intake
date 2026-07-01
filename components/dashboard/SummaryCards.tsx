import type { Condition, Allergy, Encounter } from "@/types/patient";

interface CardProps {
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

function SummaryCard({ iconBg, icon, label, value, sub }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface Props {
  appointmentType: string;
  conditions: Condition[];
  encounters: Encounter[];
  allergies: Allergy[];
}

export default function SummaryCards({
  appointmentType,
  conditions,
  encounters,
  allergies,
}: Props) {
  const lastEncounterDate = encounters[0]?.date ?? null;
  const allergyValue =
    allergies.length === 0 ? "None documented" : `${allergies.length} on record`;

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Visit Type */}
      <SummaryCard
        iconBg="bg-blue-50"
        icon={
          <svg
            className="w-5 h-5 text-blue-600"
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
        }
        label="Visit Type"
        value={appointmentType}
      />

      {/* Active Conditions */}
      <SummaryCard
        iconBg="bg-emerald-50"
        icon={
          <svg
            className="w-5 h-5 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        }
        label="Active Conditions"
        value={String(conditions.length)}
        sub="See details below"
      />

      {/* Prior Encounters */}
      <SummaryCard
        iconBg="bg-violet-50"
        icon={
          <svg
            className="w-5 h-5 text-violet-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
        label="Prior Encounters"
        value={String(encounters.length)}
        sub={lastEncounterDate ? `Last: ${lastEncounterDate}` : undefined}
      />

      {/* Allergies */}
      <SummaryCard
        iconBg="bg-amber-50"
        icon={
          <svg
            className="w-5 h-5 text-amber-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        }
        label="Allergies"
        value={allergyValue}
        sub={allergies.length === 0 ? "No known allergies" : undefined}
      />
    </div>
  );
}
