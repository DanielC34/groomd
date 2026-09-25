"use client";

import { MapPin, Clock, Calendar } from "lucide-react";
import { businessInfo } from "@/lib/data/business";
import { QUICK_INFO_HOURS } from "@/lib/data/opening-hours";

export function QuickInfo() {
  return (
    <section className="bg-[var(--color-background)] py-10 lg:py-12 border-b border-[var(--color-border)]/50" aria-labelledby="quick-info-heading">
      <div className="container">
        <h2 id="quick-info-heading" className="visually-hidden">
          Quick information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Location */}
          <article className="flex items-start gap-4 p-5 lg:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-xs">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)]">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                LOCATION
              </span>
              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] leading-tight">
                {businessInfo.address.short}
              </h3>
            </div>
          </article>

          {/* Card 2: Hours */}
          <article className="flex items-start gap-4 p-5 lg:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-xs">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)]">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                HOURS
              </span>
              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] leading-tight">
                {QUICK_INFO_HOURS}
              </h3>
            </div>
          </article>

          {/* Card 3: Booking */}
          <article className="flex items-start gap-4 p-5 lg:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-xs">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)]">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                BOOKING
              </span>
              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] leading-tight">
                Book online, any time
              </h3>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}