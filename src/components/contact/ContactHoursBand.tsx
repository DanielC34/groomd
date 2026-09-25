"use client";

import { openingHours, getTodayLine } from "@/lib/data/opening-hours";
import { useLusakaWeekday } from "@/lib/hooks/use-lusaka-weekday";

export function ContactHoursBand() {
  // Read in the browser after hydration: this page is prerendered, so a render-time date would be stale or mismatch.
  const today = useLusakaWeekday();
  const todayStatus = today ? getTodayLine(today) : null;

  return (
    <section
      className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24 border-t border-b border-[var(--color-brand-secondary)]"
      aria-labelledby="contact-hours-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5">
            <h2
              id="contact-hours-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-4"
            >
              Opening hours
            </h2>

            <div
              className={`inline-flex items-center gap-2 text-xs font-body font-bold text-[var(--color-brand-accent)] ${todayStatus ? "" : "invisible"}`}
              aria-hidden={todayStatus ? undefined : true}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <span>{todayStatus ?? "\u00a0"}</span>
            </div>
          </div>

          {/* Right Hours Table Card */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--color-brand-secondary)] rounded-[var(--radius-lg)] border border-[var(--color-brand-secondary)] p-6 md:p-8 shadow-xl">
              <table className="w-full font-body text-sm text-[var(--color-brand-light)]">
                <tbody>
                  {openingHours.map((row) => (
                    <tr key={row.day} className="border-b border-[var(--color-brand-primary)]/50 last:border-b-0">
                      <td className="py-3 font-semibold text-left">
                        {row.day}
                        {row.day === today && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-brand-accent)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
                            Today
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-bold text-right">
                        {row.closed ? "Closed" : `${row.open}–${row.close}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
