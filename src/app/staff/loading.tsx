import { ReactNode } from "react";

export default function StaffLoading(): ReactNode {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <svg
            className="mx-auto mb-4 text-[var(--color-text-muted)] w-12 h-12 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[var(--color-text-secondary)] font-body">
            Loading appointments
          </p>
        </div>
      </div>
    </div>
  );
}