interface Props {
  items: string[];
}

export default function ChartContext({ items }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-7 py-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-5 h-5 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 mb-4">
            Pre-Intake Briefing
          </h2>

          {items.length > 0 ? (
            <ul className="space-y-2.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">
              No chart context available for this patient.
            </p>
          )}

          <p className="mt-4 text-[11px] text-gray-400">
            Chart context only — not clinical guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
