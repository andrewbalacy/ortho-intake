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
}

export default function RecentEncountersCard({ encounters }: Props) {
  return (
    <section>
      <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-10">
        Encounter History
      </h2>

      {encounters.length === 0 ? (
        <p className="text-sm text-gray-400">No encounters on file.</p>
      ) : (
        <div>
          {encounters.map((encounter, index) => {
            const { year, month, day } = parseDate(encounter.date);
            const isLast = index === encounters.length - 1;

            return (
              <div key={index} className="flex gap-6">
                {/* Date column */}
                <div className="w-12 flex-shrink-0 text-right pt-0.5">
                  <div className="text-[9px] font-medium tracking-widest text-gray-400">
                    {month}
                  </div>
                  <div className="text-[2rem] font-extralight text-gray-900 leading-none tabular-nums mt-0.5">
                    {day}
                  </div>
                  <div className="text-[9px] text-gray-400 tabular-nums mt-0.5">{year}</div>
                </div>

                {/* Timeline spine */}
                <div className="flex flex-col items-center flex-shrink-0 w-5">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      index === 0 ? "bg-brand" : "bg-gray-200"
                    }`}
                  />
                  {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1.5" />}
                </div>

                {/* Encounter content */}
                <div className={isLast ? "pb-0" : "pb-9"}>
                  <p className="text-[15px] text-gray-900 leading-snug pt-1.5">
                    {encounter.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-[11px] text-gray-300">Chart context — for reference only.</p>
    </section>
  );
}
