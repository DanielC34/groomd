"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useLusakaWeekday } from "@/lib/hooks/use-lusaka-weekday";
import { businessInfo } from "@/lib/data/business";
import { getTodayLine } from "@/lib/data/opening-hours";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  // Read after hydration only, so the server HTML and first client render agree.
  const today = useLusakaWeekday();
  const todayLine = today ? getTodayLine(today) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const isBookPage = pathname === "/book";

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50",
          "bg-[var(--color-brand-primary)]",
          "transition-fast",
          scrolled && !isBookPage && "shadow-[var(--shadow-1)]",
          isBookPage && "bg-[var(--color-brand-primary)]/95 backdrop-blur-sm"
        )}
        style={{
          height: isBookPage ? "var(--space-12)" : "var(--space-16)",
          minHeight: isBookPage ? "64px" : "72px",
        }}
        role="banner"
      >
        <div className="container flex items-center justify-between" style={{ height: "100%" }}>
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2"
            aria-label="Groomd — Home"
          >
            <span className="font-display font-extrabold uppercase tracking-[0.04em] text-[var(--color-brand-light)]" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
              GROOMD
              <span className="text-[var(--color-brand-accent)]" aria-hidden="true">.</span>
            </span>
            <span className="hidden lg:block font-display font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-light)]" style={{ fontSize: "clamp(0.5rem, 1vw, 0.625rem)" }}>
              MEN&apos;S GROOMING STUDIO
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation" style={{ marginRight: "var(--space-6)" }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "font-body font-medium text-base tracking-[0.01em] transition-fast",
                    "relative py-2 no-underline",
                    isActive
                      ? "text-[var(--color-brand-accent)] font-semibold"
                      : "text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* One Book Now at every width. (Two responsive copies relied on `hidden` beating the
                Button's own `inline-flex`, which is cascade-order dependent and showed both at 360px.) */}
            <Button variant="book" size="sm" onSurface="strong" asChild>
              <Link href="/book">Book Now</Link>
            </Button>

            <button
              ref={menuButtonRef}
              className="lg:hidden p-2 rounded-[var(--radius-full)] text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)] transition-fast"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[var(--color-overlay)] lg:hidden"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          <aside
            id="mobile-menu"
            className="fixed top-0 right-0 z-50 w-full max-w-[400px] h-full bg-[var(--color-brand-primary)] shadow-[var(--shadow-3)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label="Groomd — Home"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-display font-extrabold uppercase tracking-[0.04em] text-[var(--color-brand-light)]" style={{ fontSize: "1.25rem" }}>
                    GROOMD
                    <span className="text-[var(--color-brand-accent)]" aria-hidden="true">.</span>
                  </span>
                  <span className="font-display font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-light)] text-xs">
MEN&apos;S GROOMING STUDIO
                  </span>
                </Link>
                <button
                  ref={closeButtonRef}
                  className="p-2 rounded-[var(--radius-full)] text-[var(--color-brand-light)] hover:text-[var(--color-brand-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)] transition-fast"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4" aria-label="Main menu">
                <ul className="space-y-1" role="list">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={clsx(
                            "flex items-center gap-3 h-14 px-2 rounded-[var(--radius-md)] no-underline",
                            "font-display font-bold text-[1.5rem] leading-tight transition-fast",
                            isActive
                              ? "text-[var(--color-brand-accent)] bg-[var(--color-background-support)]"
                              : "text-[var(--color-text-on-strong)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-background-support)]"
                          )}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)] flex-shrink-0" aria-hidden="true" />}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 pt-6 border-t border-[var(--color-brand-secondary)]">
                  <Button
                    variant="book"
                    size="md"
                    fullWidth
                    onSurface="strong"
                    asChild
                    className="mb-4"
                  >
                    <Link href="/book" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
                  </Button>

                  <div className="space-y-3 text-[var(--color-text-on-strong-muted)] font-body text-sm">
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${businessInfo.phone.tel}`} className="hover:text-[var(--color-brand-accent)] transition-fast">{businessInfo.phone.display}</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {todayLine && <span>{todayLine}</span>}
                    </p>
                  </div>
                </div>
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}