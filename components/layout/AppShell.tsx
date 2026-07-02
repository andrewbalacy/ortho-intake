"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import type { PatientSummary } from "@/types/patient";

interface Props {
  children: React.ReactNode;
  patientList?: PatientSummary[];
  currentPatientId?: string;
}

export default function AppShell({ children, patientList, currentPatientId }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static column on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar patients={patientList} currentPatientId={currentPatientId} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-surface flex flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 flex-shrink-0 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg hover:bg-gray-50 text-gray-500 touch-manipulation"
            aria-label="Open navigation"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-gray-900">OrthoIntake</span>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
