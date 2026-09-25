"use client";

import Link from "next/link";
import { ArrowRight, Clock, Info, Check } from "lucide-react";
import { services, serviceCategories } from "@/lib/data/services";
import type { Service } from "@/lib/types";

export function ServiceCategorySection() {
  return (
    <div className="bg-[var(--color-background)] py-12 lg:py-16 space-y-16">
      {serviceCategories.map((catInfo, categoryIndex) => {
        const categoryServices = services.filter((s) => s.category === catInfo.category);
        if (categoryServices.length === 0) return null;

        const categoryId = `category-${catInfo.category.toLowerCase()}`;
        const categoryNumber = `0${categoryIndex + 1}`;

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
                <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1">
                  CATEGORY {categoryNumber}
                </span>
                <h2
                  id={`${categoryId}-heading`}
                  className="font-display font-extrabold uppercase tracking-tight text-2xl md:text-3xl text-[var(--color-brand-primary)]"
                >
                  {catInfo.category === "Beard" ? "BEARD" : catInfo.category.toUpperCase()}
                </h2>
              </div>
              <p className="font-body text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 sm:mt-0">
                {catInfo.intro}
              </p>
            </div>

            {/* Special Grid for Packages to fit Studio Note */}
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
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#EBDDC3] text-[var(--color-brand-primary)] font-bold text-[10px] uppercase">
                          FULL SESSION
                        </span>
                      </div>

                      <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="p-4 rounded-[var(--radius-md)] bg-[#FAF4E6] border border-[#E8DCC4] flex items-start gap-3 text-xs font-body text-[var(--color-text-secondary)] mb-6">
                        <Info className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" aria-hidden="true" />
                        <p>
                          <strong className="font-semibold text-[var(--color-brand-primary)]">Included:</strong> Signature Cut or Skin Fade + full Beard Trim & Shape. Choose your cut with your barber on the day.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <Link
                        href={`/book?service=${service.id}`}
                        className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                        aria-label={`Book ${service.name}`}
                      >
                        <span>Book this service</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}

                {/* Studio Note Side Card */}
                <aside className="lg:col-span-4 bg-[#FAF4E6] rounded-[var(--radius-lg)] border border-[#E8DCC4] p-6 flex flex-col justify-between">
                  <div>
                    <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1">
                      STUDIO NOTE
                    </span>
                    <h4 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-2">
                      Unrushed Attention
                    </h4>
                    <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      We dedicate a full 75-minute block to ensure precision clipper work, razor lining, and steam towel replenishment without compromise.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8DCC4] flex items-center gap-2 text-xs font-body font-semibold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Includes complimentary cold water or espresso</span>
                  </div>
                </aside>
              </div>
            ) : (
              /* Regular 3-Column Grid for Haircuts, Beard, Kids */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service: Service) => {
                  const isKids = service.category === "Kids";

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

                        {isKids && (
                          <div className="p-3 rounded-[var(--radius-sm)] bg-[#FAF4E6] border border-[#E8DCC4] text-[11px] font-body text-[var(--color-text-secondary)] mb-6">
                            A parent or guardian stays during the appointment.
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[var(--color-border)]">
                        <Link
                          href={`/book?service=${service.id}`}
                          className="inline-flex items-center gap-2 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                          aria-label={`Book ${service.name}`}
                        >
                          <span>Book this service</span>
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
