export function WhyWeOpened() {
  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="why-we-opened-heading">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image pending (CONTENT §17). Flat placeholder: no gradient, no caption. */}
          <div className="lg:col-span-5">
            <div
              className="aspect-[4/3] bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--color-border)]"
              aria-hidden="true"
            />
          </div>

          <div className="lg:col-span-7">
            <h2
              id="why-we-opened-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-6"
            >
              Why we opened
            </h2>
            <p className="font-body text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Groomd started from a simple frustration: long waits, unclear prices and cuts rushed to clear the queue. So we built a studio that works the other way. Book a time, know the price, and get a barber who gives your cut the attention it needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
