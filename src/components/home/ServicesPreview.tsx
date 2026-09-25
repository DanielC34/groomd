"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getServiceById } from "@/lib/data/services";
import type { Service } from "@/lib/types";

const previewServiceIds: Service["id"][] = [
  "signature-cut",
  "skin-fade",
  "beard-trim-shape",
  "cut-and-beard",
];

export function ServicesPreview() {
  const previewServices = previewServiceIds.map((id) => getServiceById(id)!).filter(Boolean);

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20 border-t border-[var(--color-border)]/50" aria-labelledby="services-preview-heading">
      <div className="container">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
                SERVICES
              </p>
            </div>
            <h2
              id="services-preview-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)]"
            >
              THE ESSENTIALS, DONE PROPERLY.
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] hover:underline shrink-0"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewServices.map((service) => (
            <article
              key={service.id}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between hover:border-[var(--color-brand-secondary)] transition-fast shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
                    {service.name}
                  </h3>
                  <span className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
                    K {service.price}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-3">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{service.durationMinutes} min</span>
                </div>

                <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <Link
                href={`/book?service=${service.id}`}
                className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                aria-label={`Book ${service.name}`}
              >
                <span>BOOK THIS</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}