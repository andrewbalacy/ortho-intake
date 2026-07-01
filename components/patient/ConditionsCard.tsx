import { Condition } from "@/types/patient";

interface Props {
  conditions: Condition[];
}

export default function ConditionsCard({ conditions }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
          Active Conditions
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1">
        {conditions.length === 0 ? (
          <p className="text-sm text-gray-400">No conditions on file.</p>
        ) : (
          <ul className="space-y-2.5">
            {conditions.map((condition) => (
              <li key={condition.name} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-800">{condition.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <p className="mt-5 text-[11px] text-gray-400 border-t border-gray-50 pt-3.5">
        Chart context — for reference only.
      </p>
    </div>
  );
}
