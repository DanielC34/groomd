"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { services, serviceCategories } from "@/lib/data/services";
import type { Service } from "@/lib/types";

export function ServiceCategorySection() {
  return (
    <div className="bg-[var(--color-background)] py-12 lg:py-16 space-y-16">
      {serviceCategories.map((catInfo) => {
        const categoryServices = services.filter((s) => s.category === catInfo.category);
        if (categoryServices.length === 0) return null;

        const categoryId = `category-${catInfo.category.toLowerCase()}`;
        
        return (
          <section
            key={catInfo.category}
            id={categoryId}
            className="container scroll-mt-24"
            aria-labelledby={`${categoryId}-heading`}
          >
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--color-border)] pb-4 mb-8">
              <div>
                <h2
                  id={`${categoryId}-heading`}
                  className="font-display font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-[var(--color-brand-primary)]"
                >
                  {catInfo.label}
                </h2>
              </div>
              <p className="font-body text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 sm:mt-0">
                {catInfo.intro}
              </p>
            </div>

            {/* Packages: single wide card */}
            {catInfo.category === "Packages" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Cut & Beard Package Card */}
                {categoryServices.map((service: Service) => (
                  <article
                    key={service.id}
                    className="lg:col-span-8 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 lg:p-8 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast"
                  >
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--color-brand-primary)]">
                            {service.name}
                          </h3>
                        </div>
                        <span className="font-display font-bold text-2xl text-[var(--color-brand-primary)]">
                          K {service.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] font-body mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)] font-semibold">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {service.durationMinutes} min
                        </span>
                      </div>

                      <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                        {service.description}
                      </p>

                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <Link
                        href={`/book?service=${service.id}`}
                        className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                        aria-label={`Book ${service.name}`}
                      >
                        <span>Book this</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}

              </div>
            ) : (
              /* Regular 3-Column Grid for Haircuts, Beard, Kids */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service: Service) => {
                  return (
                    <article
                      key={service.id}
                      className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)] font-body mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)] font-semibold">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            {service.durationMinutes} min
                          </span>
                          <span className="font-display font-bold text-xl text-[var(--color-brand-primary)]">
                            K {service.price}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                          {service.name}
                        </h3>

                        <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                          {service.description}
                        </p>

                      </div>

                      <div className="pt-4 border-t border-[var(--color-border)]">
                        <Link
                          href={`/book?service=${service.id}`}
                          className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                          aria-label={`Book ${service.name}`}
                        >
                          <span>Book this</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
