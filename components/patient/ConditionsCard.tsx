import { Condition } from "@/types/patient";

interface Props {
  conditions: Condition[];
}

export default function ConditionsCard({ conditions }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Active Conditions
      </h2>
      {conditions.length === 0 ? (
        <p className="text-sm text-gray-400">No conditions on file.</p>
      ) : (
        <ul>
          {conditions.map((condition) => (
            <li
              key={condition.name}
              className="py-3 border-b border-gray-100 last:border-0 text-sm text-gray-800"
            >
              {condition.name}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-400">Chart context — for reference only.</p>
    </section>
  );
}
