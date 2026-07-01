"use client";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar placeholder — keeps layout consistent with the rest of the app */}
      <div className="w-52 shrink-0 border-r border-gray-100" />

      <div className="flex-1 px-12 pt-14">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 mb-4">
          Connection Error
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Unable to reach FHIR sandbox
        </h1>
        {/* In production, Server Component errors return a generic message.
            The digest can be matched to server logs for diagnosis. */}
        <p className="text-sm text-gray-500 mb-1 max-w-md">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono text-gray-300 mb-6">
            ref: {error.digest}
          </p>
        )}
        <button
          onClick={unstable_retry}
          className="text-sm font-medium text-brand underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
