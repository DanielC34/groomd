"use client";

import { BookingActionBar } from "./BookingActionBar";
import { clsx } from "clsx";
import { services, serviceCategories } from "@/lib/data/services";
import type { Service, ServiceCategory } from "@/lib/types";
import { Scissors, Sparkles, Package, Smile, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ServiceSelectionProps {
  selectedServiceId?: string;
  onSelectService: (serviceId: string) => void;
  onContinue: () => void;
}

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  Haircuts: <Scissors className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />,
  Beard: <Sparkles className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />,
  Packages: <Package className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />,
  Kids: <Smile className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden="true" />,
};

export function ServiceSelection({
  selectedServiceId,
  onSelectService,
  onContinue,
}: ServiceSelectionProps) {
  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-1">
          Choose a service
        </h2>
        <p className="font-body text-[var(--color-text-secondary)] text-sm sm:text-base">
          One service per appointment. Want a cut and beard? Choose the Cut &amp; Beard package.
        </p>
      </div>

      <div className="space-y-8">
        {serviceCategories.map((catInfo) => {
          const categoryServices = services.filter((s) => s.category === catInfo.category);
          if (categoryServices.length === 0) return null;

          return (
            <div key={catInfo.category} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-body font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)] mb-2">
                {categoryIcons[catInfo.category]}
                <span>{catInfo.label}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryServices.map((service: Service) => {
                  const isSelected = service.id === selectedServiceId;

                  return (
                    <div
                      key={service.id}
                      onClick={() => onSelectService(service.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectService(service.id);
                        }
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      className={clsx(
                        "relative p-5 rounded-[var(--radius-lg)] transition-all cursor-pointer flex flex-col justify-between select-none",
                        isSelected
                          ? "bg-[var(--color-brand-accent)] border-2 border-[var(--color-brand-primary)] shadow-sm"
                          : "bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-brand-secondary)] hover:shadow-[var(--shadow-1)]"
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
                              {service.name}
                            </h3>
                          </div>
                          <div
                            className={clsx(
                              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-fast border",
                              isSelected
                                ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)] border-[var(--color-brand-primary)]"
                                : "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
                            )}
                            aria-hidden="true"
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="font-body text-xs sm:text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50">
                        <div className="flex items-center gap-1.5 text-xs font-body font-medium text-[var(--color-text-secondary)]">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                          <span>{service.durationMinutes} min</span>
                        </div>
                        <span className="font-display font-bold text-lg text-[var(--color-brand-primary)]">
                          K {service.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spacer instead of a wrapper, so the action bar stays sticky within the whole step. */}
      <div className="h-10" aria-hidden="true" />
      <BookingActionBar
        primary={
        <Button
          variant="solid-wine"
          size="lg"
          disabled={!selectedService}
          onClick={onContinue}
          className="w-full sm:w-auto"
        >
          Continue to Barber & Time →
        </Button>
        }
      />
    </div>
  );
}
