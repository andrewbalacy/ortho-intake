"use client";

import { useState } from "react";
import type { ExplorerData } from "@/types/explorer";
import type {
  FHIRPatient,
  FHIRCondition,
  FHIRAllergyIntolerance,
  FHIREncounter,
} from "@/lib/fhir/types";

type ResourceType = "Patient" | "Condition" | "AllergyIntolerance" | "Encounter";

const RESOURCE_ROLE: Record<ResourceType, string> = {
  Patient:
    "Identifies the patient and provides demographics used throughout the intake workflow — name, date of birth, sex, and MRN.",
  Condition:
    "Active conditions build the pre-intake clinical briefing and drive orthopedic relevance scoring that ranks patients in the selector.",
  AllergyIntolerance:
    "Active allergies surface at the top of the intake briefing so clinical staff can verify documentation before the appointment.",
  Encounter:
    "Recent encounters populate the chart history panel and contribute the most recent reason-for-visit and appointment type.",
};

const RESOURCE_COLOR: Record<ResourceType, { bg: string; text: string; dot: string }> = {
  Patient: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  Condition: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  AllergyIntolerance: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  Encounter: { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" },
};

const JSON_PREVIEW_LIMIT = 3;

// ---------------------------------------------------------------------------
// Top-level view
// ---------------------------------------------------------------------------

export default function ExplorerView({ data }: { data: ExplorerData }) {
  const [selected, setSelected] = useState<ResourceType>("Patient");

  const groups: Array<{
    type: ResourceType;
    count: number;
    ok: boolean;
    error?: string;
  }> = [
    { type: "Patient", count: 1, ok: true },
    {
      type: "Condition",
      count: data.conditions.resources.length,
      ok: data.conditions.ok,
      error: data.conditions.error,
    },
    {
      type: "AllergyIntolerance",
      count: data.allergies.resources.length,
      ok: data.allergies.ok,
      error: data.allergies.error,
    },
    {
      type: "Encounter",
      count: data.encounters.resources.length,
      ok: data.encounters.ok,
      error: data.encounters.error,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 pt-5 pb-5 md:px-8 md:pt-7 md:pb-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            FHIR Explorer
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
            R4 Resources
          </span>
        </div>
        <h1 className="text-[1.75rem] md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-none">
          {data.intake.patient.name}
        </h1>
        <p className="mt-3.5 text-sm text-gray-500 max-w-xl leading-relaxed">
          Raw FHIR R4 resources from the SMART Health IT sandbox, alongside the
          values OrthoIntake extracts for clinical intake workflows.
        </p>
      </div>

      {/* Body: resource group list + detail panel */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
        {/* Left: resource groups */}
        <div className="w-full md:w-56 md:shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm py-5 px-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-400 px-3 mb-3">
            Resource Groups
          </p>
          <ul className="space-y-0.5">
            {groups.map((g) => {
              const isActive = selected === g.type;
              const color = RESOURCE_COLOR[g.type];
              return (
                <li key={g.type}>
                  <button
                    onClick={() => setSelected(g.type)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? color.bg : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            g.ok ? color.dot : "bg-red-400"
                          }`}
                        />
                        <span
                          className={`text-[13px] font-medium ${
                            isActive ? color.text : "text-gray-700"
                          }`}
                        >
                          {g.type}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono ${
                          g.ok ? "text-gray-400" : "text-red-400"
                        }`}
                      >
                        {g.ok ? g.count : "!"}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 pl-3.5 ${
                        g.ok ? "text-gray-400" : "text-red-400"
                      }`}
                    >
                      {g.ok
                        ? `${g.count} resource${g.count !== 1 ? "s" : ""}`
                        : (g.error ?? "Fetch failed")}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-8">
          <ResourceDetailPanel selected={selected} data={data} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------

function ResourceDetailPanel({
  selected,
  data,
}: {
  selected: ResourceType;
  data: ExplorerData;
}) {
  const color = RESOURCE_COLOR[selected];

  return (
    <div>
      {/* Resource type + role */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${color.bg} ${color.text}`}
          >
            {selected}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
          {RESOURCE_ROLE[selected]}
        </p>
      </div>

      <div className="border-t border-gray-100 my-6" />

      {/* Extracted values */}
      <section className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Extracted by OrthoIntake
        </p>
        <ExtractedValues selected={selected} data={data} />
      </section>

      <div className="border-t border-gray-100 my-6" />

      {/* Raw FHIR JSON */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Raw FHIR JSON
        </p>
        <RawJsonPanel selected={selected} data={data} />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Extracted values — one layout per resource type
// ---------------------------------------------------------------------------

function ExtractedValues({
  selected,
  data,
}: {
  selected: ResourceType;
  data: ExplorerData;
}) {
  const { intake } = data;

  if (selected === "Patient") {
    const p = intake.patient;
    return (
      <dl className="space-y-3 max-w-md">
        {(
          [
            ["Name", p.name],
            ["Age", `${p.age} years`],
            ["Date of Birth", p.dob],
            ["Sex", p.sex],
            ["MRN", p.mrn],
            ["Reason for Visit", p.reasonForVisit],
            ["Appointment Type", p.appointmentType],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-6 gap-0.5">
            <dt className="sm:w-36 sm:shrink-0 text-[11px] text-gray-400 sm:pt-0.5">
              {label}
            </dt>
            <dd className="text-[13px] font-mono text-gray-800">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (selected === "Condition") {
    if (intake.conditions.length === 0) {
      return <p className="text-sm text-gray-400">No active conditions on file.</p>;
    }
    return (
      <ul className="space-y-2.5">
        {intake.conditions.map((c) => (
          <li key={c.name} className="flex items-start gap-3">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-sm text-gray-800">{c.name}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (selected === "AllergyIntolerance") {
    if (intake.allergies.length === 0) {
      return <p className="text-sm text-gray-400">No active allergies on file.</p>;
    }
    return (
      <ul className="space-y-2.5">
        {intake.allergies.map((a) => (
          <li key={a.substance} className="flex items-start gap-3">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-sm text-gray-800">{a.substance}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Encounter
  if (intake.recentEncounters.length === 0) {
    return <p className="text-sm text-gray-400">No encounters on file.</p>;
  }
  return (
    <dl className="space-y-3">
      {intake.recentEncounters.map((e, i) => (
        <div key={i} className="flex gap-6">
          <dt className="w-28 shrink-0 text-[11px] font-mono text-gray-400 pt-0.5">
            {e.date}
          </dt>
          <dd className="text-sm text-gray-800">{e.type}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// Raw JSON collapsible panel
// ---------------------------------------------------------------------------

function RawJsonPanel({
  selected,
  data,
}: {
  selected: ResourceType;
  data: ExplorerData;
}) {
  let jsonPayload:
    | FHIRPatient
    | FHIRCondition[]
    | FHIRAllergyIntolerance[]
    | FHIREncounter[];
  let totalCount: number;

  if (selected === "Patient") {
    jsonPayload = data.patient;
    totalCount = 1;
  } else if (selected === "Condition") {
    totalCount = data.conditions.resources.length;
    jsonPayload = data.conditions.resources.slice(0, JSON_PREVIEW_LIMIT);
  } else if (selected === "AllergyIntolerance") {
    totalCount = data.allergies.resources.length;
    jsonPayload = data.allergies.resources.slice(0, JSON_PREVIEW_LIMIT);
  } else {
    totalCount = data.encounters.resources.length;
    jsonPayload = data.encounters.resources.slice(0, JSON_PREVIEW_LIMIT);
  }

  const shown = selected === "Patient" ? 1 : Math.min(totalCount, JSON_PREVIEW_LIMIT);
  const summaryLabel =
    selected === "Patient"
      ? "1 resource"
      : totalCount > JSON_PREVIEW_LIMIT
      ? `Showing ${shown} of ${totalCount} resources`
      : `${totalCount} resource${totalCount !== 1 ? "s" : ""}`;

  return (
    <details className="border border-gray-100 rounded-lg overflow-hidden">
      <summary className="px-4 py-3 bg-gray-50 text-[12px] text-gray-500 cursor-pointer hover:bg-gray-100 select-none transition-colors">
        {summaryLabel}
      </summary>
      <pre className="px-4 py-4 text-[11px] font-mono text-gray-600 overflow-auto max-h-[400px] max-w-full leading-relaxed bg-white">
        <code>{JSON.stringify(jsonPayload, null, 2)}</code>
      </pre>
    </details>
  );
}
