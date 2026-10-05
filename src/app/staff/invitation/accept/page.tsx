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

const acceptInvitationSchema = z.object({
  password: z.string().min(12, "Password must be at least 12 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;

export default function InvitationAcceptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invitation token");
    }
  }, [token]);

  const onSubmit = async (data: AcceptInvitationFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/invitation/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to accept invitation. Please try again.");
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
              <CardTitle className="text-xl">Invalid invitation link</CardTitle>
              <CardDescription>
                This invitation link is invalid or missing. Please contact the sender for a new invitation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-[var(--color-text-secondary)] font-body mb-4">
                The invitation link appears to be invalid or missing.
              </p>
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
            Accept your invitation
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] font-body">
            Set up your staff account
          </p>
        </div>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="text-xl">Set up your account</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join Groomd staff. Set your password to get started.
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
                label="Password"
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
                Accept invitation
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <p className="text-center text-sm font-body text-[var(--color-text-muted)]">
              Didn&apos;t expect this invitation? <Link href="/staff/login" className="text-[var(--color-brand-primary)] hover:underline font-body">Sign in instead</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}