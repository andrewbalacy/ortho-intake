export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-blue-700 font-semibold text-base tracking-tight">OrthoIntake</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-medium">v0.1</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">Prototype · Synthetic Data Only</span>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
