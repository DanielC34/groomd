import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { businessInfo } from "@/lib/data/business";

export function DirectChannels() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(businessInfo.mapSearch)}`;

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20" aria-labelledby="direct-channels-heading">
      <div className="container">
        <header className="mb-12">
          <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1">
            DIRECT CHANNELS
          </span>
          <h2
            id="direct-channels-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)]"
          >
            VISIT GROOMD
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Studio Address */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast">
            <div>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                LOCATION
              </span>

              <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Studio Address
              </h3>

              <address className="not-italic font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                <p>Shop 3, Mopani Court</p>
                <p>Kabulonga</p>
                <p>Lusaka, Zambia</p>
              </address>

              <p className="font-body text-[11px] text-[var(--color-text-muted)] mb-6">
                Kabulonga, Lusaka · East of city centre
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                aria-label="Get directions to Groomd Kabulonga in Google Maps"
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

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                DIRECT VOICE
              </span>

              <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Phone
              </h3>

              <a
                href={`tel:${businessInfo.phone.tel}`}
                className="font-display font-bold text-xl text-[var(--color-brand-primary)] hover:underline block mb-3"
              >
                {businessInfo.phone.display}
              </a>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Call to cancel or change a booking (ideally 2 hours before).
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <a
                href={`tel:${businessInfo.phone.tel}`}
                className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                aria-label={`Call Groomd front desk at ${businessInfo.phone.display}`}
              >
                <span>Call front desk</span>
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>

          {/* Card 3: Email */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs hover:border-[var(--color-brand-secondary)] transition-fast">
            <div>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                GENERAL ENQUIRIES
              </span>

              <h3 className="font-display font-bold text-lg text-[var(--color-brand-primary)] mb-2">
                Email
              </h3>

              <a
                href={`mailto:${businessInfo.email}`}
                className="font-display font-bold text-base text-[var(--color-brand-primary)] hover:underline block mb-3 break-all"
              >
                {businessInfo.email}
              </a>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                For general questions. For appointments, book online.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <a
                href={`mailto:${businessInfo.email}`}
                className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                aria-label={`Send email to ${businessInfo.email}`}
              >
                <span>Send message</span>
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
