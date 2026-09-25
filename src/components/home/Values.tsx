"use client";

import { Clock, Tag, Users } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Time set aside for you",
    description: "Every appointment is booked for the full length of your service, so nobody rushes your cut.",
  },
  {
    icon: Tag,
    title: "Prices you can see",
    description: "Every service is listed with its price and time before you book. No surprises at the chair.",
  },
  {
    icon: Users,
    title: "Your barber, your call",
    description: "Pick the barber you trust, or choose no preference and we'll seat you with whoever is free.",
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
              WHY GROOMD
            </p>
          </div>
          <h2
            id="values-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] max-w-3xl"
          >
            A barbershop that respects your time.
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