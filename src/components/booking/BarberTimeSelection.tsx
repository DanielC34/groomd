"use client";

import { BookingActionBar } from "./BookingActionBar";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { clsx } from "clsx";
import { User, Sun, Sunset, Moon, AlertCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAllBarbers } from "@/lib/data/barbers";
import { getServiceById } from "@/lib/data/services";
import { bookingConfig } from "@/lib/data/booking-config";
import type { TimeSlot } from "@/lib/booking/availability";
import { parseAvailabilityResponse, groupSlots } from "@/lib/booking/availability-client";
import {
  todayLusakaYmd,
  addDaysYmd,
  dayOfWeekYmd,
  ymdToDisplayDate,
  formatYmdShort,
} from "@/lib/booking/timezone";

const barbers = getAllBarbers();

const NO_PREF_OPTION = {
  id: "no-preference",
  name: "No preference",
  role: "We'll assign the first available barber.",
  specialities: [] as string[],
} as const;

type BarberOption = typeof NO_PREF_OPTION | (typeof barbers)[number];

export interface BarberTimeSelectionProps {
  serviceId: string;
  initialBarberId?: string | null;
  /** Previously confirmed Step 2 choice, restored when the user comes back to this step. */
  initialSelection?: {
    barberId: string | null;
    barberPreference: "specific" | "no-preference";
    date: string;
    time: string;
  } | null;
  /** Why the user was sent back here (409 conflict or invalid time), if they were. */
  notice?: { kind: "conflict" | "invalid"; time: string } | null;
  onContinue: (data: {
    barberId: string | null;
    barberPreference: "specific" | "no-preference";
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
  }) => void;
  onBack: () => void;
}

/* ── Helpers (all dates are Lusaka YYYY-MM-DD strings; display is viewer-timezone independent) ── */
function formatDateLabel(ymd: string): string {
  return ymdToDisplayDate(ymd).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}


function buildAvailabilityUrl(serviceId: string, barberId: string, ymd: string): string {
  const params = new URLSearchParams({
    serviceId,
    barberPreference: barberId === "no-preference" ? "no-preference" : "specific",
    date: ymd,
  });
  if (barberId !== "no-preference") params.set("barberId", barberId);
  return `/api/bookings/availability?${params.toString()}`;
}

const isSunday = (ymd: string) => dayOfWeekYmd(ymd) === "Sunday";

type DayResult =
  | { key: string; status: "open" | "full" | "closed"; slots: TimeSlot[]; error: null }
  | { key: string; status: null; slots: TimeSlot[]; error: string };

export function BarberTimeSelection({ serviceId, initialBarberId, initialSelection, notice, onContinue, onBack }: BarberTimeSelectionProps) {
  const service = getServiceById(serviceId);

  const allOptions = useMemo((): BarberOption[] => [NO_PREF_OPTION, ...barbers], []);

  // Initial barber: restored Step 2 choice, else URL param, else no-preference
  const initialBarber = useMemo(() => {
    if (initialSelection) {
      if (initialSelection.barberPreference === "no-preference") return NO_PREF_OPTION;
      const restored = allOptions.find((b) => b.id === initialSelection.barberId);
      if (restored) return restored;
    }
    if (initialBarberId) {
      const found = allOptions.find((b) => b.id === initialBarberId);
      if (found) return found;
    }
    return NO_PREF_OPTION;
  }, [initialSelection, initialBarberId, allOptions]);

  // Today in Lusaka, fixed for the lifetime of this step.
  const [today] = useState(() => todayLusakaYmd());

  // Restore a previously chosen date only if it is still inside the booking window.
  const initialDate = (() => {
    const d = initialSelection?.date;
    const last = addDaysYmd(today, bookingConfig.maxBookingWindowDays);
    return d && d >= today && d <= last ? d : today;
  })();
  const initialDateIndex = Math.round(
    (Date.parse(`${initialDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000
  );

  // State
  const [selectedBarber, setSelectedBarber] = useState<BarberOption>(initialBarber);
  // Start of the 7-day block currently scrolled into view (drives the Full-indicator prefetch).
  const [dateOffset, setDateOffset] = useState(() => Math.floor(initialDateIndex / 7) * 7);
  const stripRef = useRef<HTMLDivElement>(null);
  const [atStripStart, setAtStripStart] = useState(true);
  const [atStripEnd, setAtStripEnd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  // The restored time is kept only if it is still offered once availability loads (see validSelectedTime).
  const [selectedTime, setSelectedTime] = useState<string | null>(
    initialSelection && initialSelection.date === initialDate ? initialSelection.time : null
  );
  const [dayResult, setDayResult] = useState<DayResult | null>(null);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});

  // Build date array (today through the booking window)
  const allDates = useMemo(() => {
    const dates: string[] = [];
    // Today through +maxBookingWindowDays inclusive, matching the server rule (validation.ts accepts +30, rejects +31).
    for (let i = 0; i <= bookingConfig.maxBookingWindowDays; i++) dates.push(addDaysYmd(today, i));
    return dates;
  }, [today]);

  // Dates near the scroll position (current block + next), prefetched for Closed/Full labels.
  const visibleDates = useMemo(() => allDates.slice(dateOffset, dateOffset + 14), [allDates, dateOffset]);

  const updateStripState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setAtStripStart(el.scrollLeft <= 1);
    setAtStripEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    const chip = el.querySelector<HTMLElement>("[data-index]");
    const step = chip ? chip.offsetWidth + 8 : 72; // chip width + gap-2
    const first = Math.floor(el.scrollLeft / step);
    setDateOffset(Math.floor(first / 7) * 7);
  }, []);

  const handleStripScroll = updateStripState;

  const scrollStrip = (direction: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * Math.max(72, el.clientWidth - 72), behavior: reduceMotion ? "auto" : "smooth" });
  };

  // On mount, scroll the strip (not the page) so a restored date is in view.
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const chip = el.querySelector<HTMLElement>(`[data-index="${initialDateIndex}"]`);
    if (chip) el.scrollLeft = Math.max(0, chip.offsetLeft - 8);
    updateStripState();
  }, [initialDateIndex, updateStripState]);

  /* ── Fetch slots for the selected date/barber/service ──
     Runs on mount (production-safe, no StrictMode reliance) and on every change.
     AbortController + request key prevent a stale response overwriting a newer selection. */
  const requestKey = `${serviceId}|${selectedBarber.id}|${selectedDate}`;

  useEffect(() => {
    if (isSunday(selectedDate)) return; // Closed: no request needed
    const controller = new AbortController();
    const key = `${serviceId}|${selectedBarber.id}|${selectedDate}`;

    fetch(buildAvailabilityUrl(serviceId, selectedBarber.id, selectedDate), { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setDayResult({ key, status: null, slots: [], error: json.error ?? "Failed to load availability." });
          return;
        }
        const data = parseAvailabilityResponse(json);
        const status = data.status === "closed" ? "closed" : data.slots.length === 0 ? "full" : "open";
        setDayResult({ key, status, slots: data.slots, error: null });
        setSlotCounts((prev) => ({ ...prev, [selectedDate]: status === "closed" ? -1 : data.slots.length }));
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Availability request failed:", err);
        setDayResult({ key, status: null, slots: [], error: "Could not connect to the booking service. Please try again." });
      });

    return () => controller.abort();
  }, [serviceId, selectedBarber.id, selectedDate]);

  /* ── Prefetch slot counts for visible dates (for the Full indicator) ── */
  useEffect(() => {
    const controller = new AbortController();
    const openDates = visibleDates.filter((d) => !isSunday(d));

    Promise.allSettled(
      openDates.map(async (d) => {
        const res = await fetch(buildAvailabilityUrl(serviceId, selectedBarber.id, d), { signal: controller.signal });
        if (!res.ok) return null;
        const data = parseAvailabilityResponse(await res.json());
        return [d, data.status === "closed" ? -1 : data.slots.length] as const;
      })
    ).then((results) => {
      if (controller.signal.aborted) return;
      const counts: Record<string, number> = {};
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) counts[r.value[0]] = r.value[1];
      }
      setSlotCounts((prev) => ({ ...prev, ...counts }));
    });

    return () => controller.abort();
  }, [visibleDates, selectedBarber.id, serviceId]);

  // Slot counts depend on barber + service: reset them when either changes.
  const countsKey = `${serviceId}|${selectedBarber.id}`;
  const [countsFor, setCountsFor] = useState(countsKey);
  if (countsFor !== countsKey) {
    setCountsFor(countsKey);
    setSlotCounts({});
  }

  /* ── Derived day state ── */
  const sundaySelected = isSunday(selectedDate);
  const current = dayResult && dayResult.key === requestKey ? dayResult : null;
  const slotsLoading = !sundaySelected && current === null;
  const slotsError = current?.error ?? null;
  const dayStatus: "open" | "closed" | "full" | null = sundaySelected ? "closed" : current?.status ?? null;
  const slots: TimeSlot[] = current?.slots ?? [];

  // A selected time only counts if it is still offered for the current selection.
  const validSelectedTime = selectedTime && slots.some((s) => s.start === selectedTime) ? selectedTime : null;

  // A previously chosen time that is no longer offered (service/barber changed, or taken).
  // It is treated as cleared and the approved CONTENT §9.8 message explains why.
  const invalidatedTime =
    selectedTime && !sundaySelected && current !== null && current.status !== null && !validSelectedTime
      ? selectedTime
      : null;
  const invalidatedMessage = !invalidatedTime
    ? null
    : notice?.time === invalidatedTime && notice.kind === "conflict"
      ? `Sorry, ${invalidatedTime} was just booked by someone else. Here are the latest available times.`
      : notice?.time === invalidatedTime && notice.kind === "invalid"
        ? "That time is no longer available. Please pick another."
        : "Your chosen time was cleared because it no longer fits your new selection. Please pick another time.";

  // Changing barber keeps the time if that barber still offers it; otherwise it is cleared (above).
  const selectBarber = (b: BarberOption) => {
    setSelectedBarber(b);
  };

  const selectDate = (ymd: string) => {
    setSelectedDate(ymd);
    setSelectedTime(null);
  };

  const grouped = groupSlots(slots, "");
  const isToday = (d: string) => d === today;

  const getDayChipStatus = (d: string) => {
    if (isSunday(d)) return "closed";
    const count = slotCounts[d];
    if (count === undefined) return "loading";
    if (count === -1) return "closed";
    if (count === 0) return "full";
    return "open";
  };

  const canContinue = validSelectedTime !== null && !slotsLoading;

  const handleContinue = () => {
    if (!validSelectedTime) return;
    onContinue({
      barberId: selectedBarber.id === "no-preference" ? null : selectedBarber.id,
      barberPreference: selectedBarber.id === "no-preference" ? "no-preference" : "specific",
      date: selectedDate,
      time: validSelectedTime,
    });
  };


  return (
    <div className="w-full space-y-6">
      {/* ── Choose Barber ── */}
      <section
        aria-labelledby="barber-section-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2
              id="barber-section-heading"
              className="font-display font-bold text-xl text-[var(--color-brand-primary)]"
            >
              Choose your barber
            </h2>
            <p className="font-body text-sm text-[var(--color-text-secondary)] mt-0.5">
              All our barbers offer every service.
            </p>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Choose a barber"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {allOptions.map((b) => {
            const isSelected = selectedBarber.id === b.id;
            const isNoPref = b.id === "no-preference";

            return (
              <div
                key={b.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => selectBarber(b)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectBarber(b);
                  }
                }}
                className={clsx(
                  "flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-fast select-none",
                  isSelected
                    ? "bg-[var(--color-brand-accent)] border-[var(--color-brand-primary)] border-2"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-brand-secondary)]"
                )}
              >
                {/* Avatar */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    isNoPref
                      ? "bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]"
                      : "bg-[var(--color-surface-muted)] text-[var(--color-brand-secondary)]"
                  )}
                  aria-hidden="true"
                >
                  <User className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm text-[var(--color-brand-primary)] leading-tight">
                    {b.name}
                  </div>
                  <div className="font-body text-xs text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                    {"role" in b ? b.role : ""}
                  </div>
                </div>

                {/* Radio indicator */}
                <div
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                    isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
                      : "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
                  )}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selectedBarber.id === "no-preference" && (
          <p className="font-body text-sm text-[var(--color-text-secondary)] mt-3">
            We&apos;ll show your barber on the confirmation.
          </p>
        )}
      </section>

      {/* ── Pick a Date ── */}
      <section
        aria-labelledby="date-section-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        <div className="mb-4">
          <h2
            id="date-section-heading"
            className="font-display font-bold text-xl text-[var(--color-brand-primary)]"
          >
            Pick a date
          </h2>
          <p className="font-body text-sm text-[var(--color-text-secondary)] mt-0.5">
            You can book up to 30 days ahead.
          </p>
        </div>

        {/* Calendar strip: one horizontally scrollable row (DESIGN §10.3). Swipe on mobile, arrows on md+. */}
        <div className="flex items-center gap-2 mb-3 min-w-0">
          <button
            type="button"
            aria-label="Previous dates"
            aria-controls="date-strip"
            disabled={atStripStart}
            onClick={() => scrollStrip(-1)}
            className={clsx(
              "hidden md:flex w-10 h-10 rounded-full items-center justify-center border transition-fast shrink-0",
              atStripStart
                ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
                : "border-[var(--color-border-strong)] text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <div
            id="date-strip"
            ref={stripRef}
            onScroll={handleStripScroll}
            role="group"
            aria-label="Available dates"
            className="relative flex-1 min-w-0 flex gap-2 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 -mb-2"
          >
            {allDates.map((d, index) => {
              const ymd = d;
              const status = getDayChipStatus(d);
              const isSelected = selectedDate === ymd;
              const isDisabled = status === "closed" || status === "full";

              return (
                <button
                  key={ymd}
                  type="button"
                  data-index={index}
                  disabled={isDisabled}
                  aria-disabled={isDisabled || undefined}
                  onClick={() => {
                    if (!isDisabled) selectDate(d);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${formatDateLabel(d)}${isToday(d) ? ", today" : ""}${status === "closed" ? ", closed. The studio is not open on this day." : status === "full" ? ", fully booked. No times left for this service." : ""}`}
                  className={clsx(
                    "w-16 h-[72px] shrink-0 snap-start flex flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] border text-center transition-fast",
                    "font-body leading-tight",
                    isSelected && !isDisabled && "bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)] border-[var(--color-brand-primary)]",
                    !isSelected && !isDisabled && "bg-[var(--color-surface)] border-[var(--color-border-strong)] hover:border-[var(--color-brand-secondary)] text-[var(--color-brand-primary)]",
                    status === "closed" && "bg-[var(--color-surface-muted)] border-transparent text-[var(--color-text-muted)] cursor-not-allowed",
                    status === "full" && "bg-[var(--color-surface)] border-dashed border-[var(--color-border-strong)] text-[var(--color-text-muted)] cursor-not-allowed"
                  )}
                >
                  <span className="font-semibold text-xs uppercase tracking-wide">
                    {ymdToDisplayDate(d).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
                  </span>
                  <span className={clsx("font-bold text-lg", status === "closed" && "line-through")}>
                    {ymdToDisplayDate(d).toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" })}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold">
                    {isSelected && !isDisabled && <Check className="w-3 h-3" aria-hidden="true" />}
                    {status === "closed" ? "Closed" : status === "full" ? "Full" : isToday(d) ? "Today" : ymdToDisplayDate(d).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next dates"
            aria-controls="date-strip"
            disabled={atStripEnd}
            onClick={() => scrollStrip(1)}
            className={clsx(
              "hidden md:flex w-10 h-10 rounded-full items-center justify-center border transition-fast shrink-0",
              atStripEnd
                ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
                : "border-[var(--color-border-strong)] text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>


      </section>

      {/* ── Pick a Time ── */}
      <section
        aria-labelledby="time-section-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6"
      >
        <div className="mb-4">
          <h2
            id="time-section-heading"
            className="font-display font-bold text-xl text-[var(--color-brand-primary)]"
          >
            Pick a time
          </h2>
          {service && (
            <p className="font-body text-sm text-[var(--color-text-secondary)] mt-0.5">
              Showing times for <strong>{service.name} ({service.durationMinutes} min)</strong> with{" "}
              <strong>
                {selectedBarber.id === "no-preference" ? "the first available barber" : selectedBarber.name}
              </strong>{" "}
              on <strong>{formatYmdShort(selectedDate)}</strong>
            </p>
          )}
          {/* CONTENT §9.6 helper */}
          <p className="font-body text-sm text-[var(--color-text-secondary)] mt-0.5">All times are Lusaka time.</p>
        </div>

        {invalidatedMessage && !slotsLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-warning-tint)] border border-[var(--color-warning)] mb-4"
          >
            <AlertCircle className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-sm text-[var(--color-brand-primary)]">{invalidatedMessage}</p>
          </div>
        )}

        {slotsLoading && (
          <div className="py-8 flex items-center justify-center gap-2 text-[var(--color-text-muted)] font-body text-sm">
            <div className="w-4 h-4 rounded-full border-2 border-[var(--color-brand-primary)] border-t-transparent animate-spin" />
            Checking availability…
          </div>
        )}

        {!slotsLoading && slotsError && (
          <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-error-tint)] border border-[var(--color-error)]/30">
            <AlertCircle className="w-4 h-4 text-[var(--color-error)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-sm text-[var(--color-error)]">{slotsError}</p>
          </div>
        )}

        {!slotsLoading && !slotsError && dayStatus === "closed" && (
          <div className="py-6 text-center font-body text-sm text-[var(--color-text-muted)]">
            The studio is not open on this day.
          </div>
        )}

        {!slotsLoading && !slotsError && dayStatus === "full" && (
          <div className="py-6 text-center font-body">
            <p className="font-semibold text-[var(--color-brand-primary)]">No times available on {formatYmdShort(selectedDate)}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Please choose another date.</p>
          </div>
        )}

        {!slotsLoading && !slotsError && dayStatus === "open" && grouped.length > 0 && (
          <div className="space-y-5" role="radiogroup" aria-label="Available time slots">
            {grouped.map((group) => {
              const Icon = group.label === "Morning" ? Sun : group.label === "Afternoon" ? Sunset : Moon;
              return (
                <div key={group.label}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {group.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => {
                      const isSelected = validSelectedTime === slot.start;
                      return (
                        <button
                          key={slot.start}
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`${slot.start} to ${slot.end}`}
                          onClick={() => setSelectedTime(slot.start)}
                          className={clsx(
                            "px-4 py-2 rounded-[var(--radius-md)] border font-body font-semibold text-sm transition-fast",
                            isSelected
                              ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)] border-[var(--color-brand-primary)]"
                              : "bg-[var(--color-surface)] border-[var(--color-border-strong)] text-[var(--color-brand-primary)] hover:border-[var(--color-brand-secondary)]"
                          )}
                        >
                          {isSelected && "✓ "}{slot.start}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ── Navigation ── */}
      <BookingActionBar
        back={
        <Button variant="outline-wine" size="md" onClick={onBack}>
          Back
        </Button>
        }
        primary={
        <Button
          variant="solid-wine"
          size="lg"
          disabled={!canContinue}
          onClick={handleContinue}
          className="sm:w-auto"
        >
          Continue
        </Button>
        }
      />
    </div>
  );
}
