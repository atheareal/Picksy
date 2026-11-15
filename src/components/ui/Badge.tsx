import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "berry"
    | "rose"
    | "subtle"
    | "espresso"
    | "success"
    | "warning"
    | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "subtle",
      size = "sm",
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      berry: "bg-berry/10 text-berry border-berry/20",
      rose: "bg-rose/30 text-espresso border-rose/40",
      subtle: "bg-espresso/5 text-espresso-light border-espresso/10",
      espresso: "bg-espresso text-cream border-espresso",
      success: "bg-emerald-50 text-emerald-800 border-emerald-200",
      warning: "bg-amber-50 text-amber-800 border-amber-200",
      neutral: "bg-white text-espresso border-espresso/15",
    };

    const dotColors = {
      berry: "bg-berry",
      rose: "bg-rose",
      subtle: "bg-espresso-muted",
      espresso: "bg-cream",
      success: "bg-emerald-600",
      warning: "bg-amber-600",
      neutral: "bg-espresso-muted",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[11px] font-medium rounded",
      md: "px-2.5 py-1 text-xs font-medium rounded-md",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 border transition-colors select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
