import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { businessInfo, addressLines } from "@/lib/data/business";

export function DirectChannels() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(businessInfo.mapSearch)}`;

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20">
      <div className="container">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Studio Address */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast">
            <div>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>

              <h2 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Address
              </h2>

              <address className="not-italic font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                aria-label="Get directions (opens Google Maps in a new tab)"
              >
                <span>Get directions</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>

          {/* Card 2: Phone */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast">
            <div>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Phone className="w-5 h-5" aria-hidden="true" />
              </div>

              <h2 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Phone
              </h2>

              <a
                href={`tel:${businessInfo.phone.tel}`}
                className="font-display font-bold text-xl text-[var(--color-brand-primary)] hover:underline block mb-3"
              >
                {businessInfo.phone.display}
              </a>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Call to cancel or change a booking.
              </p>
            </div>

          </article>

          {/* Card 3: Email */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast">
            <div>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>

              <h2 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Email
              </h2>

              <a
                href={`mailto:${businessInfo.email}`}
                className="font-display font-bold text-base text-[var(--color-brand-primary)] hover:underline block mb-3 break-all"
              >
                {businessInfo.email}
              </a>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                For general questions. For bookings, use online booking.
              </p>
            </div>

          </article>
        </div>
      </div>
    </section>
  );
}
