"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CraftBand() {
  return (
    <section
      // CONTENT §6.5 / DESIGN: the craft story is the page's Mid Wine supporting band.
      className="bg-[var(--color-brand-secondary)] text-[var(--color-text-on-strong)] py-16 lg:py-24"
      aria-labelledby="craft-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Craft Image Container */}
          <div className="lg:col-span-5">
            {/* Image pending (CONTENT §17). Flat Wine placeholder on the Mid Wine band: no gradient, no caption. */}
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-brand-primary)] relative">
              <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                <svg className="w-10 h-10 text-[var(--color-brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
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
                THE CRAFT
              </p>
            </div>

            <h2
              id="craft-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-6"
            >
              Good cuts take time.
            </h2>

            <div className="space-y-4 font-body text-base lg:text-lg text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-8">
              <p>
                At Groomd, every appointment starts with a conversation. How you wear your hair, how fast it grows, what works for your week. Then we get to work: clean sections, sharp lines and a finish that still looks right a week later.
              </p>
              <p>
                We keep the menu short so every service gets our full attention, from a quick line-up to a full cut with a hot towel shave.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-body font-bold text-sm uppercase tracking-wider text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)] transition-fast"
            >
              <span>More about Groomd</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}