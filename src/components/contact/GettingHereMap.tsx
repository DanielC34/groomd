import { MapPin, ExternalLink } from "lucide-react";
import { businessInfo } from "@/lib/data/business";
import { Button } from "@/components/ui/Button";

export function GettingHereMap() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(businessInfo.mapSearch)}`;

  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20" aria-labelledby="getting-here-heading">
      <div className="container">
        <header className="max-w-3xl mb-8">
          <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-1">
            LOCATION & TRANSIT
          </span>
          <h2
            id="getting-here-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-3"
          >
            GETTING TO KABULONGA.
          </h2>
          <p className="font-body text-sm sm:text-base text-[var(--color-text-secondary)]">
            We are situated in Kabulonga, a short drive from the Lusaka city centre. Search &quot;Kabulonga, Lusaka&quot; in your maps app or tap below.
          </p>
        </header>

        {/* Map Container */}
        <div className="aspect-[16/9] lg:aspect-[21/9] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[#E8E1D3] relative overflow-hidden flex flex-col justify-between p-6 shadow-xs mb-8">
          {/* Map Graphic Vector Styling */}
          <div className="absolute inset-0 bg-[#EFE9DC] flex items-center justify-center opacity-90">
            <svg className="w-full h-full text-[#DDD4C3]" viewBox="0 0 800 400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 150 Q400 200 800 120" />
              <path d="M0 280 Q350 220 800 320" strokeWidth="4" />
              <path d="M400 0 Q420 200 380 400" strokeWidth="3" />
              <path d="M150 0 L650 400" />
            </svg>
          </div>

          {/* Map Pin Box */}
          <div className="relative z-10 self-center my-auto bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] p-5 rounded-[var(--radius-md)] shadow-xl text-center border border-[var(--color-brand-accent)]/40 max-w-sm">
            <div className="w-9 h-9 rounded-full bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-base uppercase tracking-wider block text-[var(--color-brand-light)] mb-0.5">
              GROOMD KABULONGA
            </span>
            <span className="font-body text-xs text-[var(--color-text-on-strong-secondary)] block">
              {businessInfo.address.full}
            </span>
          </div>

          {/* Map Subtitle Bar */}
          <div className="relative z-10 font-body text-xs text-[var(--color-text-secondary)]">
            <span>Kabulonga Suburb · Lusaka District</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            variant="solid-wine"
            size="lg"
            className="w-full sm:w-auto uppercase tracking-wider font-bold"
            onSurface="light"
            asChild
          >
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <span>Get directions to Groomd in Kabulonga</span>
              <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
