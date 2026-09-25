"use client";

import { BookingActionBar } from "./BookingActionBar";
import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { formatYmdDate, formatTimeRange } from "@/lib/booking/timezone";
import { Button } from "@/components/ui/Button";
import { getServiceById } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";

export interface ReviewConfirmProps {
  serviceId: string;
  barberPreference: "specific" | "no-preference";
  barberId: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  onEditStep: (step: 1 | 2 | 3) => void;
}

/** One review row: label (dt) + value (dd). CONTENT §9.9 row labels. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 pt-3 first:pt-0">
      <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
        {label}
      </dt>
      <dd className="flex-1 min-w-0 text-right font-body text-sm font-semibold text-[var(--color-brand-primary)] break-words">
        {children}
      </dd>
    </div>
  );
}

export function ReviewConfirm({
  serviceId,
  barberPreference,
  barberId,
  date,
  time,
  customerName,
  customerPhone,
  customerEmail,
  notes,
  onConfirm,
  onBack,
  onEditStep,
}: ReviewConfirmProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const service = getServiceById(serviceId);
  const barber = barberId ? getBarberById(barberId) : undefined;

  const timeRange = service ? formatTimeRange(time, service.durationMinutes) : time;

  // Synchronous guard: blocks a second submit before React re-renders the disabled button.
  const inFlight = useRef(false);

  const handleConfirm = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onConfirm();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "We couldn't reach the booking service. Your details are still here. Please try again."
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const sectionHeader = (id: string, title: string, step: 2 | 3, label: string) => (
    <div className="flex items-center justify-between mb-4">
      <h3 id={id} className="font-display font-bold text-base text-[var(--color-brand-primary)]">
        {title}
      </h3>
      <button
        type="button"
        onClick={() => onEditStep(step)}
        aria-label={label}
        className="font-body text-xs font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast min-h-[44px]"
      >
        Change
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-5">
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-2">
        Review your booking
      </h2>

      <section
        aria-labelledby="appt-details-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        {sectionHeader("appt-details-heading", "Appointment", 2, "Change appointment")}
        <dl className="space-y-3 divide-y divide-[var(--color-border)]/60">
          <Row label="Service">{service?.name ?? serviceId}</Row>
          <Row label="Barber">
            {barberPreference === "no-preference" ? "First available barber" : (barber?.name ?? "First available barber")}
          </Row>
          <Row label="Date">{formatYmdDate(date)}</Row>
          <Row label="Time">{timeRange}</Row>
          <Row label="Duration">{service ? `${service.durationMinutes} min` : ""}</Row>
          <Row label="Price">{service ? `K ${service.price}` : ""}</Row>
        </dl>
      </section>

      <section
        aria-labelledby="your-info-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        {sectionHeader("your-info-heading", "Your details", 3, "Change your details")}
        <dl className="space-y-3 divide-y divide-[var(--color-border)]/60">
          <Row label="Name">{customerName}</Row>
          <Row label="Mobile">{customerPhone}</Row>
          <Row label="Email">{customerEmail}</Row>
          <Row label="Notes">
            {notes ? <span className="font-normal whitespace-pre-line">{notes}</span> : <span className="font-normal text-[var(--color-text-muted)]">None</span>}
          </Row>
        </dl>
      </section>

      {/* FIRST15 note (CONTENT §9.9 / §10) */}
      <p className="font-body text-sm text-[var(--color-brand-primary)] p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
        First visit? Mention <strong>FIRST15</strong> when you arrive.
      </p>

      {/* Conflict / submit error */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-[var(--color-error-tint)] border border-[var(--color-error)]/30"
        >
          <AlertCircle className="w-4 h-4 text-[var(--color-error)] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-body font-semibold text-sm text-[var(--color-error)]">
              {submitError}
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="font-body text-sm font-semibold underline text-[var(--color-error)] hover:opacity-75 mt-1 min-h-[44px]"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <BookingActionBar
        back={
        <Button variant="outline-wine" size="md" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        }
        primary={
        <div className="flex flex-col items-stretch sm:items-end gap-1">
          <Button
            variant="solid-wine"
            size="lg"
            loading={submitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {submitting ? "Confirming…" : "Confirm booking"}
          </Button>
          <span className="font-body text-xs text-center sm:text-right text-[var(--color-text-muted)]">
            No payment needed now · Pay in-store
          </span>
        </div>
        }
      />
    </div>
  );
}
