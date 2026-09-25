"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Slot } from "@radix-ui/react-slot";

export type ButtonVariant = "book" | "solid-wine" | "outline" | "outline-wine" | "text";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  onSurface?: "light" | "strong" | "accent";
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  asChild?: boolean;
}

const baseStyles = `
  inline-flex items-center justify-center gap-2
  font-body font-semibold text-base tracking-wide
  rounded-[var(--radius-sm)]
  transition-fast
  min-h-[44px] min-w-[44px]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:border-dashed
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
`;

const variantStyles = {
  book: {
    light: `
      bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)]
      border-1.5 border-[var(--color-brand-primary)]
      hover:bg-[var(--color-accent-hover)]
      active:bg-[var(--color-accent-pressed)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-light)] focus-visible:ring-offset-[var(--color-brand-accent)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    strong: `
      bg-[var(--color-brand-accent)] text-[var(--color-text-on-accent-primary)]
      hover:bg-[var(--color-accent-hover)]
      active:bg-[var(--color-accent-pressed)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]
    `,
    accent: `
      bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-primary-hover)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]
    `,
  },
  "solid-wine": {
    light: `
      bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-primary-hover)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-light)] focus-visible:ring-offset-[var(--color-brand-accent)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]
    `,
    strong: `
      bg-transparent border-1.5 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-text-on-accent-primary)]
      active:bg-[var(--color-brand-accent)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    accent: `
      bg-[var(--color-brand-primary)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-primary-hover)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]
    `,
  },
  outline: {
    light: `
      bg-transparent border-1.5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-light)] focus-visible:ring-offset-[var(--color-brand-accent)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    strong: `
      bg-transparent border-1.5 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-text-on-accent-primary)]
      active:bg-[var(--color-brand-accent)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    accent: `
      bg-transparent border-1.5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
  },
  text: {
    light: `
      text-[var(--color-brand-primary)] underline-offset-2
      hover:text-[var(--color-text-secondary)]
      active:text-[var(--color-brand-primary)]
      focus-visible:ring-[var(--color-focus-on-light)] focus-visible:ring-offset-[var(--color-brand-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-xs)]
      disabled:text-[var(--color-text-muted)]
    `,
    strong: `
      text-[var(--color-brand-accent)] underline-offset-2
      hover:text-[var(--color-text-on-strong)]
      active:text-[var(--color-brand-accent)]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-xs)]
      disabled:text-[var(--color-text-muted)]
    `,
    accent: `
      text-[var(--color-brand-primary)] underline-offset-2
      hover:text-[var(--color-text-secondary)]
      active:text-[var(--color-brand-primary)]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-xs)]
      disabled:text-[var(--color-text-muted)]
    `,
  },
  "outline-wine": {
    light: `
      bg-transparent border-1.5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-light)] focus-visible:ring-offset-[var(--color-brand-accent)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    strong: `
      bg-transparent border-1.5 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]
      hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-text-on-accent-primary)]
      active:bg-[var(--color-brand-accent)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
    accent: `
      bg-transparent border-1.5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]
      active:bg-[var(--color-brand-primary)] active:scale-[0.98]
      focus-visible:ring-[var(--color-focus-on-strong)] focus-visible:ring-offset-[var(--color-brand-primary)]
      disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-border-strong)]
    `,
  },
};

const sizeStyles = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

const iconSizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

const Comp = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "book",
      size = "md",
      fullWidth = false,
      loading = false,
      onSurface = "light",
      children,
      icon,
      iconPosition = "start",
      className,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const surfaceKey = onSurface as keyof typeof variantStyles.book;
    const combinedClassName = clsx(
      baseStyles,
      variantStyles[variant]?.[surfaceKey] || variantStyles[variant].light,
      sizeStyles[size],
      fullWidth && "w-full",
      icon && "gap-2",
      className
    );

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement | null>}
          className={combinedClassName}
          aria-busy={loading}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className={clsx("animate-spin", iconSizeStyles[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Confirming…</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "start" && <span aria-hidden="true">{icon}</span>}
            {children}
            {icon && iconPosition === "end" && <span aria-hidden="true">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Comp.displayName = "Button";

export const Button = Comp;