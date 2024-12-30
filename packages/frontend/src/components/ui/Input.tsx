import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={id} className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={twMerge(
            clsx("input input-bordered w-full", {
              "input-error": error,
            }),
            className
          )}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
