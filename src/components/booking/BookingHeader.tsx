import { businessInfo } from "@/lib/data/business";

export function BookingHeader() {
  return (
    <section className="bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] pt-24 pb-10 md:pt-28 md:pb-12">
      <div className="container">
        <p className="eyebrow text-[var(--color-brand-accent)] mb-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)]" aria-hidden="true" />
          <span>GROOMD · {businessInfo.city.toUpperCase()}</span>
        </p>
        <h1 className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-2">
          BOOK AN APPOINTMENT
        </h1>
        <p className="font-body text-[var(--color-text-on-strong-secondary)] text-base sm:text-lg">
          Takes about a minute. No payment needed.
        </p>
      </div>
    </section>
  );
}
