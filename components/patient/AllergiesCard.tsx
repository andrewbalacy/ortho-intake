import { Allergy } from "@/types/patient";

interface Props {
  allergies: Allergy[];
}

export default function AllergiesCard({ allergies }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Allergies
        </h2>
        {allergies.length > 0 && (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            {allergies.length} documented
          </span>
        )}
      </div>
      {allergies.length === 0 ? (
        <p className="text-sm text-gray-400">No allergy documentation on file.</p>
      ) : (
        <ul>
          {allergies.map((allergy) => (
            <li
              key={allergy.substance}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-sm text-gray-800">{allergy.substance}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-400">Confirm with patient at intake.</p>
    </section>
  );
}
