"use client";

import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { getAllBarbers } from "@/lib/data/barbers";

export function BarbersPreview() {
  const barbers = getAllBarbers();

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20" aria-labelledby="barbers-heading">
      <div className="container">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
              THE BARBERS
            </p>
          </div>
          <h2
            id="barbers-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)]"
          >
            Meet the team
          </h2>
          <p className="font-body text-base text-[var(--color-text-secondary)] mt-2">Three barbers, each offering the full menu.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {barbers.map((barber) => (
            <article
              key={barber.id}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast"
            >
              {/* Photo placeholder matching 4:5 ratio */}
              <div className="aspect-[4/5] bg-[var(--color-surface-muted)] relative overflow-hidden flex flex-col items-center justify-center p-6 border-b border-[var(--color-border)]">
                <div className="w-20 h-20 rounded-full bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-primary)] mb-3">
                  <User className="w-10 h-10" aria-hidden="true" />
                </div>
                <p className="visually-hidden">
                  {barber.altText || `${barber.name}, ${barber.role} at Groomd`}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-0.5">
                    {barber.name}
                  </h3>
                  <span className="block font-body text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    {barber.role.toUpperCase()}
                  </span>
                  <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    {barber.cardDescription}
                  </p>

                  {/* Specialities tags */}
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

                <Link
                  href={`/book?barber=${barber.id}`}
                  className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                  aria-label={`Book with ${barber.name}`}
                >
                  <span>Book with {barber.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/about"
          className="mt-10 inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
        >
          <span>About the team</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}