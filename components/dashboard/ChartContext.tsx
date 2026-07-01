interface Props {
  items: string[];
}

export default function ChartContext({ items }: Props) {
  return (
    <section className="px-10 py-8 border-b border-gray-100">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-5">
        Pre-Intake Briefing
      </h2>
      {items.length > 0 ? (
        <div className="border-l-2 border-brand/20 pl-5 space-y-3 max-w-2xl">
          {items.map((item, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No chart context available for this patient.
        </p>
      )}
      <p className="mt-5 text-[11px] text-gray-400">
        Chart context only — not clinical guidance.
      </p>
    </section>
  );
}
