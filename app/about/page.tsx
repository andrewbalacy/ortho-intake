import AppShell from "@/components/layout/AppShell";

const CAPABILITIES = [
  "SMART on FHIR sandbox integration with environment-driven patient resolution",
  "Patient demographics and visit context extracted from FHIR R4 resources",
  "Reason for visit derived from Encounter reasonCode and type fallback chain",
  "Condition and allergy transformation with active-status filtering",
  "Recent encounter history with consistent date-based ordering",
  "FHIR Explorer — raw resource view alongside the interpreted intake summary",
];

const ARCHITECTURE: [string, string][] = [
  ["Frontend", "Next.js · React · TypeScript"],
  ["FHIR standard", "R4 — Patient, Condition, Encounter, AllergyIntolerance"],
  ["Service layer", "Server-side FHIR fetch with parallel requests and graceful degradation"],
  ["Transform layer", "Deterministic clinical context built from raw resource bundles"],
  ["Encounter logic", "Shared date-extraction helper ensures intake and explorer agree on recency"],
  ["UI", "Componentized dashboard — each card is an isolated, typed React component"],
];

export default function AboutPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 pt-7 pb-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Project Overview
            </span>
            <svg
              className="w-3 h-3 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-[11px] font-semibold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
              v1
            </span>
          </div>
          <h1 className="text-[2.75rem] font-bold tracking-tight text-gray-900 leading-none">
            OrthoIntake
          </h1>
          <p className="mt-3.5 text-base text-gray-500 max-w-xl leading-relaxed">
            A SMART on FHIR clinical intake dashboard for orthopedic workflows.
          </p>
        </div>

        {/* What it is / Why it exists */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6">
          <div className="grid grid-cols-2 gap-12 max-w-3xl">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                What it is
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                OrthoIntake connects to a SMART on FHIR sandbox and transforms raw FHIR R4
                resources into a structured, clinician-facing intake summary — surfacing the
                information a provider needs before an orthopedic visit begins.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Why it exists
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                To demonstrate real interoperability work: mapping FHIR resources through a
                deliberate extraction and transformation pipeline — with traceable field-level
                logic, deterministic fallback chains, and graceful degradation throughout.
              </p>
            </div>
          </div>
        </div>

        {/* Core capabilities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5">
            Core Capabilities
          </p>
          <ul className="space-y-3.5 max-w-2xl">
            {CAPABILITIES.map((cap) => (
              <li key={cap} className="flex items-start gap-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-[7px] flex-shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical architecture */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5">
            Technical Architecture
          </p>
          <div className="space-y-3.5 max-w-2xl">
            {ARCHITECTURE.map(([label, detail]) => (
              <div key={label} className="flex items-baseline gap-6">
                <span className="text-[12px] text-gray-400 w-32 shrink-0">{label}</span>
                <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design decision + status */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Design Decision
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              OrthoIntake does not surface AI-generated diagnoses or clinical recommendations.
              The focus is data transformation, extraction traceability, and workflow context —
              building the kind of structured pre-visit summary a real EHR integration might
              produce, without overstating what a synthetic sandbox environment can claim.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Current Status
            </p>
            <p className="text-sm text-gray-700">
              v1 portfolio project · Synthetic SMART sandbox data · Not for clinical use.
            </p>
            <p className="mt-4 text-[11px] text-gray-400">
              Built by Andrew Balacy · Portfolio — for reference only.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
