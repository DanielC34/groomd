"use client";

import { MapPin } from "lucide-react";
import { businessInfo } from "@/lib/data/business";
import { serviceCategories } from "@/lib/data/services";

export function CategoryNav() {
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-16 z-30 shadow-xs">
      <div className="container py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-body">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="font-bold uppercase tracking-wider text-[var(--color-text-muted)] shrink-0 mr-1">
              JUMP TO:
            </span>
            {serviceCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => scrollToCategory(`category-${cat.category.toLowerCase()}`)}
                className="px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-semibold whitespace-nowrap transition-fast"
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[var(--color-text-muted)] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
            <span>{businessInfo.address.short}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
