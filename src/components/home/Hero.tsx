"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";
import { getOpeningHours, isDayClosed } from "@/lib/data/opening-hours";
import type { DayOfWeek } from "@/lib/types";

function getTodayHours(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Lusaka" }) as DayOfWeek;
  if (isDayClosed(day)) {
    return "Closed today";
  }
  const hours = getOpeningHours(day);
  if (!hours) return "Closed today";
  return `Open today ${hours.open}–${hours.close}`;
}

export function Hero() {
  const todayStatus = getTodayHours();

  return (
    <section
      className="relative bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
                MEN&apos;S GROOMING STUDIO · {businessInfo.city.toUpperCase()}
              </p>
            </div>

            <h1
              id="hero-heading"
              className="font-display font-extrabold uppercase tracking-tight text-[var(--color-text-on-strong)] leading-[1.05] mb-5"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)" }}
            >
              LOOK SHARP.
              <br />
              <span className="text-[var(--color-brand-accent)]">EFFORTLESSLY.</span>
            </h1>

            <p className="text-[var(--color-text-on-strong-secondary)] font-body text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              Precision cuts, clean fades and proper beard work from barbers who take their time. Book your chair online in about a minute.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

            {/* Dynamic Status / Trust line */}
            <div className="flex items-center gap-2 text-xs lg:text-sm font-body text-[var(--color-text-on-strong-muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
              <span>
                {todayStatus} · {businessInfo.address.short}
              </span>
            </div>
          </div>

          {/* Hero Image Container */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] lg:aspect-[16/11] rounded-[var(--radius-lg)] overflow-hidden bg-[#2D030A] border border-[var(--color-brand-secondary)]/50 relative shadow-2xl">
              {/* Graphic placeholder illustration matching barbering setup */}
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5A0A17] via-[#44040F] to-[#2D030A]">
                <div className="w-24 h-24 rounded-full bg-[var(--color-brand-secondary)]/40 flex items-center justify-center mb-4 border border-[var(--color-brand-accent)]/30">
                  <svg
                    className="w-12 h-12 text-[var(--color-brand-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L4 4m5.121 5.121L4 14.121m10.121 0L19 9"
                    />
                  </svg>
                </div>
                <span className="font-display font-bold text-lg text-[var(--color-brand-light)] tracking-wide uppercase">
                  GROOMD STUDIO
                </span>
                <span className="font-body text-xs text-[var(--color-brand-accent)] mt-1">
                  Master Barbers at Work · Kabulonga
                </span>
              </div>
              <p className="visually-hidden">
                A Groomd barber finishing a skin fade on a client in a leather barber chair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}