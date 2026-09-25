"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CraftBand() {
  return (
    <section
      className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24 border-t border-b border-[var(--color-brand-secondary)]"
      aria-labelledby="craft-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Craft Image Container */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[#2D030A] border border-[var(--color-brand-secondary)] shadow-xl relative">
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6B2A33] via-[#44040F] to-[#2D030A]">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="font-display font-bold text-base text-[var(--color-brand-light)] tracking-wide uppercase text-center">
                  CRAFT & PRECISION
                </span>
                <span className="font-body text-xs text-[var(--color-brand-accent)] mt-1 text-center">
                  Head Barber Mwila Banda · Lusaka
                </span>
              </div>
              <p className="visually-hidden">
                Close-up of a barber lining up a client&apos;s beard with a straight razor.
              </p>
            </div>
          </div>

          {/* Right Craft Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
                OUR APPROACH
              </p>
            </div>

            <h2
              id="craft-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-6"
            >
              GOOD CUTS TAKE TIME.
            </h2>

            <div className="space-y-4 font-body text-base lg:text-lg text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-8">
              <p>
                Groomd was built in Kabulonga to give Lusaka men a place where grooming is treated as a deliberate craft. No rushed turnaround, no overcrowded waiting benches, and no corner-cutting clippers.
              </p>
              <p>
                Every visit begins with a brief consultation about your natural hair pattern and head shape. We combine classical barbering fundamentals with modern textured technique, finished with hot towel therapy and razor precision.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-body font-bold text-sm uppercase tracking-wider text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)] transition-fast"
            >
              <span>Learn more about Groomd</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}