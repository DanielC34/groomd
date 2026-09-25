"use client";

import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              "block mb-2 text-[var(--color-text-primary)]",
              "font-body font-semibold text-[0.875rem] leading-[1.3]"
            )}
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full h-12 px-4",
            "bg-[var(--color-surface)]",
            "text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
            "border border-[var(--color-border-strong)] rounded-[var(--radius-md)]",
            "font-body text-base leading-[1.4]",
            "transition-fast",
            "hover:border-[var(--color-border-hover)]",
            "focus:outline-none focus:border-2 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-focus-on-light)] focus:ring-offset-2",
            error && "border-2 border-[var(--color-error)] bg-[var(--color-error-tint)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            "disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-[var(--color-error)] font-body font-medium text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-[var(--color-text-muted)] font-body text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              "block mb-2 text-[var(--color-text-primary)]",
              "font-body font-semibold text-[0.875rem] leading-[1.3]"
            )}
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            "w-full min-h-[112px] px-4 py-3",
            "bg-[var(--color-surface)]",
            "text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
            "border border-[var(--color-border-strong)] rounded-[var(--radius-md)]",
            "font-body text-base leading-[1.4] resize-y",
            "transition-fast",
            "hover:border-[var(--color-border-hover)]",
            "focus:outline-none focus:border-2 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-focus-on-light)] focus:ring-offset-2",
            error && "border-2 border-[var(--color-error)] bg-[var(--color-error-tint)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            "disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-[var(--color-error)] font-body font-medium text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-[var(--color-text-muted)] font-body text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, required, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              "block mb-2 text-[var(--color-text-primary)]",
              "font-body font-semibold text-[0.875rem] leading-[1.3]"
            )}
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "w-full h-12 px-4 py-0",
            "bg-[var(--color-surface)]",
            "text-[var(--color-text-primary)]",
            "border border-[var(--color-border-strong)] rounded-[var(--radius-md)]",
            "font-body text-base leading-[1.4] appearance-none",
            "transition-fast",
            "hover:border-[var(--color-border-hover)]",
            "focus:outline-none focus:border-2 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-focus-on-light)] focus:ring-offset-2",
            error && "border-2 border-[var(--color-error)] bg-[var(--color-error-tint)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            "disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-[var(--color-error)] font-body font-medium text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-[var(--color-text-muted)] font-body text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const Label = ({ children, required, className, ...props }: LabelProps) => (
  <label className={clsx("block mb-2 text-[var(--color-text-primary)] font-body font-semibold text-[0.875rem] leading-[1.3]", className)} {...props}>
    {children}
    {required && <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>}
  </label>
);

Label.displayName = "Label";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helperText ? `${checkboxId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={clsx(
                "w-6 h-6",
                "border-2 border-[var(--color-border-strong)] rounded-[var(--radius-xs)]",
                "bg-[var(--color-surface)] text-[var(--color-brand-accent)]",
                "transition-fast",
                "hover:border-[var(--color-border-hover)]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-on-light)] focus:ring-offset-2",
                "checked:bg-[var(--color-brand-primary)] checked:border-[var(--color-brand-primary)]",
                "disabled:bg-[var(--color-surface-muted)] disabled:border-[var(--color-border-strong)] disabled:cursor-not-allowed",
                className
              )}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={describedBy}
              aria-required={required}
              {...props}
            />
          </div>
          <div className="flex-1 min-w-0">
            <label
              htmlFor={checkboxId}
              className={clsx(
                "font-body text-base leading-[1.4] text-[var(--color-text-primary)] cursor-pointer",
                "select-none"
              )}
            >
              {label}
              {required && <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>}
            </label>
            {error && (
              <p id={errorId} role="alert" className="mt-2 flex items-center gap-1.5 text-[var(--color-error)] font-body font-medium text-sm">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="mt-2 text-[var(--color-text-muted)] font-body text-sm">
                {helperText}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";