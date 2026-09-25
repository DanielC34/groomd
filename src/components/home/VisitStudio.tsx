"use client";

import { MapPin, Phone, ExternalLink } from "lucide-react";
import { businessInfo, addressLines } from "@/lib/data/business";
import { openingHours } from "@/lib/data/opening-hours";
import { useLusakaWeekday } from "@/lib/hooks/use-lusaka-weekday";

export function VisitStudio() {
  // null until hydrated; the "today" row highlight then appears (no server/client mismatch).
  const todayName = useLusakaWeekday();

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20 border-t border-[var(--color-border)]/50" aria-labelledby="visit-heading">
      <div className="container">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
              VISIT
            </p>
          </div>
          <h2
            id="visit-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)]"
          >
            Find the studio
          </h2>
          <p className="font-body text-base text-[var(--color-text-secondary)] mt-2 max-w-2xl">
            We&apos;re in Kabulonga, a short drive from the city centre. Book ahead to secure your time.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Phone & Hours */}
          <div className="lg:col-span-6 space-y-6">
            {/* Studio Address Card */}
            <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 shadow-xs">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-1">
                    Address
                  </h3>
                  <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {addressLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
                <a
                  href={`tel:${businessInfo.phone.tel}`}
                  className="inline-flex items-center gap-2 font-body font-bold text-xs text-[var(--color-brand-primary)] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{businessInfo.phone.display}</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(businessInfo.mapSearch)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:underline"
                >
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>

            {/* Opening Hours Table Card */}
            <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)]">
                  Opening hours
                </h3>
              </div>

              <table className="w-full font-body text-xs">
                <tbody>
                  {openingHours.map((row) => {
                    const isToday = row.day === todayName;
                    return (
                      <tr
                        key={row.day}
                        className={isToday ? "font-bold text-[var(--color-brand-primary)] bg-[var(--color-surface-muted)]/50" : "text-[var(--color-text-secondary)]"}
                      >
                        <td className="py-2 px-2 text-left">
                          {row.day}
                          {isToday && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-primary)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
                              Today
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {row.closed ? "Closed" : `${row.open}–${row.close}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </article>
          </div>

          {/* Right Column: Styled Map Preview Container */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] lg:aspect-[1/1] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] relative overflow-hidden flex flex-col justify-between p-6 shadow-xs">
              {/* Map Graphic Styling */}
              <div className="absolute inset-0 bg-[var(--color-surface-muted)] flex items-center justify-center opacity-90" aria-hidden="true">
                <svg className="w-full h-full text-[var(--color-border)]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0 100 Q200 150 400 80" />
                  <path d="M0 250 Q150 200 400 300" strokeWidth="4" />
                  <path d="M200 0 Q220 200 180 400" strokeWidth="3" />
                  <path d="M80 0 L320 400" />
                </svg>
              </div>

              {/* Pin Callout */}
              <div className="relative z-10 self-center my-auto bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] p-4 rounded-[var(--radius-md)] shadow-lg text-center border border-[var(--color-brand-accent)]/40 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-display font-extrabold text-sm uppercase tracking-wider block text-[var(--color-brand-light)]">
                  {businessInfo.name}
                </span>
                <span className="font-body text-[11px] text-[var(--color-brand-accent)] block mt-0.5">
                  {businessInfo.address.short}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}