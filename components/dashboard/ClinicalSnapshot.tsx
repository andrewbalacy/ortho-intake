type FlagColor = "blue" | "amber" | "green";

interface SnapshotFlag {
  label: string;
  detail: string;
  color: FlagColor;
}

const flags: SnapshotFlag[] = [
  {
    label: "Prior orthopedic history detected",
    detail: "Chart context available",
    color: "blue",
  },
  {
    label: "Allergy documentation present",
    detail: "2 substances on record",
    color: "amber",
  },
  {
    label: "Recent encounter within 60 days",
    detail: "Last seen 2026-05-14",
    color: "blue",
  },
  {
    label: "Intake summary ready for review",
    detail: "Supports intake workflow",
    color: "green",
  },
];

const colorMap: Record<FlagColor, { wrapper: string; dot: string; label: string; detail: string; badge: string }> = {
  blue: {
    wrapper: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    label: "text-blue-900",
    detail: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  amber: {
    wrapper: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
    label: "text-amber-900",
    detail: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  green: {
    wrapper: "bg-green-50 border-green-200",
    dot: "bg-green-500",
    label: "text-green-900",
    detail: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
};

export default function ClinicalSnapshot() {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Clinical Snapshot — Informational Flags
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {flags.map((flag) => {
          const c = colorMap[flag.color];
          return (
            <div key={flag.label} className={`border rounded-lg px-4 py-3.5 ${c.wrapper}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${c.badge}`}>
                  Informational
                </span>
              </div>
              <p className={`text-sm font-medium leading-snug ${c.label}`}>{flag.label}</p>
              <p className={`text-xs mt-1 ${c.detail}`}>{flag.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
