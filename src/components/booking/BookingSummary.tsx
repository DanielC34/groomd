import { businessInfo } from "@/lib/data/business";
import { getServiceById } from "@/lib/data/services";

export interface BookingSummaryProps {
  selectedServiceId?: string;
  assignedBarberName?: string;
  selectedDateText?: string;
  selectedTimeText?: string;
}

export function BookingSummary({
  selectedServiceId,
  assignedBarberName = "No preference",
  selectedDateText = "Fri 25 Sept",
  selectedTimeText = "Select slot",
}: BookingSummaryProps) {
  const service = selectedServiceId ? getServiceById(selectedServiceId) : undefined;

  return (
    <aside className="w-full bg-[#FAF4E6] border border-[#E8DCC4] rounded-[var(--radius-lg)] p-5 md:p-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
        <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
          Appointment Summary
        </h3>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" title="Online booking active" />
      </div>

      <div className="space-y-4 text-xs font-body">
        {/* Selected Service */}
        <div className="border-b border-[var(--color-border)]/60 pb-3">
          <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px] mb-1">
            SELECTED SERVICE
          </span>
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

        {/* Assigned Barber */}
        <div className="border-b border-[var(--color-border)]/60 pb-3">
          <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px] mb-1">
            ASSIGNED BARBER
          </span>
          <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
            {assignedBarberName}
          </span>
        </div>

        {/* Date & Time */}
        <div className="border-b border-[var(--color-border)]/60 pb-3">
          <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px] mb-1">
            DATE & TIME
          </span>
          <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
            {selectedDateText}
          </span>
          <span className="text-[var(--color-text-muted)] text-xs block">
            {selectedTimeText}
          </span>
        </div>

        {/* Location */}
        <div className="pb-3 border-b border-[var(--color-border)]/60">
          <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px] mb-1">
            LOCATION
          </span>
          <span className="font-body font-bold text-sm text-[var(--color-brand-primary)] block">
            Groomd Kabulonga Studio
          </span>
          <span className="text-[var(--color-text-muted)] text-xs block truncate">
            {businessInfo.address.full}
          </span>
        </div>

        {/* Total Estimate */}
        <div className="pt-1 flex items-end justify-between">
          <div>
            <span className="block font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
              TOTAL ESTIMATE
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Payment due in-studio
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
