import AppShell from "@/components/layout/AppShell";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

export default function Loading() {
  return (
    <AppShell>
      {/* Header skeleton */}
      <div className="px-12 pt-14 pb-10 border-b border-gray-100">
        <Bone className="h-3 w-24 mb-5" />
        <Bone className="h-12 w-72 mb-5" />
        <Bone className="h-4 w-96" />
        <Bone className="h-4 w-80 mt-1.5" />
      </div>

      {/* Body skeleton */}
      <div className="flex min-h-[60vh]">
        {/* Resource group list skeleton */}
        <div className="w-64 shrink-0 border-r border-gray-100 py-8 px-4 space-y-1.5">
          <Bone className="h-3 w-24 mx-3 mb-4" />
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-[52px] w-full rounded-lg" />
          ))}
        </div>

        {/* Detail panel skeleton */}
        <div className="flex-1 py-8 px-10 space-y-5 max-w-3xl">
          <Bone className="h-3 w-28 mb-2" />
          <Bone className="h-4 w-full max-w-md" />
          <Bone className="h-4 w-80" />
          <div className="border-t border-gray-100 my-7" />
          <Bone className="h-3 w-36 mb-5" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6">
              <Bone className="h-4 w-32 shrink-0" />
              <Bone className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
