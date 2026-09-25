import { businessInfo } from "@/lib/data/business";
import { getServiceById } from "@/lib/data/services";

export interface BookingSummaryProps {
  currentStep: number;
  selectedServiceId?: string;
  barberName?: string; // "No preference" | "Mwila Banda" etc.
  selectedDateText?: string; // e.g. "Saturday, 26 Sept 2026"
  selectedTimeText?: string; // e.g. "14:30 – 15:15 (45 min)"
  onEditService?: () => void;
  onEditBarberTime?: () => void;
  /** Rendered inside the mobile action-bar summary: no sticky positioning, border or shadow. */
  embedded?: boolean;
}

export function BookingSummary({
  currentStep,
  selectedServiceId,
  barberName,
  selectedDateText,
  selectedTimeText,
  onEditService,
  onEditBarberTime,
  embedded = false,
}: BookingSummaryProps) {
  const service = selectedServiceId ? getServiceById(selectedServiceId) : undefined;
  const showBarber = currentStep >= 2;
  const showDateTime = currentStep >= 2;

  return (
    <aside
      className={
        embedded
          ? "w-full p-3"
          : "w-full bg-[var(--color-surface)] border border-[var(--color-border)] border-t-4 border-t-[var(--color-brand-primary)] rounded-[var(--radius-lg)] p-5 md:p-6 shadow-[var(--shadow-1)] sticky top-24"
      }
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
        <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
          Appointment
        </h3>
        <span className="text-[10px] font-body font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-brand-accent)] px-2 py-0.5 rounded-full">
          Step {currentStep} of 4
        </span>
      </div>

      <div className="space-y-4 text-xs font-body">
        {/* Service */}
        <div className="border-b border-[var(--color-border)]/60 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
              SERVICE
            </span>
            {currentStep > 1 && onEditService && (
              <button
                onClick={onEditService}
                className="text-[10px] font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast"
              >
                Change
              </button>
            )}
          </div>
          {service ? (
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-display font-bold text-base text-[var(--color-brand-primary)] block">
                  {service.name}
                </span>
                <span className="text-[var(--color-text-secondary)] text-xs">
                  {service.durationMinutes} mins
                </span>
              </div>
              <span className="font-display font-bold text-base text-[var(--color-brand-primary)]">
                K {service.price}
              </span>
            </div>
          ) : (
            <span className="italic text-[var(--color-text-muted)]">Not selected yet</span>
          )}
        </div>

        {/* Barber */}
        {showBarber && (
          <div className="border-b border-[var(--color-border)]/60 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
                BARBER
              </span>
              {currentStep > 2 && onEditBarberTime && (
                <button
                  onClick={onEditBarberTime}
                  className="text-[10px] font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast"
                >
                  Change
                </button>
              )}
            </div>
            <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
              {barberName ?? "No preference"}
            </span>
            {(!barberName || barberName === "No preference") && (
              <span className="text-[var(--color-text-muted)] text-[10px] block mt-0.5">
                We&apos;ll assign the first available barber.
              </span>
            )}
          </div>
        )}

        {/* Date & Time */}
        {showDateTime && (
          <div className="border-b border-[var(--color-border)]/60 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
                DATE &amp; TIME
              </span>
              {currentStep > 2 && onEditBarberTime && (
                <button
                  onClick={onEditBarberTime}
                  className="text-[10px] font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast"
                >
                  Change
                </button>
              )}
            </div>
            <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
              {selectedDateText ?? "—"}
            </span>
            {selectedTimeText && (
              <span className="text-[var(--color-text-muted)] text-xs block">
                {selectedTimeText}
              </span>
            )}
          </div>
        )}

        {/* Location */}
        <div className="pb-3 border-b border-[var(--color-border)]/60">
          <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px] mb-1">
            ADDRESS
          </span>
          <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
            {businessInfo.name}
          </span>
          <span className="text-[var(--color-text-muted)] text-xs block truncate">
            {businessInfo.address.full}
          </span>
        </div>

        {/* Total */}
        <div className="pt-1 flex items-end justify-between">
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
              Price
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              No payment needed now · Pay in-store
            </span>
          </div>
          <span className="font-display font-extrabold text-2xl text-[var(--color-brand-primary)]">
            K {service ? service.price : 0}
          </span>
        </div>

      </div>
    </aside>
  );
}
