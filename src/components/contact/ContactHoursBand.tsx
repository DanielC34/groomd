import { Info } from "lucide-react";
import { openingHours, getOpeningHours, isDayClosed } from "@/lib/data/opening-hours";
import type { DayOfWeek } from "@/lib/types";

function getTodayHoursText(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Lusaka" }) as DayOfWeek;
  if (isDayClosed(day)) {
    return "Today: Closed";
  }
  const hours = getOpeningHours(day);
  if (!hours) return "Today: Closed";
  return `Today: ${hours.open}–${hours.close} (Lusaka Time)`;
}

export function ContactHoursBand() {
  const todayStatus = getTodayHoursText();

  return (
    <section
      className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24 border-t border-b border-[var(--color-brand-secondary)]"
      aria-labelledby="contact-hours-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
                STUDIO HOURS
              </p>
            </div>

            <h2
              id="contact-hours-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-4"
            >
              OPENING HOURS
            </h2>

            <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-6">
              Our barbers take appointments Monday through Saturday. Walk-ins are welcomed subject to chair availability.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-body font-bold text-[var(--color-brand-accent)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
              <span>{todayStatus}</span>
            </div>
          </div>

          {/* Right Hours Table Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#2D030A] rounded-[var(--radius-lg)] border border-[var(--color-brand-secondary)] p-6 md:p-8 shadow-xl">
              <table className="w-full font-body text-sm text-[var(--color-brand-light)] mb-6">
                <tbody>
                  {openingHours.map((row) => (
                    <tr key={row.day} className="border-b border-[var(--color-brand-secondary)]/50">
                      <td className="py-3 font-semibold text-left">{row.day}</td>
                      <td className="py-3 font-bold text-right">
                        {row.closed ? "Closed" : `${row.open} – ${row.close}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 rounded-[var(--radius-md)] bg-[#44040F] border border-[var(--color-brand-secondary)]/80 flex items-start gap-3 text-xs font-body text-[var(--color-text-on-strong-muted)]">
                <Info className="w-4 h-4 text-[var(--color-brand-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  Special holiday hours are posted 48 hours prior on studio boards. Book ahead for peak weekend slots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
