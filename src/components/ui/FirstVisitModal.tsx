"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "groomd-first-visit-dismissed";

/** In-memory fallback so the offer never re-appears in the same visit if storage is blocked. */
let dismissedThisVisit = false;

function isDismissed(): boolean {
  if (dismissedThisVisit) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function recordDismissal() {
  dismissedThisVisit = true;
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* storage unavailable: the in-memory flag still covers this visit */
  }
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    recordDismissal();
    setIsOpen(false);
  }, []);

  // Show once per visitor, a short delay after load.
  useEffect(() => {
    if (isDismissed()) return;
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // While open: focus into the dialog, trap Tab, Escape closes, background inert + scroll locked.
  // On close: focus returns to whatever had focus when the dialog opened.
  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const portalRoot = modalRef.current?.closest("[data-modal-root]");
    const background = Array.from(document.body.children).filter(
      (el) => el !== portalRoot && !el.hasAttribute("inert")
    );
    background.forEach((el) => el.setAttribute("inert", ""));
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const items = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !modalRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !modalRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      background.forEach((el) => el.removeAttribute("inert"));
      document.body.style.overflow = "";
      const target = returnFocusRef.current;
      if (target && target !== document.body && document.contains(target)) {
        target.focus();
      } else {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Portalled to <body> so everything else can be made inert while the dialog is open.
  return createPortal(
    <div
      data-modal-root
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 lg:p-8"
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="relative w-full max-w-[480px] max-h-[calc(100dvh-32px)] overflow-y-auto bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] rounded-[var(--radius-xl)] shadow-[var(--shadow-3)] overflow-hidden transition-all duration-250 ease-[cubic-bezier(.2,.8,.2,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Honey top rule */}
        <div className="h-1 bg-[var(--color-brand-accent)]" aria-hidden="true" />

        {/* Close button */}
        <button
          ref={closeRef}
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-transparent text-[var(--color-brand-light)] flex items-center justify-center hover:bg-[var(--color-brand-secondary)] transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
          aria-label="Close offer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
              NEW TO GROOMD?
            </p>
          </div>

          <h2 id="modal-title" className="font-display font-bold text-2xl md:text-3xl text-[var(--color-text-on-strong)] mb-4 leading-tight">
            <strong className="text-[var(--color-brand-accent)]">15% off</strong> your first visit
          </h2>

          <p id="modal-description" className="font-body text-base md:text-lg text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-6">
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
              <a href="/book" onClick={recordDismissal}>Book your first visit</a>
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
            First visit only. <a href="/terms#first-visit-offer" onClick={recordDismissal} className="underline text-[var(--color-text-on-strong-muted)] hover:text-[var(--color-brand-accent)]">See terms</a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}