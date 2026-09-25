"use client";

import { Shield, Tag, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
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
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="values-heading">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
          <p className="eyebrow text-[var(--color-brand-primary)] mb-4" aria-hidden="true">
            ● WHY GROOMD
          </p>
          <h2 id="values-heading" className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)] mb-4">
            A barbershop that respects your time.
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value) => (
            <article
              key={value.title}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-3 p-4 lg:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)]"
            >
              <div className="flex-center w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)] flex-shrink-0">
                <value.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base lg:text-lg text-[var(--color-text-primary)]">
                  {value.title}
                </h3>
                <p className="font-body text-sm lg:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}