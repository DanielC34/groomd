"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";
import { openingHours } from "@/lib/data/opening-hours";

function getTodayDay(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Lusaka" });
}

export function VisitStudio() {
  const today = getTodayDay();

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="visit-heading">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
          <p className="eyebrow text-[var(--color-brand-primary)] mb-4" aria-hidden="true">
            ● VISIT
          </p>
          <h2 id="visit-heading" className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)] mb-4">
            Find the studio
          </h2>
          <p className="font-body text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl mx-auto">
            We&apos;re in Kabulonga, a short drive from the city centre. Book ahead to secure your time.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6 lg:space-y-8">
            <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)] flex-shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-1">
                    Address
                  </h3>
                  <address className="not-italic font-body text-base text-[var(--color-text-secondary)] leading-relaxed">
                    <p>{businessInfo.address.full}</p>
                  </address>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                onSurface="light"
                asChild
              >
                <Link href="/contact">Get directions</Link>
              </Button>
            </article>

            <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)] flex-shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-1">
                    Phone
                  </h3>
                  <a
                    href={`tel:${businessInfo.phone.tel}`}
                    className="font-body text-base text-[var(--color-text-secondary)] hover:text-[var(--color-brand-accent)] hover:underline transition-fast"
                  >
                    {businessInfo.phone.display}
                  </a>
                  <p className="font-body text-sm text-[var(--color-text-muted)] mt-1">
                    Call to cancel or change a booking.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-2 lg:col-start-1">
            <article className="bg-[var(--color-background-support)] text-[var(--color-text-on-strong-secondary)] rounded-[var(--radius-lg)] p-5 lg:p-6" aria-labelledby="hours-heading">
              <h3 id="hours-heading" className="eyebrow text-[var(--color-brand-accent)] mb-4" aria-hidden="true">
                ● OPENING HOURS
              </h3>
              <table className="w-full font-body text-sm" role="table">
                <tbody>
                  {openingHours.map((day) => {
                    const isToday = day.day === today;
                    return (
                      <tr
                        key={day.day}
                        className={isToday ? "bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)]" : "border-b border-[var(--color-border-on-strong)]"}
                      >
                        <td className="text-left py-2 px-3 font-medium">
                          {day.day} {isToday && <span className="ml-2 inline-flex items-center gap-1 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)]" aria-hidden="true" />
                            Today
                          </span>}
                        </td>
                        <td className="text-right py-2 px-3 font-medium">
                          {day.closed ? "Closed" : `${day.open}–${day.close}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[var(--color-text-on-strong-muted)] font-body text-sm mt-4 text-center">
                The quickest way to get a time is to book online. We can&apos;t take bookings by email.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}