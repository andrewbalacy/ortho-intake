import { Allergy } from "@/types/patient";

interface Props {
  allergies: Allergy[];
}

export default function AllergiesCard({ allergies }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Allergies</h2>
        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          {allergies.length} on record
        </span>
      </div>
      {allergies.length === 0 ? (
        <p className="text-sm text-gray-400">No allergy documentation on file.</p>
      ) : (
        <ul className="space-y-2">
          {allergies.map((allergy) => (
            <li
              key={allergy.substance}
              className="flex items-center gap-2.5 text-sm text-amber-900 bg-amber-50 border border-amber-100 rounded-md px-3 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              {allergy.substance}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-3">Verify with patient at time of intake.</p>
    </div>
  );
}
