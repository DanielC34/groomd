import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ServicesHeader() {
  return (
    <section className="bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
              OUR SERVICES
            </p>
          </div>

          <h1 className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-4 leading-tight">
            GOOD GROOMING, DONE PROPERLY.
          </h1>

          <p className="font-body text-[var(--color-text-on-strong-secondary)] text-base sm:text-lg leading-relaxed mb-6">
            From precise cuts and clean fades to proper beard work, every service is built around taking the time to get it right.
          </p>

          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[#2D030A] border border-[var(--color-brand-secondary)]/60 text-xs font-body text-[var(--color-text-on-strong-muted)] mb-8">
            <span className="font-semibold text-[var(--color-brand-light)]">All prices in ZMW</span>
            <span>·</span>
            <span>Pay in-store</span>
            <span>·</span>
            <span>Takes about a minute to book online</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="book"
              size="lg"
              onSurface="strong"
              asChild
              className="font-bold uppercase tracking-wider px-8"
            >
              <Link href="/book">Book an appointment</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onSurface="strong"
              asChild
              className="font-bold uppercase tracking-wider px-8 border-[var(--color-brand-secondary)] text-[var(--color-brand-light)] hover:bg-[var(--color-brand-secondary)]"
            >
              <Link href="/contact">Contact Groomd</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
