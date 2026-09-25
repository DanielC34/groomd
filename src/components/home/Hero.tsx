"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/data/business";
import { getTodayLine } from "@/lib/data/opening-hours";
import { useLusakaWeekday } from "@/lib/hooks/use-lusaka-weekday";


export function Hero() {
  // Weekday is read after hydration only, so server and client HTML match (see useLusakaWeekday).
  const today = useLusakaWeekday();
  const todayStatus = today ? getTodayLine(today) : null;

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
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
              <span>
                {todayStatus ? `${todayStatus} · ` : null}{businessInfo.address.short}
              </span>
            </div>
          </div>

          {/* Hero Image Container */}
          <div className="lg:col-span-7">
            {/* Image pending (CONTENT §17). Flat Mid Wine placeholder: no gradient, no unapproved caption. */}
            <div className="aspect-[4/3] lg:aspect-[16/11] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-brand-secondary)] relative">
              <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                <svg className="w-12 h-12 text-[var(--color-brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L4 4m5.121 5.121L4 14.121m10.121 0L19 9" />
                </svg>
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