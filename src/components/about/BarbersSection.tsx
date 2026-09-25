"use client";

import Link from "next/link";
import { ArrowRight, User, Info } from "lucide-react";
import { getAllBarbers } from "@/lib/data/barbers";

export function BarbersSection() {
  const barbers = getAllBarbers();

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20" aria-labelledby="barbers-section-heading">
      <div className="container">
        <header className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
              OUR BARBERS
            </p>
          </div>
          <h2
            id="barbers-section-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-3"
          >
            GOOD HANDS. GOOD PEOPLE.
          </h2>
          <p className="font-body text-sm sm:text-base text-[var(--color-text-secondary)]">
            Three barbers, different strengths, one standard: take the time to get it right.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {barbers.map((barber) => (
            <article
              key={barber.id}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast"
            >
              {/* Photo placeholder 4:5 ratio */}
              <div className="aspect-[4/5] bg-[var(--color-surface-muted)] relative overflow-hidden flex flex-col items-center justify-center p-6 border-b border-[var(--color-border)]">
                <div className="w-20 h-20 rounded-full bg-[#EBDDC3] flex items-center justify-center text-[var(--color-brand-primary)] mb-3">
                  <User className="w-10 h-10" aria-hidden="true" />
                </div>
                <span className="font-display font-bold text-sm text-[var(--color-brand-primary)] uppercase tracking-wider text-center">
                  {barber.name}
                </span>
                <span className="font-body text-xs text-[var(--color-text-muted)] text-center">
                  {barber.role}
                </span>
                <p className="visually-hidden">
                  {barber.altText || `${barber.name}, ${barber.role} at Groomd`}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                    {barber.role.toUpperCase()}
                  </span>
                  <h3 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">
                    {barber.name}
                  </h3>
                  <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    {barber.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {barber.specialities.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] font-body text-[11px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <Link
                    href={`/book?barber=${barber.id}`}
                    className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                    aria-label={`Book with ${barber.name}`}
                  >
                    <span>Book with {barber.name.split(" ")[0]}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Info callout box */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-[#FAF4E6] border border-[#E8DCC4] flex items-center gap-3 text-xs font-body text-[var(--color-text-secondary)] shadow-xs">
          <Info className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0" aria-hidden="true" />
          <p>
            All three barbers work full studio hours (Monday through Saturday) and perform all services across our menu with equal care.
          </p>
        </div>
      </div>
    </section>
  );
}
