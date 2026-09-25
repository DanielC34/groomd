import { businessInfo } from "@/lib/data/business";
import { Store } from "lucide-react";

export function QuickCutNotice() {
  return (
    <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex items-center gap-3.5 mt-4">
      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)]">
        <Store className="w-5 h-5" />
      </div>
      <div className="text-xs font-body">
        <h4 className="font-display font-bold text-sm text-[var(--color-brand-primary)]">
          Need a quick cut today?
        </h4>
        <p className="text-[var(--color-text-secondary)]">
          Call{" "}
          <a
            href={`tel:${businessInfo.phone.tel}`}
            className="font-semibold text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-secondary)]"
          >
            {businessInfo.phone.display}
          </a>{" "}
          for walk-in availability.
        </p>
      </div>
    </div>
  );
}
