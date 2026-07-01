import { Allergy } from "@/types/patient";

interface Props {
  allergies: Allergy[];
}

export default function AllergiesCard({ allergies }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-amber-600"
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
        </div>
        <div className="flex-1 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Allergies
          </h2>
          {allergies.length > 0 && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {allergies.length} on record
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {allergies.length === 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-600">
              No allergy documentation on file.
            </p>
            <p className="text-xs text-gray-400 mt-1">No known allergies</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {allergies.map((allergy) => (
              <li key={allergy.substance} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">
                  {allergy.substance}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <p className="mt-5 text-[11px] text-gray-400 border-t border-gray-50 pt-3.5">
        Confirm with patient at intake.
      </p>
    </div>
  );
}
