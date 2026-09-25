"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { clsx } from "clsx";
import { User, Sun, Sunset, Moon, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAllBarbers } from "@/lib/data/barbers";
import { getServiceById } from "@/lib/data/services";
import { bookingConfig } from "@/lib/data/booking-config";

const barbers = getAllBarbers();

const NO_PREF_OPTION = {
  id: "no-preference",
  name: "No preference",
  role: "First available barber",
  specialities: ["Fastest option"],
} as const;

type BarberOption = typeof NO_PREF_OPTION | (typeof barbers)[number];

export interface BarberTimeSelectionProps {
  serviceId: string;
  initialBarberId?: string | null;
  onContinue: (data: {
    barberId: string | null;
    barberPreference: "specific" | "no-preference";
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
  }) => void;
  onBack: () => void;
}

/* ── Helpers ── */
function getLusakaToday(): Date {
  const now = new Date();
  const lusaka = new Date(now.toLocaleString("en-US", { timeZone: bookingConfig.timezone }));
  lusaka.setHours(0, 0, 0, 0);
  return lusaka;
}

function dateToYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDaysToDate(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function getDayName(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", timeZone: bookingConfig.timezone });
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: bookingConfig.timezone,
  });
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: bookingConfig.timezone,
  });
}

function calcFinishTime(start: string, durationMinutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const totalMins = h * 60 + m + durationMinutes;
  return `${String(Math.floor(totalMins / 60)).padStart(2, "0")}:${String(totalMins % 60).padStart(2, "0")}`;
}

/* ── Time group logic ── */
interface SlotGroup {
  label: string;
  sublabel?: string;
  slots: string[];
}

function groupSlots(slots: string[], service: ReturnType<typeof getServiceById>): SlotGroup[] {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  for (const s of slots) {
    const [h] = s.split(":").map(Number);
    if (h < 12) morning.push(s);
    else if (h < 17) afternoon.push(s);
    else evening.push(s);
  }

  const groups: SlotGroup[] = [];
  if (morning.length) groups.push({ label: "Morning", sublabel: "Before 12:00", slots: morning });
  if (afternoon.length) groups.push({ label: "Afternoon", sublabel: "12:00 – 16:59", slots: afternoon });
  if (evening.length) {
    const cutoff = service ? `Weekday cutoff ${calcFinishTime("17:00", -(service.durationMinutes - 60))}` : "Evening";
    groups.push({ label: "Evening", sublabel: cutoff, slots: evening });
  }
  return groups;
}

export function BarberTimeSelection({ serviceId, initialBarberId, onContinue, onBack }: BarberTimeSelectionProps) {
  const service = getServiceById(serviceId);

  const allOptions = useMemo((): BarberOption[] => [NO_PREF_OPTION, ...barbers], []);

  // Determine initial barber from URL param or default to no-preference
  const initialBarber = useMemo(() => {
    if (initialBarberId) {
      const found = allOptions.find((b) => b.id === initialBarberId);
      if (found) return found;
    }
    return NO_PREF_OPTION;
  }, [initialBarberId, allOptions]);

  // State
  const [selectedBarber, setSelectedBarber] = useState<BarberOption>(initialBarber);
  const [dateOffset, setDateOffset] = useState(0); // start index for 7-day window shown
  const [selectedDate, setSelectedDate] = useState<Date>(getLusakaToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [dayStatus, setDayStatus] = useState<"open" | "closed" | "full" | null>(null);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});

  // Refs to track initial mount and prevent state updates in effects on mount
  const isFetchMount = useRef(true);
  const isPrefetchMount = useRef(true);

  const today = getLusakaToday();

  // Build date array (today through 30 days, excluding Sundays for closed label)
  const allDates: Date[] = [];
  for (let i = 0; i < bookingConfig.maxBookingWindowDays; i++) {
    allDates.push(addDaysToDate(today, i));
  }

  const visibleDates = allDates.slice(dateOffset, dateOffset + 7);

  /* ── Fetch slots ── */
  const fetchSlots = useCallback(
    async (date: Date, barber: BarberOption) => {
      setSlotsLoading(true);
      setSlotsError(null);
      setSlots([]);
      setDayStatus(null);
      setSelectedTime(null);

      const dayName = getDayName(date);
      if (dayName === "Sunday") {
        setDayStatus("closed");
        setSlotsLoading(false);
        return;
      }

      const params = new URLSearchParams({
        serviceId,
        barberPreference: barber.id === "no-preference" ? "no-preference" : "specific",
        date: dateToYMD(date),
      });
      if (barber.id !== "no-preference") {
        params.set("barberId", barber.id);
      }

      try {
        const res = await fetch(`/api/bookings/availability?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          setSlotsError(data.error ?? "Failed to load availability.");
          return;
        }
        if (data.status === "closed") {
          setDayStatus("closed");
          return;
        }
        const fetchedSlots: string[] = data.slots ?? [];
        setSlots(fetchedSlots);
        setDayStatus(fetchedSlots.length === 0 ? "full" : "open");
      } catch {
        setSlotsError("Could not connect to the booking service. Please try again.");
      } finally {
        setSlotsLoading(false);
      }
    },
    [serviceId]
  );

  /* Prefetch slot counts for visible dates (for Full indicator) */
  const prefetchCounts = useCallback(
    async (dates: Date[], barber: BarberOption) => {
      const counts: Record<string, number> = {};
      await Promise.allSettled(
        dates.map(async (d) => {
          const dayName = getDayName(d);
          if (dayName === "Sunday") {
            counts[dateToYMD(d)] = -1; // -1 = closed
            return;
          }
          const params = new URLSearchParams({
            serviceId,
            barberPreference: barber.id === "no-preference" ? "no-preference" : "specific",
            date: dateToYMD(d),
          });
          if (barber.id !== "no-preference") params.set("barberId", barber.id);
          try {
            const res = await fetch(`/api/bookings/availability?${params.toString()}`);
            if (res.ok) {
              const data = await res.json();
              counts[dateToYMD(d)] = (data.slots ?? []).length;
            }
          } catch {
            // silently ignore prefetch errors
          }
        })
      );
      setSlotCounts((prev) => ({ ...prev, ...counts }));
    },
    [serviceId]
  );

  useEffect(() => {
    if (isFetchMount.current) {
      isFetchMount.current = false;
      return;
    }
    fetchSlots(selectedDate, selectedBarber);
  }, [selectedDate, selectedBarber, fetchSlots]);

  useEffect(() => {
    if (isPrefetchMount.current) {
      isPrefetchMount.current = false;
      return;
    }
    prefetchCounts(visibleDates, selectedBarber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateOffset, selectedBarber, prefetchCounts]);

  const grouped = groupSlots(slots, service);
  const isToday = (d: Date) => dateToYMD(d) === dateToYMD(today);

  const getDayChipStatus = (d: Date) => {
    const ymd = dateToYMD(d);
    const name = getDayName(d);
    if (name === "Sunday") return "closed";
    const count = slotCounts[ymd];
    if (count === undefined) return "loading";
    if (count === -1) return "closed";
    if (count === 0) return "full";
    return "open";
  };

  const canContinue =
    selectedTime !== null && selectedDate !== null && !slotsLoading;

  const handleContinue = () => {
    if (!selectedTime) return;
    onContinue({
      barberId: selectedBarber.id === "no-preference" ? null : selectedBarber.id,
      barberPreference: selectedBarber.id === "no-preference" ? "no-preference" : "specific",
      date: dateToYMD(selectedDate),
      time: selectedTime,
    });
  };

  const dayOfSelectedDate = getDayName(selectedDate);
  const isSaturday = dayOfSelectedDate === "Saturday";

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
              All our barbers offer every service across all opening hours.
            </p>
          </div>
          <span className="text-xs font-body font-medium text-[var(--color-text-muted)] shrink-0 mt-1">
            {allOptions.length} options available
          </span>
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
                onClick={() => setSelectedBarber(b)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedBarber(b);
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
                    {!isNoPref && "specialities" in b && b.specialities.length > 0
                      ? ` · ${b.specialities.slice(0, 2).join(", ")}`
                      : ""}
                  </div>
                  {isNoPref && (
                    <span className="inline-block mt-1 text-[10px] font-body font-semibold text-[var(--color-success)] uppercase tracking-wide">
                      Fastest option
                    </span>
                  )}
                </div>

                {/* Radio indicator */}
                <div
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                    isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
                      : "border-[var(--color-border-strong)] bg-white"
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
            Book up to 30 days ahead · All times in Africa/Lusaka time
          </p>
        </div>

        {/* Calendar strip */}
        <div className="flex items-center gap-2 mb-3">
          <button
            aria-label="Previous dates"
            disabled={dateOffset === 0}
            onClick={() => setDateOffset((o) => Math.max(0, o - 7))}
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-fast shrink-0",
              dateOffset === 0
                ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
                : "border-[var(--color-border-strong)] text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 grid grid-cols-7 gap-1">
            {visibleDates.map((d) => {
              const ymd = dateToYMD(d);
              const status = getDayChipStatus(d);
              const isSelected = dateToYMD(selectedDate) === ymd;
              const isDisabled = status === "closed" || status === "full";

              return (
                <button
                  key={ymd}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) setSelectedDate(d);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${formatDateLabel(d)}${status === "closed" ? ", closed" : status === "full" ? ", fully booked" : ""}`}
                  className={clsx(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-[var(--radius-md)] border text-center transition-fast",
                    "font-body text-xs leading-tight",
                    isSelected && !isDisabled && "bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] border-[var(--color-brand-primary)]",
                    !isSelected && !isDisabled && "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-brand-secondary)] text-[var(--color-brand-primary)]",
                    isDisabled && "bg-[var(--color-surface-muted)]/50 border-[var(--color-border)] text-[var(--color-text-muted)] opacity-60 cursor-not-allowed"
                  )}
                >
                  <span className="font-semibold text-[10px] uppercase tracking-wide">
                    {d.toLocaleDateString("en-US", { weekday: "short", timeZone: bookingConfig.timezone })}
                  </span>
                  <span className="font-bold text-base">
                    {d.toLocaleDateString("en-US", { day: "numeric", timeZone: bookingConfig.timezone })}
                  </span>
                  <span className="text-[9px] font-medium uppercase mt-0.5">
                    {isToday(d) ? "Today" : status === "closed" ? "Closed" : status === "full" ? "Full" : d.toLocaleDateString("en-US", { month: "short", timeZone: bookingConfig.timezone })}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            aria-label="Next dates"
            disabled={dateOffset + 7 >= allDates.length}
            onClick={() => setDateOffset((o) => Math.min(allDates.length - 7, o + 7))}
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-fast shrink-0",
              dateOffset + 7 >= allDates.length
                ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
                : "border-[var(--color-border-strong)] text-[var(--color-brand-primary)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day notes */}
        {dayOfSelectedDate === "Sunday" && (
          <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-warning-tint)] border border-[var(--color-border)] mt-3">
            <AlertCircle className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-xs text-[var(--color-brand-primary)]">
              <strong>Studio closed on Sundays</strong> for weekly deep maintenance and sharpening.
            </p>
          </div>
        )}
        {isSaturday && (
          <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-warning-tint)] border border-[var(--color-border)] mt-3">
            <Clock className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-xs text-[var(--color-brand-primary)]">
              <strong>Saturday studio hours: 08:00 – 16:00.</strong> Groomd is closed on Sundays for weekly deep maintenance and sharpening.
            </p>
          </div>
        )}
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
              Showing available times for <strong>{service.name}</strong> ({service.durationMinutes} min) with{" "}
              <strong>
                {selectedBarber.id === "no-preference" ? "No preference" : selectedBarber.name}
              </strong>{" "}
              on <strong>{formatDateFull(selectedDate)}</strong>.
            </p>
          )}
        </div>

        {slotsLoading && (
          <div className="py-8 flex items-center justify-center gap-2 text-[var(--color-text-muted)] font-body text-sm">
            <div className="w-4 h-4 rounded-full border-2 border-[var(--color-brand-primary)] border-t-transparent animate-spin" />
            Loading available times…
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
            The studio is closed on this day.
          </div>
        )}

        {!slotsLoading && !slotsError && dayStatus === "full" && (
          <div className="py-6 text-center font-body text-sm text-[var(--color-text-muted)]">
            No slots available on this day. Please choose another date.
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
                      {group.sublabel ? ` (${group.sublabel})` : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedTime(slot)}
                          className={clsx(
                            "px-4 py-2 rounded-[var(--radius-md)] border font-body font-semibold text-sm transition-fast",
                            isSelected
                              ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] border-[var(--color-brand-primary)]"
                              : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-brand-primary)] hover:border-[var(--color-brand-secondary)]"
                          )}
                        >
                          {isSelected && "✓ "}{slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Saturday note */}
        {isSaturday && dayStatus === "open" && !slotsLoading && (
          <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
            <p className="font-body text-xs italic text-[var(--color-text-secondary)]">
              On Saturdays, Groomd closes at 16:00.{service ? ` ${service.name}'s final available start time is ${calcFinishTime("16:00", -service.durationMinutes)} to accommodate the ${service.durationMinutes}-minute service duration.` : ""}
            </p>
          </div>
        )}
      </section>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button variant="outline-wine" size="md" onClick={onBack}>
          ← Back to Services
        </Button>
        <Button
          variant="solid-wine"
          size="lg"
          disabled={!canContinue}
          onClick={handleContinue}
          className="sm:w-auto"
        >
          Continue to Your Details →
        </Button>
      </div>
    </div>
  );
}
