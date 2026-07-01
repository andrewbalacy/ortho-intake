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
      {/* Header */}
      <header className="px-12 pt-14 pb-12 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-7">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
            Project Overview
          </span>
          <span className="text-gray-200 select-none">·</span>
          <span className="text-[11px] font-medium text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
            v1
          </span>
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 leading-none">
          OrthoIntake
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-xl leading-relaxed">
          A SMART on FHIR clinical intake dashboard for orthopedic workflows.
        </p>
      </header>

      {/* What it is / Why it exists */}
      <div className="px-12 py-10 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-16 max-w-3xl">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
              What it is
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              OrthoIntake connects to a SMART on FHIR sandbox and transforms raw FHIR R4
              resources into a structured, clinician-facing intake summary — surfacing the
              information a provider needs before an orthopedic visit begins.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
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
      <div className="px-12 py-10 border-b border-gray-100">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-8">
          Core Capabilities
        </p>
        <ul className="space-y-3.5 max-w-2xl">
          {CAPABILITIES.map((cap) => (
            <li key={cap} className="flex items-start gap-3.5">
              <span className="w-1 h-1 rounded-full bg-brand mt-[7px] flex-shrink-0" />
              <span className="text-sm text-gray-700 leading-relaxed">{cap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technical architecture */}
      <div className="px-12 py-10 border-b border-gray-100">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-8">
          Technical Architecture
        </p>
        <div className="space-y-4 max-w-2xl">
          {ARCHITECTURE.map(([label, detail]) => (
            <div key={label} className="flex items-baseline gap-6">
              <span className="text-[11px] text-gray-400 w-28 shrink-0">{label}</span>
              <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Design decision */}
      <div className="px-12 py-10 border-b border-gray-100">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
          Design Decision
        </p>
        <p className="text-sm text-gray-700 leading-relaxed max-w-xl">
          OrthoIntake does not surface AI-generated diagnoses or clinical recommendations.
          The focus is data transformation, extraction traceability, and workflow context —
          building the kind of structured pre-visit summary a real EHR integration might
          produce, without overstating what a synthetic sandbox environment can claim.
        </p>
      </div>

      {/* Status */}
      <div className="px-12 py-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
          Current Status
        </p>
        <p className="text-sm text-gray-700">
          v1 portfolio project · Synthetic SMART sandbox data · Not for clinical use.
        </p>
        <p className="mt-6 text-[11px] text-gray-300">
          Built by Andrew Balacy · Portfolio — for reference only.
        </p>
      </div>
    </AppShell>
  );
}
