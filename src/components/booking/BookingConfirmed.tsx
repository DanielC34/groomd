"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Download } from "lucide-react";
import { formatYmdDate } from "@/lib/booking/timezone";
import { Button } from "@/components/ui/Button";
import { getServiceById } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";
import { businessInfo } from "@/lib/data/business";

export interface BookingConfirmedProps {
  reference: string;
  serviceId: string;
  assignedBarberId: string | null;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (Lusaka, display)
  endTime: string; // HH:MM (Lusaka, display)
  startAt: string; // absolute ISO instant (calendar)
  endAt: string; // absolute ISO instant (calendar)
  customerName: string;
  barberPreference: "specific" | "no-preference";
  onBookAnother: () => void;
}

/** ISO instant -> iCalendar/Google UTC stamp, e.g. 20260928T080000Z */
function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildGoogleCalendarUrl(params: {
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  details: string;
}): string {
  const startStr = toUtcStamp(params.startAt);
  const endStr = toUtcStamp(params.endAt);

  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.title);
  url.searchParams.set("dates", `${startStr}/${endStr}`);
  url.searchParams.set("location", params.location);
  url.searchParams.set("details", params.details);
  return url.toString();
}

function buildIcsContent(params: {
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  details: string;
  reference: string;
}): string {
  const dtStamp = toUtcStamp(new Date().toISOString());
  const dtStart = toUtcStamp(params.startAt);
  const dtEnd = toUtcStamp(params.endAt);

  const escapeText = (text: string) =>
    text.replace(/[,;]/g, "\\$&").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Groomd//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${params.reference}@groomd.example`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(params.title)}`,
    `LOCATION:${escapeText(params.location)}`,
    `DESCRIPTION:${escapeText(params.details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

/** CONTENT §9.11 event description (one-way copy; never synced). */
function buildEventDetails(p: {
  serviceName: string;
  duration: number;
  barberName: string;
  price: number;
  reference: string;
  customerName: string;
  siteUrl: string;
}): string {
  return [
    `Service: ${p.serviceName} (${p.duration} min)`,
    `Barber: ${p.barberName}`,
    `Price: K ${p.price} (pay in-store)`,
    `Booking reference: ${p.reference}`,
    `Name: ${p.customerName}`,
    "",
    `Please arrive 5 minutes early. To cancel or change, call Groomd on ${businessInfo.phone.display}.`,
    `Terms: ${p.siteUrl}/terms`,
  ].join("\n");
}

export function BookingConfirmed({
  reference,
  serviceId,
  assignedBarberId,
  date,
  startTime,
  endTime,
  startAt,
  endAt,
  customerName,
  barberPreference,
  onBookAnother,
}: BookingConfirmedProps) {
  const [copied, setCopied] = useState(false);
  const service = getServiceById(serviceId);
  const barber = assignedBarberId ? getBarberById(assignedBarberId) : undefined;
  const barberName = barber?.name ?? "First available barber";
  const firstName = customerName.trim().split(/\s+/)[0];
  const location = `${businessInfo.name}, ${businessInfo.address.full}`;
  // Confirmation only renders client-side after a submit, so window is available.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

  const event = service
    ? {
        title: `${service.name} at ${businessInfo.name}`,
        startAt,
        endAt,
        location,
        details: buildEventDetails({
          serviceName: service.name,
          duration: service.durationMinutes,
          barberName,
          price: service.price,
          reference,
          customerName,
          siteUrl,
        }),
      }
    : null;

  const googleCalUrl = event ? buildGoogleCalendarUrl(event) : null;
  const icsContent = event ? buildIcsContent({ ...event, reference }) : null;

  const downloadIcs = () => {
    if (!icsContent) return;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `groomd-appointment-${date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the reference stays visible and selectable.
    }
  };

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Service", value: service?.name ?? serviceId },
    {
      label: "Barber",
      value: (
        <>
          {barberName}
          {barberPreference === "no-preference" && (
            <span className="block font-normal text-xs text-[var(--color-text-muted)]">Assigned: first available barber</span>
          )}
        </>
      ),
    },
    { label: "Date", value: formatYmdDate(date) },
    { label: "Time", value: `${startTime}–${endTime}` },
    { label: "Duration", value: service ? `${service.durationMinutes} min` : "" },
    { label: "Price", value: service ? `K ${service.price}` : "" },
    { label: "Name", value: customerName },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success header (DESIGN §11: green ✓ in success-tint circle) */}
      <div className="text-center py-8 md:py-10">
        <div
          className="w-14 h-14 rounded-full bg-[var(--color-success-tint)] border border-[var(--color-success)] text-[var(--color-success)] flex items-center justify-center mx-auto mb-5"
          aria-hidden="true"
        >
          <Check className="w-7 h-7" strokeWidth={3} />
        </div>
        <p className="eyebrow text-[var(--color-brand-primary)] mb-2">BOOKING CONFIRMED</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-3">
          See you soon, {firstName}.
        </h2>
        <p className="font-body text-[var(--color-text-secondary)] text-sm sm:text-base max-w-md mx-auto">
          Your appointment is booked. We don&apos;t send a confirmation message, so add it to your calendar or take a screenshot. Keep your reference handy.
        </p>
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Booking reference
          </span>
          <span className="font-display font-extrabold text-lg text-[var(--color-brand-primary)] tracking-widest select-all">
            {reference}
          </span>
          <button
            type="button"
            onClick={copyReference}
            aria-label={copied ? "Copied" : `Copy booking reference ${reference}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-2 font-body text-xs font-semibold text-[var(--color-brand-primary)] underline"
          >
            {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <dl className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6 mb-5 space-y-3 divide-y divide-[var(--color-border)]/60">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4 pt-3 first:pt-0">
            <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] w-24 shrink-0 mt-0.5">
              {r.label}
            </dt>
            <dd className="flex-1 min-w-0 text-right font-body text-sm font-semibold text-[var(--color-brand-primary)] break-words">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Calendar (one-way event generation) */}
      <section aria-labelledby="calendar-heading" className="mb-6">
        <h3 id="calendar-heading" className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-3">
          Add to your calendar
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {googleCalUrl && (
            // One semantic element: the Button's styles applied to the link itself (asChild), not <a><button>.
            <Button variant="solid-wine" size="md" className="flex-1" asChild>
              <a href={googleCalUrl} target="_blank" rel="noopener noreferrer">
                Add to Google Calendar
              </a>
            </Button>
          )}
          {icsContent && (
            <Button
              variant="outline-wine"
              size="md"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={downloadIcs}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Add to Apple Calendar
            </Button>
          )}
        </div>
        <p className="mt-2 font-body text-xs text-[var(--color-text-muted)]">
          Downloads an .ics file. Also works with Outlook and other calendar apps.
        </p>
      </section>

      {/* Before you arrive */}
      <section aria-labelledby="before-heading" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6 mb-6">
        <h3 id="before-heading" className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-3">
          Before you arrive
        </h3>
        <ul className="space-y-2 font-body text-sm text-[var(--color-text-secondary)] list-disc pl-5">
          <li>Arrive 5 minutes early so we can start on time.</li>
          <li>Payment is taken in-store after your appointment.</li>
          <li>
            Need to cancel or change? Call us on{" "}
            <a href={`tel:${businessInfo.phone.tel}`} className="font-semibold underline text-[var(--color-brand-primary)]">
              {businessInfo.phone.display}
            </a>
            , ideally at least 2 hours before.
          </li>
        </ul>
        <p className="mt-3 font-body text-sm text-[var(--color-brand-primary)]">{location}</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline-wine" size="md" className="flex-1" onClick={onBookAnother}>
          Book another appointment
        </Button>
        <Button variant="text" size="md" className="flex-1" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
