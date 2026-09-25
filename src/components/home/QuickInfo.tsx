"use client";

import { MapPin, Clock, Calendar } from "lucide-react";
import { businessInfo } from "@/lib/data/business";
import { getShortHoursString } from "@/lib/data/opening-hours";

const quickInfoItems = [
  {
    icon: MapPin,
    label: "Location",
    value: businessInfo.address.short,
  },
  {
    icon: Clock,
    label: "Hours",
    value: getShortHoursString(),
  },
  {
    icon: Calendar,
    label: "Booking",
    value: "Book online, any time",
  },
] as const;

export function QuickInfo() {
  return (
    <section className="bg-[var(--color-background)] py-12 lg:py-16" aria-labelledby="quick-info-heading">
      <div className="container">
        <h2 id="quick-info-heading" className="visually-hidden">
          Quick information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {quickInfoItems.map((item) => (
            <article
              key={item.label}
              className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-4 lg:p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)]"
            >
              <item.icon className="w-6 h-6 text-[var(--color-brand-accent)] flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-display font-bold text-sm lg:text-base text-[var(--color-text-primary)]">
                  {item.label}
                </h3>
                <p className="font-body text-sm lg:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {item.value}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}