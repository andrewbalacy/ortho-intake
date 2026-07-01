import Link from "next/link";
import { Encounter } from "@/types/patient";

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function parseDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month: MONTHS[month - 1], day };
}

interface Props {
  encounters: Encounter[];
  patientId?: string;
}

export default function RecentEncountersCard({ encounters, patientId }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-violet-600"
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
        </div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
          Encounter History
        </h2>
      </div>

      {/* Timeline */}
      <div className="flex-1">
        {encounters.length === 0 ? (
          <p className="text-sm text-gray-400">No encounters on file.</p>
        ) : (
          <div>
            {encounters.map((encounter, index) => {
              const { year, month, day } = parseDate(encounter.date);
              const isFirst = index === 0;
              const isLast = index === encounters.length - 1;

              return (
                <div key={index} className="flex gap-4">
                  {/* Date column */}
                  <div className="w-10 flex-shrink-0 text-right pt-0.5">
                    <div className="text-[9px] font-semibold tracking-widest text-gray-400">
                      {month}
                    </div>
                    <div className="text-2xl font-light text-gray-700 leading-none tabular-nums">
                      {String(day).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-gray-400 tabular-nums">
                      {year}
                    </div>
                  </div>

                  {/* Timeline spine */}
                  <div className="flex flex-col items-center flex-shrink-0 w-4">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        isFirst ? "bg-violet-500" : "bg-gray-200"
                      }`}
                    />
                    {!isLast && (
                      <div className="w-px flex-1 bg-gray-100 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                    <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                      <p className="text-sm text-gray-800 leading-snug">
                        {encounter.type}
                      </p>
                      {isFirst && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded">
                          Most Recent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center justify-between gap-4">
        <p className="text-[11px] text-gray-400">
          Chart context — for reference only.
        </p>
        {patientId && (
          <Link
            href={`/fhir-explorer?patient=${patientId}`}
            className="text-[11px] font-medium text-brand hover:text-brand/70 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View all in FHIR Explorer
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
