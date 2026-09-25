"use client";

import { BookingActionBar } from "./BookingActionBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Messages: CONTENT §9.8.
const CustomerDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .min(2, "Your name needs at least 2 characters."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number.")
    .regex(/^[\d\s+]+$/, "Please enter a valid phone number, e.g. +260 97 123 4567.")
    .min(8, "Please enter a valid phone number, e.g. +260 97 123 4567."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address, e.g. name@example.com."),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
  termsAccepted: z.literal(true, {
    message: "Please agree to the Terms & Conditions to continue.",
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
          Your details
        </h2>
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
            placeholder="e.g. Mutale Zulu"
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 aria-[invalid=true]:border-2 aria-[invalid=true]:border-[var(--color-error)]"
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
            placeholder="+260 97 123 4567"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-hint phone-error" : "phone-hint"}
            {...register("phone")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 aria-[invalid=true]:border-2 aria-[invalid=true]:border-[var(--color-error)]"
          />
          <p id="phone-hint" className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
            We&apos;ll only call if something changes with your booking.
          </p>
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
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
            Email <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-hint email-error" : "email-hint"}
            {...register("email")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 aria-[invalid=true]:border-2 aria-[invalid=true]:border-[var(--color-error)]"
          />
          <p id="email-hint" className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
            In case we need to reach you about this booking. We don&apos;t send marketing.
          </p>
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
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
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? "notes-hint notes-error" : "notes-hint"}
            {...register("notes")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] font-body text-sm text-[var(--color-brand-primary)] placeholder:text-[var(--color-text-muted)] resize-y transition-fast focus:outline-none focus:border-[var(--color-brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 aria-[invalid=true]:border-2 aria-[invalid=true]:border-[var(--color-error)]"
          />
          <p id="notes-hint" className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
            Anything your barber should know, like a style you have in mind or if it&apos;s your first visit.
          </p>
          {errors.notes && (
            <p id="notes-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
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
            {/* CONTENT §9.7: the Terms link sits outside the <label>, so tapping it never ticks the box. Same tab (no target). */}
            <p className="font-body text-sm text-[var(--color-brand-primary)] leading-snug">
              <label htmlFor="termsAccepted">I agree to the</label>{" "}
              <a href="/terms" className="underline font-semibold hover:text-[var(--color-brand-secondary)]">
                Terms &amp; Conditions
              </a>
            </p>
          </div>
          {errors.termsAccepted && (
            <p id="terms-error" role="alert" className="mt-1.5 flex items-center gap-1.5 font-body text-xs text-[var(--color-error)]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* Navigation */}
        <BookingActionBar
          back={
          <Button type="button" variant="outline-wine" size="md" onClick={onBack}>
            Back
          </Button>
          }
          primary={
          <Button
            type="submit"
            variant="solid-wine"
            size="lg"
            loading={isSubmitting}
            className="sm:w-auto"
          >
            Continue
          </Button>
          }
        />
      </form>
    </div>
  );
}