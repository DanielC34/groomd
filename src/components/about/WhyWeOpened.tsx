export function WhyWeOpened() {
  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-24" aria-labelledby="why-we-opened-heading">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Craft Image Card */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 shadow-xs overflow-hidden">
              <div className="aspect-[4/3] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] relative overflow-hidden flex items-center justify-center mb-3">
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FAF4E6] to-[#EBDDC3]">
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-[var(--color-brand-primary)] bg-[var(--color-surface)] px-3 py-1 rounded-full border border-[var(--color-border)] mb-2">
                    Kabulonga Studio Craft
                  </span>
                  <span className="font-body text-xs text-[var(--color-text-secondary)] text-center">
                    Sanitised tools & tailored grooming setup
                  </span>
                </div>
              </div>
              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed px-2 pb-1">
                Every station is equipped with sanitized professional gear, clean hot towels, and dedicated natural grooming ointments tailored for all hair textures.
              </p>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
              <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
                WHY WE OPENED
              </p>
            </div>

            <h2
              id="why-we-opened-heading"
              className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-6"
            >
              GOOD GROOMING SHOULDN&apos;T FEEL COMPLICATED.
            </h2>

            <div className="space-y-4 font-body text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
              <p>
                You shouldn&apos;t have to overthink a haircut. You should be able to walk in knowing what you&apos;re getting, sit down with a barber who listens, and leave feeling like yourself — just sharper.
              </p>
              <p>
                That&apos;s what Groomd is built around: clear services, straightforward prices and barbers who take the time to get the details right. No chaotic queues, no unexplained upcharges, and no hurried cuts between loud interruptions.
              </p>
              <p>
                We opened in Kabulonga to give gentlemen in Lusaka an unhurried sanctuary where craft, punctuality, and welcoming professionalism come first.
              </p>
            </div>

            <p className="font-body text-xs font-semibold text-[var(--color-text-muted)] italic">
              — Shop 3, Mopani Court, Kabulonga
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
