import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AboutHeader() {
  return (
    <section className="bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
                ABOUT
              </p>
            </div>

            <h1 className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-4 leading-tight">
              About Groomd
            </h1>

            <p className="font-body text-[var(--color-text-on-strong-secondary)] text-base sm:text-lg leading-relaxed mb-8">
              A modern barbershop in Kabulonga, built around one idea: good grooming should be easy to book and worth the chair time.
            </p>

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
                <Link href="/services">View services</Link>
              </Button>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6">
            {/* Image pending (CONTENT §17). Flat Mid Wine placeholder: no gradient, no caption. */}
            <div className="aspect-[4/3] lg:aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-brand-secondary)] relative">
              <div className="w-full h-full flex items-center justify-center text-[var(--color-brand-accent)]" aria-hidden="true">
                <svg
                    className="w-10 h-10 text-[var(--color-brand-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
                    />
                  </svg>
              </div>
              <p className="visually-hidden">
                A barber talking with a client in the mirror before starting a haircut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
