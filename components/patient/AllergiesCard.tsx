import { Allergy } from "@/types/patient";

interface Props {
  allergies: Allergy[];
}

export default function AllergiesCard({ allergies }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
          Allergies
        </h2>
        {allergies.length > 0 && (
          <span className="text-[11px] font-medium text-amber-600">
            {allergies.length} on record
          </span>
        )}
      </div>

      {allergies.length === 0 ? (
        <p className="text-sm text-gray-400">No allergy documentation on file.</p>
      ) : (
        <ul className="space-y-1.5">
          {allergies.map((allergy) => (
            <li key={allergy.substance} className="flex items-center gap-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900">{allergy.substance}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[11px] text-gray-300">Confirm with patient at intake.</p>
    </section>
  );
}
