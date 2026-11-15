import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-espresso"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-2.5 flex items-center justify-center text-espresso-muted">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-8 w-full rounded-md bg-white px-2.5 text-xs text-espresso placeholder:text-espresso-muted/60",
              "border border-espresso/15 transition-colors",
              "hover:border-espresso/30 focus:border-berry focus:outline-none focus:ring-1 focus:ring-berry",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-cream",
              leftIcon && "pl-8",
              rightIcon && "pr-8",
              error && "border-red-400 focus:border-red-500 focus:ring-red-200",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2.5 flex items-center justify-center text-espresso-muted">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-espresso-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
