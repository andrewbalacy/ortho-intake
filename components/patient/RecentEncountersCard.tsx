import { Encounter } from "@/types/patient";

interface Props {
  encounters: Encounter[];
}

export default function RecentEncountersCard({ encounters }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Encounter History
      </h2>
      {encounters.length === 0 ? (
        <p className="text-sm text-gray-400">No encounters on file.</p>
      ) : (
        <ul>
          {encounters.map((encounter, index) => (
            <li
              key={index}
              className="grid grid-cols-[7rem_1fr] gap-4 py-3.5 border-b border-gray-100 last:border-0"
            >
              <span className="text-xs font-mono text-gray-400 tabular-nums pt-0.5">
                {encounter.date}
              </span>
              <span className="text-sm text-gray-900">{encounter.type}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-400">Chart context — for reference only.</p>
    </section>
  );
}
