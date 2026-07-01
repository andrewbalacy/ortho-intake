interface Props {
  items: string[];
}

export default function ChartContext({ items }: Props) {
  return (
    <section className="pl-4 border-l-2 border-brand/30">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Chart Context
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
            <span className="mt-[7px] block w-1 h-1 rounded-full bg-brand/50 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-gray-400">
        Chart context only — not clinical guidance.
      </p>
    </section>
  );
}
