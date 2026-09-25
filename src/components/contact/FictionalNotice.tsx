import { ShieldCheck } from "lucide-react";

export function FictionalNotice() {
  return (
    <div className="bg-[var(--color-background)] pb-16">
      <div className="container max-w-3xl">
        <div className="p-4 rounded-[var(--radius-lg)] bg-[#FAF4E6] border border-[#E8DCC4] flex items-start sm:items-center gap-3 text-xs font-body text-[var(--color-text-secondary)] shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-[var(--color-brand-primary)]">Design Assessment Notice:</strong> Groomd is a fictional studio created for a design assessment. The address, phone number and email are illustrative and not monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
