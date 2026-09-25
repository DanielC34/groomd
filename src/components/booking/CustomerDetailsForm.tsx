"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CustomerDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name (at least 2 characters)")
    .trim(),
  phone: z
    .string()
    .regex(/^[\d\s+]+$/, "Phone must contain only digits, spaces, or +")
    .min(8, "Phone number is too short")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
  termsAccepted: z.literal(true, {
    message: "You must agree to the Terms & Conditions to continue",
  }),
});

export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;

export interface CustomerDetailsFormProps {
  defaultValues?: Partial<CustomerDetails>;
  onContinue: (data: CustomerDetails) => void;
  onBack: () => void;
}

export function CustomerDetailsForm({
  defaultValues,
  onContinue,
  onBack,
}: CustomerDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerDetails>({
    resolver: zodResolver(CustomerDetailsSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      notes: defaultValues?.notes ?? "",
      termsAccepted: defaultValues?.termsAccepted,
    },
  });

  const onSubmit = (data: CustomerDetails) => {
    onContinue(data);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-brand-primary)] mb-1">
          Your Details
        </h2>
        <p className="font-body text-[var(--color-text-secondary)] text-sm sm:text-base">
          Almost there. We just need a few details to complete your booking.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 md:p-6 space-y-5"
      >
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="block font-body font-semibold text-sm text-[var(--color-brand-primary)] mb-1.5"
          >
            Full name <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Mutale Zulu"
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block font-body font-semibold text-sm text-[var(--color-brand-primary)] mb-1.5"
          >
            Mobile number <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+260 97 000 0000"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby="phone-hint"
            {...register("phone")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
          />
          <p id="phone-hint" className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
            We&apos;ll only call if something changes with your booking. No spam or marketing.
          </p>
          {errors.phone && (
            <p role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-body font-semibold text-sm text-[var(--color-brand-primary)] mb-1.5"
          >
            Email address <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby="email-hint"
            {...register("email")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
          />
          <p id="email-hint" className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
            In case we need to reach you about this booking. We don&apos;t send marketing.
          </p>
          {errors.email && (
            <p role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block font-body font-semibold text-sm text-[var(--color-brand-primary)] mb-1.5"
          >
            Notes{" "}
            <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Anything your barber should know, like a style you have in mind or if it&apos;s your first visit."
            aria-describedby="notes-hint"
            {...register("notes")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] resize-y transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
          />
          {errors.notes && (
            <p role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-3">
            <input
              id="termsAccepted"
              type="checkbox"
              aria-required="true"
              aria-invalid={!!errors.termsAccepted}
              aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
              {...register("termsAccepted")}
              className="mt-0.5 w-4 h-4 rounded border-[var(--color-border-strong)] accent-[var(--color-brand-primary)] shrink-0"
            />
            <label htmlFor="termsAccepted" className="font-body text-sm text-[var(--color-brand-primary)] leading-snug">
              I agree to the Groomd{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-[var(--color-brand-secondary)]"
              >
                Terms & Conditions
              </a>{" "}
              and understand that payment is made in-store after my appointment.
            </label>
          </div>
          {errors.termsAccepted && (
            <p id="terms-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* Privacy notice */}
        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
          <Lock className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" aria-hidden="true" />
          <p className="font-body text-xs text-[var(--color-text-secondary)]">
            Your contact details are stored securely solely to manage this appointment and are never shared or sold.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Button type="button" variant="outline-wine" size="md" onClick={onBack}>
            ← Back to Barber & Time
          </Button>
          <Button
            type="submit"
            variant="solid-wine"
            size="lg"
            loading={isSubmitting}
            className="sm:w-auto"
          >
            Continue to Review & Confirm →
          </Button>
        </div>
      </form>
    </div>
  );
}