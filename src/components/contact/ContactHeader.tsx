import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";

export function ContactHeader() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(businessInfo.mapSearch)}`;

  return (
    <section className="bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
                CONTACT
              </p>
            </div>

            <h1 className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-4 leading-tight">
              Visit Groomd
            </h1>

            <p className="font-body text-[var(--color-text-on-strong-secondary)] text-base sm:text-lg leading-relaxed mb-8">
              Find us in Kabulonga, give us a call, or book your chair online.
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
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  <span>Get directions</span>
                  <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Hero Studio Image Card */}
          <div className="lg:col-span-6">
            {/* Image pending (CONTENT §17). Flat Mid Wine placeholder: no gradient, no caption. */}
            <div className="aspect-[4/3] lg:aspect-[16/11] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-brand-secondary)] relative">
              <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
              </div>
              <p className="visually-hidden">
                The Groomd studio interior with leather barber chairs, mirrors and warm lighting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
