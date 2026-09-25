"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAllBarbers } from "@/lib/data/barbers";

export function BarbersPreview() {
  const barbers = getAllBarbers();

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="barbers-heading">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
          <p className="eyebrow text-[var(--color-brand-primary)] mb-4" aria-hidden="true">
            ● THE BARBERS
          </p>
          <h2 id="barbers-heading" className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)] mb-4">
            Meet the team
          </h2>
          <p className="font-body text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Three barbers, each offering the full menu.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {barbers.map((barber) => (
            <article
              key={barber.id}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/5] bg-[var(--color-surface-muted)] flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-muted)] to-[var(--color-background-support)]">
                  <svg
                    className="w-2/3 h-2/3 max-w-[140px] opacity-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="visually-hidden">{barber.altText || `${barber.name}, ${barber.role} at Groomd`}</p>
              </div>
              <div className="p-5 lg:p-6 flex flex-col flex-1">
                <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-1">
                  {barber.name}
                </h3>
                <p className="eyebrow text-[var(--color-text-secondary)] text-sm mb-3" aria-hidden="true">
                  {barber.role}
                </p>
                <p className="font-body text-sm text-[var(--color-text-primary)] leading-relaxed mb-4 flex-1">
                  {barber.cardDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Specialities">
                  {barber.specialities.map((speciality, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] font-body text-xs font-medium"
                      role="listitem"
                    >
                      {speciality}
                    </span>
                  ))}
                </div>
                <Button
                  variant="text"
                  size="md"
                  className="w-full justify-start gap-2"
                  onSurface="light"
                  asChild
                >
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2"
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                  >
                    Book with {barber.name.split(" ")[0]}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onSurface="light"
            asChild
          >
            <Link href="/about">
              About the team
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}