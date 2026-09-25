"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Clock, MapPin, Phone, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getServiceById } from "@/lib/data/services";
import { getBarberById } from "@/lib/data/barbers";
import { businessInfo } from "@/lib/data/business";

export interface BookingConfirmedProps {
  reference: string;
  serviceId: string;
  assignedBarberId: string | null;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  customerName: string;
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

function buildGoogleCalendarUrl(params: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  details: string;
}): string {
  const [y, mo, d] = params.date.split("-").map(Number);
  const [sh, sm] = params.startTime.split(":").map(Number);
  const [eh, em] = params.endTime.split(":").map(Number);

  const pad = (n: number) => String(n).padStart(2, "0");
  const startStr = `${y}${pad(mo)}${pad(d)}T${pad(sh)}${pad(sm)}00`;
  const endStr = `${y}${pad(mo)}${pad(d)}T${pad(eh)}${pad(em)}00`;

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
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  details: string;
  reference: string;
}): string {
  const [y, mo, d] = params.date.split("-").map(Number);
  const [sh, sm] = params.startTime.split(":").map(Number);
  const [eh, em] = params.endTime.split(":").map(Number);

  const pad = (n: number) => String(n).padStart(2, "0");
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtStart = `${y}${pad(mo)}${pad(d)}T${pad(sh)}${pad(sm)}00`;
  const dtEnd = `${y}${pad(mo)}${pad(d)}T${pad(eh)}${pad(em)}00`;

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

export function BookingConfirmed({
  reference,
  serviceId,
  assignedBarberId,
  date,
  startTime,
  endTime,
  customerName,
}: BookingConfirmedProps) {
  const router = useRouter();
  const service = getServiceById(serviceId);
  const barber = assignedBarberId ? getBarberById(assignedBarberId) : undefined;
  const readableDate = formatReadableDate(date);

  const googleCalUrl = service
    ? buildGoogleCalendarUrl({
        title: `Groomd: ${service.name}`,
        date,
        startTime,
        endTime,
        location: `${businessInfo.name}, ${businessInfo.address.full}`,
        details: `Booking reference: ${reference}\nService: ${service.name} (${service.durationMinutes} min)\n${
          barber ? `Barber: ${barber.name}` : "Barber: First available"
        }\nPayment: Pay in-store (K ${service.price})`,
      })
    : null;

  const icsContent = service
    ? buildIcsContent({
        title: `Groomd: ${service.name}`,
        date,
        startTime,
        endTime,
        location: `${businessInfo.name}, ${businessInfo.address.full}`,
        details: `Booking reference: ${reference}\nService: ${service.name} (${service.durationMinutes} min)\n${
          barber ? `Barber: ${barber.name}` : "Barber: First available"
        }\nPayment: Pay in-store (K ${service.price})`,
        reference,
      })
    : null;

  const firstName = customerName.split(" ")[0];

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

  return (
    <div className="w-full">
      {/* Success header */}
      <div className="text-center py-8 md:py-10">
        <div
          className="w-16 h-16 rounded-full bg-[var(--color-success)] flex items-center justify-center mx-auto mb-5 text-white text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-2">
          You&rsquo;re booked in, {firstName}.
        </h2>
        <p className="font-body text-[var(--color-text-secondary)] text-sm sm:text-base max-w-md mx-auto">
          Your appointment is confirmed. See you at the studio.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-brand-accent)] border border-[var(--color-border)]">
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Booking reference
          </span>
          <span className="font-display font-extrabold text-lg text-[var(--color-brand-primary)] tracking-widest">
            {reference}
          </span>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6 mb-5">
        <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-4">
          Appointment Summary
        </h3>
        <dl className="space-y-3">
          <div className="flex items-start gap-3">
            <CalendarDays className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="visually-hidden">Date</dt>
              <dd className="font-body font-semibold text-sm text-[var(--color-brand-primary)]">
                {readableDate}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="visually-hidden">Time</dt>
              <dd className="font-body text-sm text-[var(--color-text-secondary)]">
                {startTime} – {endTime}
                {service ? ` · ${service.name} (${service.durationMinutes} min)` : ""}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="visually-hidden">Location</dt>
              <dd>
                <span className="font-body font-semibold text-sm text-[var(--color-brand-primary)] block">
                  {businessInfo.name} — Kabulonga Studio
                </span>
                <span className="font-body text-xs text-[var(--color-text-secondary)]">
                  {businessInfo.address.full}
                </span>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="visually-hidden">Cancellation</dt>
              <dd className="font-body text-xs text-[var(--color-text-secondary)]">
                Free cancellation up to 2 hours before your appointment. Call{" "}
                <a
                  href={`tel:${businessInfo.phone.tel}`}
                  className="font-semibold underline text-[var(--color-brand-primary)]"
                >
                  {businessInfo.phone.display}
                </a>
              </dd>
            </div>
          </div>
        </dl>

        {service && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]/60 flex items-end justify-between">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block">
                Total Due In-Studio
              </span>
              <span className="font-body text-xs text-[var(--color-text-muted)]">
                Cash, card & Airtel/MTN mobile money accepted
              </span>
            </div>
            <span className="font-display font-extrabold text-2xl text-[var(--color-brand-primary)]">
              K {service.price}
            </span>
          </div>
        )}
      </div>

      {/* Calendar + CTA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {googleCalUrl && (
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline-wine" size="md" className="w-full">
              Add to Google Calendar
            </Button>
          </a>
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
        <Button
          variant="solid-wine"
          size="md"
          className="flex-1"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>

      {/* Fiction notice */}
      <p className="font-body text-[10px] text-[var(--color-text-muted)] text-center leading-relaxed max-w-lg mx-auto">
        Groomd is a fictional studio created for a design assessment. This booking confirmation is for demonstration purposes only and does not represent a real appointment.
      </p>
    </div>
  );
}