export function AboutStatementBand() {
  return (
    <section
      className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24 border-t border-b border-[var(--color-brand-secondary)]"
      aria-labelledby="statement-heading"
    >
      <div className="container text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)] inline-block" aria-hidden="true" />
          <p className="eyebrow text-[var(--color-brand-accent)] tracking-[0.16em]">
            OUR APPROACH
          </p>
        </div>

        <h2
          id="statement-heading"
          className="font-display font-extrabold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-[var(--color-brand-light)] mb-4"
        >
          TAKE THE TIME TO GET IT RIGHT.
        </h2>

        <p className="font-body text-base lg:text-xl text-[var(--color-text-on-strong-secondary)] mb-6">
          Every cut, every client.
        </p>

        <div className="w-12 h-0.5 bg-[var(--color-brand-accent)] mx-auto mb-4 opacity-80" />

        <p className="font-body text-xs font-semibold text-[var(--color-text-on-strong-muted)] uppercase tracking-widest">
          — The Groomd team
        </p>
      </div>
    </section>
  );
}
