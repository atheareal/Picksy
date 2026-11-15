import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-berry disabled:pointer-events-none disabled:opacity-50 select-none";

    const variants = {
      primary:
        "bg-berry text-white hover:bg-berry-hover active:bg-berry-dark shadow-xs",
      secondary:
        "bg-rose/25 text-espresso hover:bg-rose/40 active:bg-rose/50 border border-espresso/10",
      outline:
        "border border-espresso/20 bg-white text-espresso hover:bg-espresso/5 active:bg-espresso/10",
      ghost:
        "text-espresso hover:bg-espresso/5 active:bg-espresso/10",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-9 px-4 text-xs rounded-md gap-2",
      lg: "h-10 px-5 text-sm rounded-md gap-2",
      icon: "h-8 w-8 rounded-md p-0 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
