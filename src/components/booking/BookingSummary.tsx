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
}

export function BookingSummary({
  currentStep,
  selectedServiceId,
  barberName,
  selectedDateText,
  selectedTimeText,
  onEditService,
  onEditBarberTime,
}: BookingSummaryProps) {
  const service = selectedServiceId ? getServiceById(selectedServiceId) : undefined;
  const showBarber = currentStep >= 2;
  const showDateTime = currentStep >= 2;

  return (
    <aside className="w-full bg-[#FAF4E6] border border-[#E8DCC4] rounded-[var(--radius-lg)] p-5 md:p-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
        <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
          Appointment Summary
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
            <span className="italic text-[var(--color-text-muted)]">Select a service</span>
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
                First available barber assigned
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
            STUDIO LOCATION
          </span>
          <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
            Kabulonga Studio
          </span>
          <span className="text-[var(--color-text-muted)] text-xs block truncate">
            {businessInfo.address.full}
          </span>
        </div>

        {/* Total */}
        <div className="pt-1 flex items-end justify-between">
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
              TOTAL ESTIMATE
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              No payment online · Pay in-store
            </span>
          </div>
          <span className="font-display font-extrabold text-2xl text-[var(--color-brand-primary)]">
            K {service ? service.price : 0}
          </span>
        </div>

        {/* Cancellation policy */}
        <div className="mt-3 flex items-start gap-2 bg-[var(--color-success-tint)] rounded-[var(--radius-md)] p-3 border border-[var(--color-success)]/20">
          <span className="text-[var(--color-success)] text-base shrink-0" aria-hidden="true">✓</span>
          <p className="font-body text-[11px] text-[var(--color-success)]">
            Free rescheduling or cancellation up to 2 hours before your appointment.
          </p>
        </div>

        {/* Help */}
        <div className="flex items-start gap-2 bg-[var(--color-surface)] rounded-[var(--radius-md)] p-3 border border-[var(--color-border)]">
          <span className="text-base shrink-0" aria-hidden="true">📞</span>
          <p className="font-body text-[11px] text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-brand-primary)]">Need assistance?</strong>{" "}
            Call the studio at{" "}
            <a
              href={`tel:${businessInfo.phone.tel}`}
              className="font-semibold underline text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
            >
              {businessInfo.phone.display}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}
