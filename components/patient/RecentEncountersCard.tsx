import { Encounter } from "@/types/patient";

interface Props {
  encounters: Encounter[];
}

export default function RecentEncountersCard({ encounters }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Recent Encounters
      </h2>
      {encounters.length === 0 ? (
        <p className="text-sm text-gray-400">No recent encounters on file.</p>
      ) : (
        <ul>
          {encounters.map((encounter, index) => (
            <li
              key={index}
              className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-800">{encounter.type}</span>
              <span className="text-xs text-gray-400 font-medium tabular-nums flex-shrink-0">
                {encounter.date}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-3">Chart context — for reference only.</p>
    </div>
  );
}
