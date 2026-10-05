"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormPrimitives";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

const resetPasswordSchema = z.object({
  password: z.string().min(12, "Password must be at least 12 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to reset password. Please try again.");
        return;
      }

      router.push("/staff");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-background)]">
        <div className="w-full max-w-md">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="text-xl">Invalid reset link</CardTitle>
              <CardDescription>
                This password reset link is invalid or missing. Please request a new password reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/staff/forgot-password" className="text-[var(--color-brand-primary)] hover:underline font-body">
                Request a new password reset link
              </Link>
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
            Reset your password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] font-body">
            Enter your new password below
          </p>
        </div>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="text-xl">New password</CardTitle>
            <CardDescription>
              Your new password must be at least 12 characters
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
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
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
                Reset password
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