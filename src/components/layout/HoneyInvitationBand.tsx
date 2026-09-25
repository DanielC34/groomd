"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface HoneyInvitationBandProps {
  headline?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HoneyInvitationBand({
  headline = "Ready for a fresh cut?",
  body = "Choose your service, barber and a time that suits you.",
  ctaText = "Book Now",
  ctaHref = "/book",
}: HoneyInvitationBandProps = {}) {
  return (
    <section
      className="bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)]"
      aria-labelledby="invitation-heading"
    >
      <div className="container">
        <div className={clsx(
          "py-12 lg:py-16",
          "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-left"
        )}>
          <div>
            <h2 id="invitation-heading" className="font-display font-bold text-2xl lg:text-3xl mb-3">
              {headline}
            </h2>
            <p className="font-body text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              {body}
            </p>
          </div>
          <Button
            variant="solid-wine"
            size="lg"
            fullWidth={false}
            className="w-full lg:w-auto mt-6 lg:mt-0"
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

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}