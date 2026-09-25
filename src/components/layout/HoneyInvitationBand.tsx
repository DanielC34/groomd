"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface HoneyInvitationBandProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HoneyInvitationBand({
  eyebrow = "YOUR CHAIR IS WAITING",
  headline = "READY FOR A FRESH CUT?",
  body = "Choose your service, barber and a time that suits you. Book online in about a minute.",
  ctaText = "BOOK AN APPOINTMENT",
  ctaHref = "/book",
}: HoneyInvitationBandProps = {}) {
  return (
    <section
      className="bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] py-12 lg:py-16"
      aria-labelledby="invitation-heading"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-left">
          <div>
            {eyebrow && (
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-primary)] mb-1">
                {eyebrow}
              </span>
            )}
            <h2 id="invitation-heading" className="font-display font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-2">
              {headline}
            </h2>
            <p className="font-body text-sm lg:text-base text-[var(--color-brand-primary)] max-w-xl">
              {body}
            </p>
          </div>
          <Button
            variant="solid-wine"
            size="lg"
            className="w-full lg:w-auto mt-4 lg:mt-0 uppercase tracking-wider font-bold shrink-0"
            onSurface="accent"
            asChild
          >
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}