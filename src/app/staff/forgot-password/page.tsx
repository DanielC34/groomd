"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormPrimitives";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to process request. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-background)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-extrabold text-3xl text-[var(--color-text-primary)]">
              Check your email
            </h1>
            <p className="mt-2 text-[var(--color-text-secondary)] font-body">
              If an account exists with that email, a password reset link has been sent.
            </p>
          </div>

          <Card variant="default" padding="lg">
            <CardContent className="text-center">
              <div className="mb-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-success-tint)] border border-[var(--color-success)] text-[var(--color-success)] text-sm font-body">
                If an account exists with that email, a password reset link has been sent.
              </div>
              <p className="text-[var(--color-text-secondary)] font-body text-sm mb-6">
                The link will expire in 1 hour.
              </p>
              <Button
                variant="book"
                size="md"
                fullWidth
                onSurface="strong"
                asChild
              >
                <Link href="/staff/login">Return to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-[var(--color-text-primary)]">
            Forgot password?
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] font-body">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div
                className="mb-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-error-tint)] border border-[var(--color-error)] text-[var(--color-error)] text-sm font-body"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@groomd.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                variant="book"
                size="md"
                fullWidth
                onSurface="strong"
                loading={isLoading}
                className="mt-2"
              >
                Send reset link
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Link
              href="/staff/login"
              className="text-center text-sm font-body font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-text-secondary)] transition-fast"
            >
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}