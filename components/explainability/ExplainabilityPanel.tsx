"use client";

import { useState } from "react";
import type { ExplainabilityData, AnnotatedField, Confidence } from "@/types/explainability";

// ---------------------------------------------------------------------------
// Confidence badge
// ---------------------------------------------------------------------------

const BADGE_STYLE: Record<Confidence, string> = {
  High:   "text-emerald-700 bg-emerald-50",
  Medium: "text-amber-700 bg-amber-50",
  Low:    "text-gray-500 bg-gray-100",
};

const CONF_RANK: Record<Confidence, number> = { High: 2, Medium: 1, Low: 0 };

function lowerConf(a: Confidence, b: Confidence): Confidence {
  return CONF_RANK[a] <= CONF_RANK[b] ? a : b;
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${BADGE_STYLE[confidence]}`}
    >
      {confidence}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Expanded source detail
// ---------------------------------------------------------------------------

function SourceDetail({ field }: { field: AnnotatedField }) {
  return (
    <div className="pl-7 pr-4 py-3 bg-gray-50 space-y-2 rounded-b-lg">
      <div className="flex items-start gap-4">
        <span className="text-[10px] text-gray-400 w-24 shrink-0 pt-0.5">Source</span>
        <span className="text-[12px] text-gray-600">
          {field.source.resource}
          <span className="text-gray-300 mx-1.5">·</span>
          <span className="font-mono text-[11px] text-gray-500">{field.source.field}</span>
        </span>
      </div>
      <div className="flex items-start gap-4">
        <span className="text-[10px] text-gray-400 w-24 shrink-0 pt-0.5">Resource ID</span>
        <span className="font-mono text-[11px] text-gray-400 break-all">
          {field.source.resourceId}
        </span>
      </div>
    </div>
  );
}

function EncounterSourceDetail({
  type,
  date,
}: {
  type: AnnotatedField;
  date: AnnotatedField;
}) {
  return (
    <div className="pl-7 pr-4 py-3 bg-gray-50 space-y-3 rounded-b-lg">
      {(
        [
          ["Type", type],
          ["Date", date],
        ] as [string, AnnotatedField][]
      ).map(([label, field]) => (
        <div key={label} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-8 shrink-0">{label}</span>
            <ConfidenceBadge confidence={field.confidence} />
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[10px] text-gray-400 w-24 shrink-0 pt-0.5">Source</span>
            <span className="text-[12px] text-gray-600">
              {field.source.resource}
              <span className="text-gray-300 mx-1.5">·</span>
              <span className="font-mono text-[11px] text-gray-500">{field.source.field}</span>
            </span>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[10px] text-gray-400 w-24 shrink-0 pt-0.5">Resource ID</span>
            <span className="font-mono text-[11px] text-gray-400 break-all">
              {field.source.resourceId}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row components
// ---------------------------------------------------------------------------

function FieldRow({
  id,
  label,
  field,
  expanded,
  onToggle,
}: {
  id: string;
  label: string;
  field: AnnotatedField;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-2.5 px-2 -mx-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-[9px] text-gray-300 w-2.5 shrink-0 select-none">
          {expanded ? "▼" : "▶"}
        </span>
        <span className="text-[11px] text-gray-400 w-36 shrink-0">{label}</span>
        <span className="text-sm text-gray-800 flex-1 truncate min-w-0">{field.value}</span>
        <ConfidenceBadge confidence={field.confidence} />
      </button>
      {expanded && <SourceDetail field={field} />}
    </div>
  );
}

function EncounterRow({
  index,
  enc,
  expanded,
  onToggle,
}: {
  index: number;
  enc: { type: AnnotatedField; date: AnnotatedField };
  expanded: boolean;
  onToggle: () => void;
}) {
  const badge = lowerConf(enc.type.confidence, enc.date.confidence);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-2.5 px-2 -mx-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-[9px] text-gray-300 w-2.5 shrink-0 select-none">
          {expanded ? "▼" : "▶"}
        </span>
        <span className="text-[11px] text-gray-400 w-36 shrink-0">
          Encounter {index + 1}
        </span>
        <span className="text-sm text-gray-800 flex-1 min-w-0 truncate">
          {enc.type.value}
          <span className="text-gray-300 mx-1.5">·</span>
          <span className="font-mono text-[12px]">{enc.date.value}</span>
        </span>
        <ConfidenceBadge confidence={badge} />
      </button>
      {expanded && <EncounterSourceDetail type={enc.type} date={enc.date} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------

function SectionLabel({ label, count }: { label: string; count?: number }) {
  return (
    <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-gray-300 mt-7 mb-3 first:mt-0">
      {label}
      {count !== undefined && (
        <span className="ml-1 font-normal">({count})</span>
      )}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export default function ExplainabilityPanel({
  data,
}: {
  data: ExplainabilityData;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const isOpen = (key: string) => expanded.has(key);

  return (
    <section>
      <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-2">
        Data Provenance
      </h2>
      <p className="text-[11px] text-gray-400 leading-relaxed mb-8 max-w-xl">
        Field-level attribution for each derived intake value — source FHIR
        resource, field path, and extraction confidence.
      </p>

      {/* Demographics */}
      <div>
        <SectionLabel label="Demographics" />
        {(
          [
            ["demo.name", "Name", data.demographics.name],
            ["demo.dob", "Date of Birth", data.demographics.dob],
            ["demo.sex", "Sex", data.demographics.sex],
            ["demo.mrn", "MRN", data.demographics.mrn],
          ] as [string, string, AnnotatedField][]
        ).map(([id, label, field]) => (
          <FieldRow
            key={id}
            id={id}
            label={label}
            field={field}
            expanded={isOpen(id)}
            onToggle={() => toggle(id)}
          />
        ))}
      </div>

      {/* Visit context */}
      <div>
        <SectionLabel label="Visit Context" />
        {(
          [
            ["visit.reason", "Reason for Visit", data.visit.reasonForVisit],
            ["visit.appt", "Appointment Type", data.visit.appointmentType],
          ] as [string, string, AnnotatedField][]
        ).map(([id, label, field]) => (
          <FieldRow
            key={id}
            id={id}
            label={label}
            field={field}
            expanded={isOpen(id)}
            onToggle={() => toggle(id)}
          />
        ))}
      </div>

      {/* Conditions */}
      {data.conditions.length > 0 && (
        <div>
          <SectionLabel label="Conditions" count={data.conditions.length} />
          {data.conditions.map((field, i) => (
            <FieldRow
              key={i}
              id={`cond.${i}`}
              label={`Condition ${i + 1}`}
              field={field}
              expanded={isOpen(`cond.${i}`)}
              onToggle={() => toggle(`cond.${i}`)}
            />
          ))}
        </div>
      )}

      {/* Allergies */}
      {data.allergies.length > 0 && (
        <div>
          <SectionLabel label="Allergies" count={data.allergies.length} />
          {data.allergies.map((field, i) => (
            <FieldRow
              key={i}
              id={`allergy.${i}`}
              label={`Allergy ${i + 1}`}
              field={field}
              expanded={isOpen(`allergy.${i}`)}
              onToggle={() => toggle(`allergy.${i}`)}
            />
          ))}
        </div>
      )}

      {/* Encounters */}
      {data.encounters.length > 0 && (
        <div>
          <SectionLabel
            label="Recent Encounters"
            count={data.encounters.length}
          />
          {data.encounters.map((enc, i) => (
            <EncounterRow
              key={i}
              index={i}
              enc={enc}
              expanded={isOpen(`enc.${i}`)}
              onToggle={() => toggle(`enc.${i}`)}
            />
          ))}
        </div>
      )}

      <p className="mt-8 text-[11px] text-gray-300">
        Chart context — for reference only.
      </p>
    </section>
  );
}
