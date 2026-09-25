"use client";

import { Clock, DollarSign, Users } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "TIME SET ASIDE FOR YOU",
    description:
      "Your appointment is your time in the chair. Barbers stay focused on one cut at a time, with no rushing you through.",
  },
  {
    icon: DollarSign,
    title: "PRICES YOU CAN SEE",
    description:
      "Clear, honest prices before you book. Pay in-store after your service via card, cash, or mobile payment. No surprises.",
  },
  {
    icon: Users,
    title: "YOUR BARBER, YOUR CALL",
    description:
      "Choose your preferred specialist, or pick \"No preference\" and we'll assign the first skilled chair available for your slot.",
  },
] as const;

export function Values() {
  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20" aria-labelledby="values-heading">
      <div className="container">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
              THE GROOMD STANDARD
            </p>
          </div>
          <h2
            id="values-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] max-w-3xl"
          >
            A BARBERSHOP THAT RESPECTS YOUR TIME.
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => (
            <article
              key={val.title}
              className="flex flex-col items-start gap-4 p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-xs"
            >
              <div className="w-10 h-10 rounded-full border border-[var(--color-brand-primary)] flex items-center justify-center text-[var(--color-brand-primary)] shrink-0">
                <val.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] uppercase tracking-wide mb-2">
                  {val.title}
                </h3>
                <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {val.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}