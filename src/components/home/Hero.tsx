"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";
import { getOpeningHours, isDayClosed } from "@/lib/data/opening-hours";

import type { DayOfWeek } from '@/lib/types';

function getTodayHours(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Lusaka" }) as DayOfWeek;
  if (isDayClosed(day)) {
    return "Today: Closed";
  }
  const hours = getOpeningHours(day);
  if (!hours) return "Today: Closed";
  return `Today: ${hours.open}–${hours.close}`;
}

export function Hero() {
  const trustLine = `${getTodayHours()} · ${businessInfo.address.short}`;

  return (
    <section className="relative bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)]" aria-labelledby="hero-heading">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24">
          <div className="lg:col-span-5 lg:col-start-1 flex flex-col justify-center min-h-[60vh] lg:min-h-[70vh]">
            <p className="eyebrow text-[var(--color-brand-accent)] mb-4 lg:mb-6" aria-hidden="true">
              ● MEN&apos;S GROOMING STUDIO · LUSAKA
            </p>
            <h1
              id="hero-heading"
              className="font-display font-extrabold uppercase tracking-[-0.01em] text-[var(--color-text-on-strong)] leading-[1.0] mb-4 lg:mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              LOOK SHARP.
              <span className="text-[var(--color-brand-accent)]"> EFFORTLESSLY.</span>
            </h1>
            <p className="text-[var(--color-text-on-strong-secondary)] font-body text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xs">
              Precision cuts, clean fades and proper beard work from barbers who take their time. Book your chair online in about a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Button
                variant="book"
                size="lg"
                className="w-full sm:w-auto"
                onSurface="strong"
                asChild
              >
                <Link href="/book">Book an appointment</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onSurface="strong"
                asChild
              >
                <Link href="/services">
                  View services
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 lg:mt-8 text-[var(--color-text-on-strong-muted)] font-body text-sm leading-relaxed" role="status" aria-live="polite">
              {trustLine}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 relative">
            <div className="aspect-[4/3] lg:aspect-[16/9] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)]">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-muted)] to-[var(--color-background-support)]">
                <svg
                  className="w-1/3 h-1/3 max-w-[200px] opacity-50"
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
            </div>
            <p className="visually-hidden">A Groomd barber finishing a skin fade on a client in a leather barber chair.</p>
          </div>
        </div>
      </div>
    </section>
  );
}