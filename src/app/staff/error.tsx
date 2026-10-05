import { ReactNode } from "react";

export default function StaffError({ error }: { error: unknown }): ReactNode {
  const message =
    error instanceof Error
      ? error.message || "An unexpected error occurred"
      : "An unexpected error occurred";

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <svg
              className="mx-auto mb-4 text-[var(--color-error)] w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L8.98 21H5c-1.667 0-2.5-1.667-1.732-3L2.73 8.94A4.5 4.5 0 0 1 6 6.25l.78-.87a4.5 4.5 0 0 1 6.472 0l.78.87A4.5 4.5 0 0 1 16.73 8.94c1.538 0 2.731 1.252 2.731 2.75c0 1.5.03 2.87.03 3zM5.33 3l2.058.833 1.804 1.403a5.506 5.506 0 0 0 1.105 3.139l-.625.518a5.508 5.508 0 0 1-.288 1.275l-.624-.518a5.506 5.506 0 0 0-1.105-3.139L5.33 3Z"
              />
            </svg>
          </div>

          <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
            Error
          </h2>
          <p className="text-[var(--color-text-secondary)] font-body mb-6">
            Unable to load staff dashboard. Please try again.
          </p>

          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-brand-primary)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-fast"
            aria-label="Retry loading dashboard"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2l-9 2l-4-4m0-4L4 12l8-4 1.41 1.41L12 20l8-4 1.41-1.41L12 4z"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}