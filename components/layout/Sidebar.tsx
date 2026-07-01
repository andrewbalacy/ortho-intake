"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PatientList from "./PatientList";
import type { PatientSummary } from "@/types/patient";

const NAV_ITEMS = [
  {
    label: "Patient Intake",
    href: "/",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label: "FHIR Explorer",
    href: "/fhir-explorer",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

function NavItem({
  label,
  href,
  icon,
  active,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  const base =
    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-[13px]";

  if (active) {
    return (
      <div className={`${base} bg-brand/10 text-brand font-medium`}>
        <span className="text-brand/60 flex-shrink-0">{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} text-gray-500 hover:bg-gray-50 hover:text-gray-900`}
    >
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

interface Props {
  patients?: PatientSummary[];
  currentPatientId?: string;
}

export default function Sidebar({ patients, currentPatientId }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-gray-900">
            OrthoIntake
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-0.5 flex-shrink-0">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <NavItem
              key={label}
              label={label}
              href={href}
              icon={icon}
              active={active}
            />
          );
        })}
      </nav>

      {/* Patient list */}
      {patients && patients.length > 0 && currentPatientId !== undefined && (
        <div className="mt-5 pt-4 border-t border-gray-100 px-3 flex-shrink-0 overflow-y-auto flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400 px-2 mb-2">
            Patients
          </p>
          <PatientList patients={patients} currentPatientId={currentPatientId} />
        </div>
      )}

      <div className="flex-1" />

      {/* SMART Sandbox status */}
      <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-[11px] font-medium text-gray-600">
            SMART Sandbox
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-gray-400 leading-relaxed">
          Connected · Synthetic data
        </p>
      </div>
    </aside>
  );
}
