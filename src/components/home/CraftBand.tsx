"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CraftBand() {
  return (
    <section className="bg-[var(--color-background-support)] text-[var(--color-text-on-strong-secondary)] py-16 lg:py-24" aria-labelledby="craft-heading">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-[var(--color-brand-accent)] mb-4" aria-hidden="true">
              ● THE CRAFT
            </p>
            <h2 id="craft-heading" className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-text-on-strong)] mb-4 lg:mb-6">
              Good cuts take time.
            </h2>
            <div className="space-y-4 lg:space-y-6">
              <p className="font-body text-base lg:text-lg leading-relaxed">
                At Groomd, every appointment starts with a conversation. How you wear your hair, how fast it grows, what works for your week. Then we get to work: clean sections, sharp lines and a finish that still looks right a week later.
              </p>
              <p className="font-body text-base lg:text-lg leading-relaxed">
                We keep the menu short so every service gets our full attention, from a quick line-up to a full cut with a hot towel shave.
              </p>
            </div>
            <Button
              variant="text"
              size="md"
              className="mt-6 lg:mt-8 w-full sm:w-auto"
              onSurface="strong"
              asChild
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2"
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
              >
                More about Groomd
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-6 lg:col-start-1 aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-background)] relative">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-muted)] to-[var(--color-background-support)]">
              <svg
                className="w-1/2 h-1/2 max-w-[180px] opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="visually-hidden">Close-up of a barber lining up a client&apos;s beard with a straight razor.</p>
          </div>
        </div>
      </div>
    </section>
  );
}