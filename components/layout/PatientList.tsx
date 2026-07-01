"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PatientSummary } from "@/types/patient";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
];

function avatarPalette(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffff;
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

interface Props {
  patients: PatientSummary[];
  currentPatientId: string;
}

export default function PatientList({ patients, currentPatientId }: Props) {
  const pathname = usePathname();

  if (patients.length === 0) {
    return (
      <p className="px-2 text-[11px] text-gray-400">
        No patients found in sandbox.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {patients.map((p) => {
        const isActive = p.id === currentPatientId;
        const isOrtho = p.relevanceScore > 0;
        const initials = getInitials(p.name);
        const palette = isActive ? "bg-brand/15 text-brand" : avatarPalette(p.name);

        return (
          <li key={p.id}>
            <Link
              href={`${pathname}?patient=${p.id}`}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors ${
                isActive ? "bg-brand/10" : "hover:bg-gray-50"
              }`}
            >
              {/* Initials avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold ${palette}`}
              >
                {initials}
              </div>

              {/* Name + meta */}
              <div className="min-w-0 flex-1">
                <span
                  className={`block text-[12px] leading-snug truncate ${
                    isActive ? "font-semibold text-brand" : "text-gray-700"
                  }`}
                >
                  {p.name}
                </span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  {p.age}y · {p.sex}
                  {isOrtho && (
                    <span className="ml-1.5 text-[9px] text-brand font-semibold tracking-wide uppercase">
                      Ortho
                    </span>
                  )}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
