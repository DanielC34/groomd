import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface BookingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { number: 1, label: "Service", title: "Service" },
  { number: 2, label: "Barber & time", title: "Barber & time" },
  { number: 3, label: "Your details", title: "Your details" },
  { number: 4, label: "Review & confirm", title: "Review & confirm" },
];

export function BookingStepper({ currentStep, onStepClick }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className="w-full mb-8">
      {/* Mobile view (< 768px) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-body font-semibold text-[var(--color-brand-primary)]">
            Step {currentStep} of 4 · {steps[currentStep - 1]?.title}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {Math.round((currentStep / 4) * 100)}% completed
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-brand-primary)] transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop & Tablet view (>= 768px) */}
      <div className="hidden md:grid md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && onStepClick(step.number)}
              className={clsx(
                "flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] border transition-fast",
                isCurrent && "bg-[var(--color-surface-muted)]/60 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]",
                isCompleted && "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-brand-primary)] cursor-pointer hover:border-[var(--color-brand-secondary)]",
                !isCurrent && !isCompleted && "bg-[var(--color-surface)]/50 border-[var(--color-border)] text-[var(--color-text-muted)] opacity-75"
              )}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 transition-fast",
                  isCurrent && "bg-[var(--color-brand-primary)] text-[var(--color-brand-light)]",
                  isCompleted && "bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]",
                  !isCurrent && !isCompleted && "border border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-body font-semibold uppercase tracking-wider text-[var(--color-text-muted)] leading-tight">
                  STEP {step.number}
                </span>
                <span className={clsx("block text-xs sm:text-sm font-body font-semibold truncate leading-tight", isCurrent ? "text-[var(--color-brand-primary)]" : "text-[var(--color-text-secondary)]")}>
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
