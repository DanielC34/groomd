"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Mobile/tablet booking summary shown inside the action bar (DESIGN §11.2–11.3).
 * Provided by the booking page; `line` is the CONTENT collapsed summary line
 * ("{Service} · {Short date} · {HH:MM}") and `details` is the full live summary.
 */
export interface MobileSummary {
  line: string;
  details: ReactNode;
}

export const MobileSummaryContext = createContext<MobileSummary | null>(null);

/**
 * Step action bar.
 * - Below lg: sticky at the bottom of the viewport, white with a top border and shadow-2,
 *   safe-area aware, with the collapsible summary above the actions. Below sm the actions
 *   stack with a full-width primary on top.
 * - lg+: the original inline row (Back left, primary right); the sidebar holds the summary.
 */
export function BookingActionBar({ back, primary }: { back?: ReactNode; primary: ReactNode }) {
  const summary = useContext(MobileSummaryContext);

  return (
    <>
      {/* Below sm the secondary Back action sits in the page flow, keeping the sticky bar compact. */}
      {back && <div className="sm:hidden flex justify-center pt-2">{back}</div>}
      <div
        className={[
          "sticky bottom-0 z-30 -mx-5 px-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pt-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-[0_-8px_24px_rgba(68,4,15,0.10)]",
          "lg:static lg:mx-0 lg:px-0 lg:pt-2 lg:pb-0 lg:bg-transparent lg:border-0 lg:shadow-none",
        ].join(" ")}
      >
        {summary && (
          <details className="group lg:hidden mb-2 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] min-w-0">
            <summary className="flex items-center gap-2 px-3 min-h-[44px] cursor-pointer list-none [&::-webkit-details-marker]:hidden min-w-0">
              <span className="flex-1 min-w-0 truncate font-body text-sm font-semibold text-[var(--color-brand-primary)]">
                {summary.line}
              </span>
              <ChevronDown
                className="w-4 h-4 shrink-0 text-[var(--color-brand-primary)] transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div className="max-h-[50vh] overflow-y-auto px-1 pb-1">{summary.details}</div>
          </details>
        )}
        <div className="flex items-center justify-end gap-4 sm:justify-between">
          {back && <div className="hidden sm:block">{back}</div>}
          <div className="w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">{primary}</div>
        </div>
      </div>
    </>
  );
}
