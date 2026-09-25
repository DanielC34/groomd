"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "groomd-first-visit-dismissed";

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  useEffect(() => {
    // Check if user has already dismissed the modal
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    // Show modal after a short delay
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      aria-describedby="modal-description"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-overlay)] transition-opacity duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[480px] bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] rounded-[var(--radius-xl)] shadow-[var(--shadow-3)] overflow-hidden transition-all duration-250 ease-[cubic-bezier(.2,.8,.2,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Honey top rule */}
        <div className="h-1 bg-[var(--color-brand-accent)]" aria-hidden="true" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-brand-light)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
          aria-label="Close offer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
            <p id="modal-heading" className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
              NEW TO GROOMD?
            </p>
          </div>

          <h2 id="modal-description" className="font-display font-bold text-2xl md:text-3xl text-[var(--color-text-on-strong)] mb-4 leading-tight">
            <strong className="text-[var(--color-brand-accent)]">15% off</strong> your first visit
          </h2>

          <p className="font-body text-base md:text-lg text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-6">
            Get 15% off one service. Just mention <strong className="text-[var(--color-brand-accent)]">FIRST15</strong> when you arrive. The discount is applied in-store.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              variant="book"
              size="lg"
              className="w-full sm:w-auto"
              onSurface="strong"
              asChild
            >
              <a href="/book">Book your first visit</a>
            </Button>
            <Button
              variant="text"
              size="md"
              className="w-full sm:w-auto"
              onSurface="strong"
              onClick={handleClose}
            >
              No thanks
            </Button>
          </div>

          <p className="font-body text-xs text-[var(--color-text-on-strong-muted)]">
            First visit only. <a href="/terms#first-visit-offer" className="underline hover:text-[var(--color-brand-accent)]">See terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}