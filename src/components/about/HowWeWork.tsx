import { Clock, Tag, Users } from "lucide-react";

export function HowWeWork() {
  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20 border-t border-[var(--color-border)]/50" aria-labelledby="how-we-work-heading">
      <div className="container">
        <header className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
            <p className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">
              HOW WE WORK
            </p>
          </div>
          <h2
            id="how-we-work-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-3"
          >
            YOUR TIME IN THE CHAIR MATTERS.
          </h2>
          <p className="font-body text-sm sm:text-base text-[var(--color-text-secondary)]">
            We operate on three simple commitments designed around your schedule and your individual standards.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                01 / COMMITMENT
              </span>

              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-2">
                TIME SET ASIDE FOR YOU
              </h3>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Your appointment is your time. We keep the focus on you and the cut you came for. We do not double-book or keep you waiting past your slot.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)] text-[11px] font-body font-semibold text-[var(--color-text-muted)]">
              Dedicated 45-min slots
            </div>
          </article>

          {/* Card 02 */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Tag className="w-5 h-5" aria-hidden="true" />
              </div>

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                02 / COMMITMENT
              </span>

              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-2">
                PRICES YOU CAN SEE
              </h3>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Our services and prices are clear before you book. No surprises, no hidden product markups, and no ambiguous consultations at the till.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)] text-[11px] font-body font-semibold text-[var(--color-text-muted)]">
              Full transparent rate card
            </div>
          </article>

          {/* Card 03 */}
          <article className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>

              <span className="block font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                03 / COMMITMENT
              </span>

              <h3 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-2">
                YOUR BARBER, YOUR CALL
              </h3>

              <p className="font-body text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Tell us what you want. Your barber will work with you to get the finish you&apos;re after, offering seasoned advice without imposing unwanted trends.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)] text-[11px] font-body font-semibold text-[var(--color-text-muted)]">
              Collaborative consultation
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
