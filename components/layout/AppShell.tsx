interface Props {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ header, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified chrome: nav + patient header share one elevated white block */}
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <nav>
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-brand tracking-tight">OrthoIntake</span>
              <span className="text-gray-200 select-none">|</span>
              <span className="text-sm text-gray-400">Clinical Intake Dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>FHIR R4 Sandbox</span>
              <span className="text-gray-300">·</span>
              <span>Synthetic Data</span>
            </div>
          </div>
        </nav>
        {header && <div className="border-t border-gray-100">{header}</div>}
      </div>

      {/* Content canvas: white surface floating on gray-50 */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
