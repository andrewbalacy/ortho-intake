import AppShell from "@/components/layout/AppShell";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

export default function Loading() {
  return (
    <AppShell>
      {/* Patient header skeleton */}
      <div className="px-12 pt-14 pb-12 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-7">
          <Bone className="h-3 w-24" />
          <Bone className="h-5 w-36 rounded-full" />
        </div>
        <Bone className="h-12 w-72" />
        <div className="mt-5 flex items-center gap-4">
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-14" />
          <Bone className="h-4 w-28" />
          <Bone className="h-4 w-24" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-10 max-w-xl">
          <div>
            <Bone className="h-3 w-24 mb-2" />
            <Bone className="h-6 w-44" />
          </div>
          <div>
            <Bone className="h-3 w-16 mb-2" />
            <Bone className="h-6 w-20" />
          </div>
        </div>
      </div>

      {/* Briefing skeleton */}
      <div className="px-12 py-10 border-b border-gray-100">
        <Bone className="h-3 w-36 mb-6" />
        <div className="border-l-2 border-gray-100 pl-5 space-y-3.5 max-w-2xl">
          <Bone className="h-5 w-full" />
          <Bone className="h-5 w-4/5" />
          <Bone className="h-5 w-3/4" />
          <Bone className="h-5 w-2/3" />
        </div>
      </div>

      {/* Medical background skeleton */}
      <div className="px-12 py-10 border-b border-gray-100">
        <div className="grid grid-cols-2">
          <div className="pr-16 space-y-3">
            <Bone className="h-3 w-28 mb-5" />
            <Bone className="h-4 w-48" />
            <Bone className="h-4 w-40" />
            <Bone className="h-4 w-52" />
          </div>
          <div className="border-l border-gray-100 pl-16 space-y-3">
            <Bone className="h-3 w-16 mb-5" />
            <Bone className="h-4 w-32" />
            <Bone className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Encounter timeline skeleton */}
      <div className="px-12 py-10">
        <Bone className="h-3 w-36 mb-10" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-6 mb-9">
            <div className="w-12 space-y-1.5 text-right">
              <Bone className="h-2.5 w-8 ml-auto" />
              <Bone className="h-8 w-10 ml-auto" />
              <Bone className="h-2.5 w-8 ml-auto" />
            </div>
            <div className="w-5 flex flex-col items-center pt-2">
              <Bone className="w-2 h-2 rounded-full" />
            </div>
            <div className="flex-1 pt-1.5">
              <Bone className="h-5 w-56" />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
