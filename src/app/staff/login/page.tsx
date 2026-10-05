"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormPrimitives";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function StaffLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/staff";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-[var(--color-text-primary)]">
            Staff Login
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] font-body">
            Sign in to access the staff dashboard
          </p>
        </div>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access the staff dashboard
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

              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
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
                Sign in
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Link
              href="/staff/forgot-password"
              className="text-center text-sm font-body font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-text-secondary)] transition-fast"
            >
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}