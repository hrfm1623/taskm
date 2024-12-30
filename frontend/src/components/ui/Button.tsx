import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            "btn",
            {
              "btn-primary": variant === "primary",
              "btn-secondary": variant === "secondary",
              "btn-ghost": variant === "ghost",
              "btn-error": variant === "danger",
              "btn-sm": size === "sm",
              "btn-md": size === "md",
              "btn-lg": size === "lg",
              "btn-disabled": disabled,
            },
            className
          )
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
