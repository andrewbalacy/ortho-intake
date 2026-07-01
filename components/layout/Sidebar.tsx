"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PatientList from "./PatientList";
import type { PatientSummary } from "@/types/patient";

const NAV_ITEMS: Array<{ label: string; href: string | null }> = [
  { label: "Patient Intake", href: "/" },
  { label: "FHIR Explorer", href: "/fhir-explorer" },
  { label: "About", href: "/about" },
];

function NavItem({
  label,
  href,
  active,
}: {
  label: string;
  href: string | null;
  active: boolean;
}) {
  if (!href) {
    return (
      <div className="flex items-center px-3 py-2 rounded-lg cursor-default select-none">
        <span className="text-[13px] text-gray-300">{label}</span>
      </div>
    );
  }

  if (active) {
    return (
      <div className="relative flex items-center px-3 py-2 rounded-lg bg-brand/10">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r-full" />
        <span className="text-[13px] font-medium text-brand pl-1">{label}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-[13px] text-gray-600">{label}</span>
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
    <aside className="w-52 shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Wordmark */}
      <div className="px-5 pt-8 pb-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
          <span className="text-[13px] font-semibold tracking-tight text-gray-900">
            OrthoIntake
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-0.5 flex-shrink-0">
        {NAV_ITEMS.map(({ label, href }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : href !== null && pathname.startsWith(href);
          return (
            <NavItem key={label} label={label} href={href} active={active} />
          );
        })}
      </nav>

      {/* Patient list */}
      {patients && patients.length > 0 && currentPatientId !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100 px-3 flex-shrink-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-gray-400 px-3 mb-2">
            Patients
          </p>
          <PatientList patients={patients} currentPatientId={currentPatientId} />
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* SMART Sandbox status */}
      <div className="px-5 py-5 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-[11px] text-gray-500">SMART Sandbox</span>
        </div>
        <p className="mt-1 text-[10px] text-gray-400 leading-relaxed">
          Connected · Synthetic data
        </p>
      </div>
    </aside>
  );
}
