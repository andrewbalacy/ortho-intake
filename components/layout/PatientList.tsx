import Link from "next/link";
import type { PatientSummary } from "@/types/patient";

interface Props {
  patients: PatientSummary[];
  currentPatientId: string;
}

export default function PatientList({ patients, currentPatientId }: Props) {
  if (patients.length === 0) {
    return (
      <p className="px-3 text-[11px] text-gray-400">
        No patients found in sandbox.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {patients.map((p) => {
        const isActive = p.id === currentPatientId;
        return (
          <li key={p.id}>
            <Link
              href={`/?patient=${p.id}`}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`block text-[12px] leading-snug truncate ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {p.name}
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {p.age}y · {p.sex}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
