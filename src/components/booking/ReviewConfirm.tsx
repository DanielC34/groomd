"use client";

import { useState } from "react";
import { CalendarDays, User, Clock, MapPin, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getServiceById } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";
import { businessInfo } from "@/lib/data/business";

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

function calcFinishTime(start: string, durationMinutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + durationMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatReadableDate(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
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

  const finishTime = service ? calcFinishTime(time, service.durationMinutes) : "";
  const readableDate = formatReadableDate(date);

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onConfirm();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="mb-2">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-1">
          Review & Confirm
        </h2>
        <p className="font-body text-[var(--color-text-secondary)] text-sm sm:text-base">
          Take a quick look before you confirm your appointment.
        </p>
      </div>

      {/* Appointment Details */}
      <section
        aria-labelledby="appt-details-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
            <h3 id="appt-details-heading" className="font-display font-bold text-base text-[var(--color-brand-primary)]">
              Appointment Details
            </h3>
          </div>
          <button
            onClick={() => onEditStep(2)}
            className="font-body text-xs font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast"
          >
            Change
          </button>
        </div>

        <dl className="space-y-4 divide-y divide-[var(--color-border)]/60">
          {/* Service */}
          <div className="flex items-start justify-between gap-4 pt-0">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
              Service
            </dt>
            <dd className="flex-1 text-right">
              <span className="font-display font-bold text-sm text-[var(--color-brand-primary)] block">
                {service?.name ?? serviceId}{" "}
                <span className="font-body font-normal text-[var(--color-text-muted)] text-xs">
                  K {service?.price}
                  {service ? ` · ${service.durationMinutes} min` : ""}
                </span>
              </span>
              {service?.description && (
                <span className="font-body text-xs text-[var(--color-text-secondary)] block mt-0.5 leading-snug">
                  {service.description}
                </span>
              )}
            </dd>
          </div>

          {/* Barber */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
              Barber
            </dt>
            <dd className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2">
                <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <span className="font-display font-bold text-sm text-[var(--color-brand-primary)]">
                  {barberPreference === "no-preference" ? "First available barber" : (barber?.name ?? "Barber")}
                </span>
              </div>
              {barberPreference === "no-preference" && (
                <span className="font-body text-xs text-[var(--color-text-secondary)] block mt-0.5">
                  Resolved from no preference. We&apos;ll seat you with whoever is ready first.
                </span>
              )}
            </dd>
          </div>

          {/* Date & Time */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
              Date & Time
            </dt>
            <dd className="flex-1 text-right">
              <span className="font-display font-bold text-sm text-[var(--color-brand-primary)] block">
                {readableDate}
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-[var(--color-text-muted)]" aria-hidden="true" />
                <span className="font-body text-xs text-[var(--color-text-secondary)]">
                  {time} – {finishTime} ({service?.durationMinutes} min duration · Lusaka Local Time)
                </span>
              </div>
            </dd>
          </div>

          {/* Location */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
              Location
            </dt>
            <dd className="flex-1 text-right">
              <span className="font-display font-bold text-sm text-[var(--color-brand-primary)] block">
                {businessInfo.name} Kabulonga Studio
              </span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[var(--color-text-muted)]" aria-hidden="true" />
                <span className="font-body text-xs text-[var(--color-text-secondary)]">
                  {businessInfo.address.full}
                </span>
              </div>
            </dd>
          </div>
        </dl>
      </section>

      {/* Your Information */}
      <section
        aria-labelledby="your-info-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
            <h3 id="your-info-heading" className="font-display font-bold text-base text-[var(--color-brand-primary)]">
              Your Information
            </h3>
          </div>
          <button
            onClick={() => onEditStep(3)}
            className="font-body text-xs font-semibold text-[var(--color-brand-secondary)] underline hover:text-[var(--color-brand-primary)] transition-fast"
          >
            Change
          </button>
        </div>

        <dl className="space-y-3 divide-y divide-[var(--color-border)]/60">
          <div className="flex items-center justify-between gap-4 pt-0">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-28 shrink-0">
              Client Name
            </dt>
            <dd className="font-body text-sm font-semibold text-[var(--color-brand-primary)] text-right">
              {customerName}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-28 shrink-0">
              Mobile Phone
            </dt>
            <dd className="flex-1 text-right">
              <span className="font-body text-sm font-semibold text-[var(--color-brand-primary)]">{customerPhone}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-28 shrink-0">
              Email
            </dt>
            <dd className="font-body text-sm text-[var(--color-brand-primary)] text-right">{customerEmail}</dd>
          </div>
          {notes && (
            <div className="flex items-start justify-between gap-4 pt-3">
              <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-28 shrink-0 mt-0.5">
                Barber Notes
              </dt>
              <dd className="flex-1 text-right">
                <blockquote className="font-body text-xs italic text-[var(--color-text-secondary)] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] px-3 py-2 border border-[var(--color-border)]">
                  &ldquo;{notes}&rdquo;
                </blockquote>
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 pt-3">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-28 shrink-0">
              Terms
            </dt>
            <dd className="flex items-center gap-1.5 font-body text-sm text-[var(--color-success)]">
              <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-success)] inline-flex items-center justify-center text-white text-[9px]">✓</span>
              Verified
            </dd>
          </div>
        </dl>
      </section>

      {/* Payment notice */}
      <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
        <CreditCard className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="font-body text-xs text-[var(--color-text-secondary)]">
          <strong className="text-[var(--color-brand-primary)]">Payment: Pay in-store.</strong>{" "}
          No payment or credit card is required to reserve your appointment online.
        </p>
      </div>

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
            {submitError.includes("no longer available") && (
              <button
                onClick={() => onEditStep(2)}
                className="font-body text-xs underline text-[var(--color-error)] hover:opacity-75 mt-1"
              >
                Go back and choose a different time
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button variant="outline-wine" size="md" onClick={onBack} disabled={submitting}>
          ← Back to Details
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Button
            variant="solid-wine"
            size="lg"
            loading={submitting}
            onClick={handleConfirm}
            className="sm:w-auto"
          >
            Confirm booking →
          </Button>
          <span className="font-body text-[10px] text-[var(--color-text-muted)]">
            No payment required now · Direct confirmation on next screen
          </span>
        </div>
      </div>
    </div>
  );
}