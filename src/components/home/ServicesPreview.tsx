"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getServiceById } from "@/lib/data/services";
import type { Service } from "@/lib/types";

const previewServiceIds: Service["id"][] = ["signature-cut", "skin-fade", "beard-trim-shape", "cut-and-beard"];

export function ServicesPreview() {
  const services = previewServiceIds.map((id) => getServiceById(id)!).filter(Boolean);

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="services-preview-heading">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
          <p className="eyebrow text-[var(--color-brand-primary)] mb-4" aria-hidden="true">
            ● SERVICES
          </p>
          <h2 id="services-preview-heading" className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-text-primary)] mb-4">
            Cuts, fades and beard work
          </h2>
          <p className="font-body text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            A short menu, done properly.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {services.map((service) => (
            <article
              key={service.id}
              className="group bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-1)] transition-fast overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-[var(--color-surface-muted)] flex items-center justify-center">
                <svg
                  className="w-1/2 h-1/2 max-w-[120px] opacity-50"
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
              <div className="p-5 lg:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)]">
                    {service.name}
                  </h3>
                  <span className="font-display font-bold text-xl text-[var(--color-text-primary)] whitespace-nowrap">
                    K {service.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-body text-sm mb-3">
                  <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{service.durationMinutes} min</span>
                </div>
                <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 flex-1">
                  {service.description}
                </p>
                <Button
                  variant="text"
                  size="md"
                  className="w-full self-start justify-start gap-2"
                  onSurface="light"
                  asChild
                >
                  <Link
                    href={`/book?service=${service.id}`}
                    aria-label={`Book ${service.name}`}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                  >
                    Book this
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onSurface="light"
            asChild
          >
            <Link href="/services">
              View all services
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}