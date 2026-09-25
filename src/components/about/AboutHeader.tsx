import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";
import { getShortHoursString } from "@/lib/data/opening-hours";

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
                ABOUT GROOMD
              </p>
            </div>

            <h1 className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-4 leading-tight">
              A BARBERSHOP THAT RESPECTS YOUR TIME.
            </h1>

            <p className="font-body text-[var(--color-text-on-strong-secondary)] text-base sm:text-lg leading-relaxed mb-8">
              Groomd is a modern men&apos;s grooming studio in Kabulonga, Lusaka. We built it around a simple idea: good grooming should feel straightforward, personal and worth the time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
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

            {/* 3 Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-brand-secondary)]/60 text-xs font-body">
              <div>
                <span className="font-display font-bold text-sm text-[var(--color-brand-light)] block">
                  {businessInfo.address.short.split(",")[0]}
                </span>
                <span className="text-[var(--color-text-on-strong-muted)] text-[11px]">
                  Lusaka, Zambia
                </span>
              </div>
              <div>
                <span className="font-display font-bold text-sm text-[var(--color-brand-light)] block">
                  {getShortHoursString().split(" ")[1] || "09:00–18:00"}
                </span>
                <span className="text-[var(--color-text-on-strong-muted)] text-[11px]">
                  Monday to Friday
                </span>
              </div>
              <div>
                <span className="font-display font-bold text-sm text-[var(--color-brand-light)] block">
                  3 Chairs
                </span>
                <span className="text-[var(--color-text-on-strong-muted)] text-[11px]">
                  Bespoke Stations
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] lg:aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[#2D030A] border border-[var(--color-brand-secondary)] relative shadow-xl">
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5A0A17] via-[#44040F] to-[#2D030A]">
                <div className="w-20 h-20 rounded-full bg-[var(--color-brand-secondary)]/50 flex items-center justify-center mb-4 border border-[var(--color-brand-accent)]/30">
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
                <span className="font-display font-bold text-base text-[var(--color-brand-light)] tracking-wide uppercase text-center">
                  STUDIO CHAIR 01 · KABULONGA
                </span>
                <span className="font-body text-xs text-[var(--color-brand-accent)] mt-1 text-center">
                  Precision finishing and natural light
                </span>
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
