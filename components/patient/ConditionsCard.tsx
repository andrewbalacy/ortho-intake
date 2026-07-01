import { Condition } from "@/types/patient";

interface Props {
  conditions: Condition[];
}

export default function ConditionsCard({ conditions }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Conditions
      </h2>
      {conditions.length === 0 ? (
        <p className="text-sm text-gray-400">No conditions on file.</p>
      ) : (
        <ul>
          {conditions.map((condition) => (
            <li
              key={condition.name}
              className="flex items-center gap-2.5 py-2.5 border-b border-gray-100 last:border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-800">{condition.name}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-3">Chart context — for reference only.</p>
    </div>
  );
}
