import { Repeat, Sparkles, MessageSquare } from "lucide-react";

// CONTENT §12: "How we work" split + "What we stand for" values row.
const values = [
  { icon: Repeat, title: "Consistency", line: "The same care on your tenth visit as your first." },
  { icon: Sparkles, title: "Clean and tidy", line: "Sanitised tools and a fresh setup for every client." },
  { icon: MessageSquare, title: "Straight talk", line: "Honest advice on what will suit you, even if it's a smaller job." },
] as const;

export function HowWeWork() {
  return (
    <section className="bg-[var(--color-background)] py-16 lg:py-20 border-t border-[var(--color-border)]/50" aria-labelledby="how-we-work-heading">
      <div className="container">
        <header className="max-w-3xl mb-12">
          <h2
            id="how-we-work-heading"
            className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-3"
          >
            How we work
          </h2>
          <p className="font-body text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            A short menu. Proper consultations. Clean tools for every client. Appointments booked for the full length of your service. It&apos;s not complicated, just done consistently, every time.
          </p>
        </header>

        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] inline-block" aria-hidden="true" />
          <h3 className="eyebrow text-[var(--color-brand-primary)] tracking-[0.16em]">WHAT WE STAND FOR</h3>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <li
              key={v.title}
              className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                <v.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="font-display font-bold text-base text-[var(--color-brand-primary)] mb-2">{v.title}</h4>
              <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed">{v.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
