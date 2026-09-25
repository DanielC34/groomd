import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NeedATimeNotice() {
  return (
    <section className="bg-[var(--color-background)] pb-12">
      <div className="container max-w-3xl">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-brand-primary)] mx-auto mb-4">
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </div>

          <h3 className="font-display font-bold text-xl uppercase tracking-tight text-[var(--color-brand-primary)] mb-2">
            NEED A TIME?
          </h3>

          <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto mb-6">
            The quickest way to find an available chair is to book online.
            <br />
            We don&apos;t take bookings by email.
          </p>

          <Button
            variant="book"
            size="lg"
            className="w-full sm:w-auto font-bold uppercase tracking-wider px-8"
            onSurface="light"
            asChild
          >
            <Link href="/book">Book an appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
