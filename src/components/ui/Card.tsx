"use client";

import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "supporting" | "booking-summary" | "offer" | "info";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: `
    bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]
    hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-1)]
  `,
  muted: `
    bg-[var(--color-surface-muted)] border-none rounded-[var(--radius-lg)]
  `,
  supporting: `
    bg-[var(--color-background-support)] text-[var(--color-text-on-strong-secondary)] rounded-[var(--radius-lg)]
  `,
  "booking-summary": `
    bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-1)]
    border-t-4 border-t-[var(--color-brand-primary)]
  `,
  offer: `
    bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] rounded-[var(--radius-xl)] shadow-[var(--shadow-3)]
    border-t-4 border-t-[var(--color-brand-accent)]
  `,
  info: `
    bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]
  `,
};

const paddingStyles = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hover = false, padding = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          variantStyles[variant],
          paddingStyles[padding],
          hover && "transition-fast cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h2" | "h3" | "h4";
};

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as = "h3", className, children, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={clsx(
          "font-display font-bold text-[var(--color-text-primary)]",
          as === "h2" ? "text-2xl" : as === "h3" ? "text-xl" : "text-lg",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx("text-[var(--color-text-secondary)] font-body text-sm leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("", className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mt-4 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";