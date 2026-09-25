"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

const footerNavigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book an appointment" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram (opens instagram.com)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook (opens facebook.com)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Footer({ omitInvitationBand = false }: { omitInvitationBand?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)]" role="contentinfo">
      {!omitInvitationBand && (
        <section className="bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)]" aria-labelledby="invitation-heading">
          <div className="container">
            <div className={clsx(
              "py-12 lg:py-16",
              "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-left"
            )}>
              <div>
                <h2 id="invitation-heading" className="font-display font-bold text-2xl lg:text-3xl mb-3">
                  Ready for a fresh cut?
                </h2>
                <p className="font-body text-base lg:text-lg max-w-md mx-auto lg:mx-0">
                  Choose your service, barber and a time that suits you.
                </p>
              </div>
              <Button
                variant="solid-wine"
                size="lg"
                fullWidth={false}
                className="w-full lg:w-auto mt-6 lg:mt-0"
                onSurface="accent"
                asChild
              >
                <Link href="/book">Book Now</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-16 lg:pt-24 pb-12 lg:pb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Groomd — Home">
              <span className="font-display font-extrabold uppercase tracking-[0.04em] text-[var(--color-brand-light)] text-2xl">
                GROOMD
                <span className="text-[var(--color-brand-accent)]" aria-hidden="true">.</span>
              </span>
              <span className="font-display font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-light)] text-xs">
                MEN&apos;S GROOMING STUDIO
              </span>
            </Link>
            <p className="text-[var(--color-text-on-strong-secondary)] font-body text-sm leading-relaxed mb-6">
              A modern barbershop in Kabulonga, Lusaka.
            </p>
            <div className="flex items-center gap-4" role="list" aria-label="Social">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "flex-center w-10 h-10 rounded-full border-1.5 border-[var(--color-brand-accent)]",
                    "text-[var(--color-brand-light)] hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-text-on-accent-primary)]",
                    "transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand-primary)]"
                  )}
                  aria-label={social.label}
                  role="listitem"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-1" aria-labelledby="explore-heading">
            <h3 id="explore-heading" className="eyebrow text-[var(--color-brand-accent)] mb-4">Explore</h3>
            <ul className="space-y-3" role="list">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "font-body text-base text-[var(--color-text-on-strong-secondary)]",
                      "hover:text-[var(--color-brand-accent)] hover:underline transition-fast"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-1" aria-labelledby="visit-heading">
            <h3 id="visit-heading" className="eyebrow text-[var(--color-brand-accent)] mb-4">Visit</h3>
            <address className="not-italic font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[var(--color-brand-accent)] mt-0.5" aria-hidden="true" />
                <div>
                  <p>Shop 3, Mopani Court</p>
                  <p>Kabulonga</p>
                  <p>Lusaka, Zambia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-[var(--color-brand-accent)]" aria-hidden="true" />
                <a href="tel:+260970000000" className="hover:text-[var(--color-brand-accent)] hover:underline transition-fast">
                  +260 97 000 0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[var(--color-brand-accent)]" aria-hidden="true" />
                <a href="mailto:hello@groomd.example" className="hover:text-[var(--color-brand-accent)] hover:underline transition-fast">
                  hello@groomd.example
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onSurface="strong"
                asChild
                className="mt-2"
              >
                <Link href="/contact">Get directions</Link>
              </Button>
            </address>
          </div>

          <div className="lg:col-span-1" aria-labelledby="hours-heading">
            <h3 id="hours-heading" className="eyebrow text-[var(--color-brand-accent)] mb-4">Opening hours</h3>
            <table className="w-full font-body text-sm text-[var(--color-text-on-strong-secondary)]" role="table">
              <tbody>
                <tr>
                  <td className="text-left py-1">Monday–Friday</td>
                  <td className="text-right py-1 font-medium text-[var(--color-text-on-strong)]">09:00–18:00</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Saturday</td>
                  <td className="text-right py-1 font-medium text-[var(--color-text-on-strong)]">08:00–16:00</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Sunday</td>
                  <td className="text-right py-1 text-[var(--color-text-on-strong-muted)]">Closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-[var(--color-brand-secondary)] pt-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <p className="text-[var(--color-text-on-strong-muted)] font-body text-sm">
              © {currentYear} Groomd. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center gap-4" aria-labelledby="legal-heading">
              <h3 id="legal-heading" className="visually-hidden">Legal</h3>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "font-body text-sm text-[var(--color-text-on-strong-secondary)]",
                    "hover:text-[var(--color-brand-accent)] hover:underline transition-fast"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}