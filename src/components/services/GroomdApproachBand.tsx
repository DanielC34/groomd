export function GroomdApproachBand() {
  return (
    <section
      className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24 border-t border-b border-[var(--color-brand-secondary)]"
      aria-labelledby="approach-heading"
    >
      <div className="container">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
              THE GROOMD APPROACH
            </p>
          </div>

          <h2
            id="approach-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-4"
          >
            TAKE THE TIME TO GET IT RIGHT.
          </h2>

          <p className="font-body text-base lg:text-lg text-[var(--color-text-on-strong-secondary)] leading-relaxed">
            Good grooming is in the details. We keep the experience straightforward, give you time in the chair, and focus on leaving you with a cut you actually want to wear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[var(--color-brand-secondary)]/60">
          {/* Column 01 */}
          <div className="space-y-3">
            <span className="font-display font-extrabold text-4xl lg:text-5xl text-[var(--color-brand-accent)] block">
              01
            </span>
            <h3 className="font-display font-bold text-lg text-[var(--color-brand-light)]">
              One chair at a time
            </h3>
            <p className="font-body text-xs lg:text-sm text-[var(--color-text-on-strong-secondary)] leading-relaxed">
              Never rushing your service. We reserve adequate buffers between appointments so you never feel hurried out the door.
            </p>
          </div>

          {/* Column 02 */}
          <div className="space-y-3">
            <span className="font-display font-extrabold text-4xl lg:text-5xl text-[var(--color-brand-accent)] block">
              02
            </span>
            <h3 className="font-display font-bold text-lg text-[var(--color-brand-light)]">
              Prices you see
            </h3>
            <p className="font-body text-xs lg:text-sm text-[var(--color-text-on-strong-secondary)] leading-relaxed">
              No surprise add-ons at checkout. Every price quoted in ZMW is all-inclusive and clearly confirmed before we start.
            </p>
          </div>

          {/* Column 03 */}
          <div className="space-y-3">
            <span className="font-display font-extrabold text-4xl lg:text-5xl text-[var(--color-brand-accent)] block">
              03
            </span>
            <h3 className="font-display font-bold text-lg text-[var(--color-brand-light)]">
              Sanitised stations
            </h3>
            <p className="font-body text-xs lg:text-sm text-[var(--color-text-on-strong-secondary)] leading-relaxed">
              Hospital-grade disinfection, clean blades, and fresh hot towels individually prepared for every single client.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
