import { Condition } from "@/types/patient";

interface Props {
  conditions: Condition[];
}

export default function ConditionsCard({ conditions }: Props) {
  return (
    <section>
      <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
        Active Conditions
      </h2>

      {conditions.length === 0 ? (
        <p className="text-sm text-gray-400">No conditions on file.</p>
      ) : (
        <ul className="space-y-3">
          {conditions.map((condition) => (
            <li key={condition.name} className="text-sm text-gray-800 leading-relaxed">
              {condition.name}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[11px] text-gray-400">Chart context — for reference only.</p>
    </section>
  );
}
