// components/ui/FloatingInput.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /**
   * Optional: additional classes for the label
   */
  labelClassName?: string;
  /**
   * When true → full rounded border (like outlined input)
   * When false → only bottom border (like underline / minimal style)
   */
  isLabelBorder?: boolean;
  error?: string;
  /**
   * Optional: control input height (default 56px / h-14)
   */
  inputHeight?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      label,
      labelClassName,
      isLabelBorder = true,
      error,
      type = "text",
      inputHeight = "h-14",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    // Update hasValue when controlled or uncontrolled value changes
    React.useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(!!props.value);
      }
    }, [props.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    const isActive = isFocused || hasValue;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          className={cn(
            // Core layout – centered text vertically
            "peer w-full bg-transparent outline-none transition-all duration-200",
            inputHeight,
            "px-4 text-base leading-none",
            "py-0",

            // Border styles
            isLabelBorder
              ? cn(
                  "rounded-lg border border-input",
                  "focus:border-primary focus:ring-4 focus:ring-primary/10"
                )
              : cn(
                  "border-b-2 border-x-0 border-t-0 border-input",
                  "focus:border-primary"
                ),

            // Error states override
            error &&
              (isLabelBorder
                ? "border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/10"
                : "border-destructive focus:border-destructive"),

            // Disabled state
            "disabled:pointer-events-none disabled:opacity-50",

            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          aria-invalid={!!error}
          {...props}
        />

        {/* Floating Label */}
        <label
          className={cn(
            "absolute left-4 pointer-events-none transition-all duration-200 ease-out",
            "text-muted-foreground select-none",

            // Inactive (placeholder-like) state
            !isActive && cn("top-1/2 -translate-y-1/2 text-base"),

            // Active (floating) state
            isActive &&
              (isLabelBorder
                ? cn(
                    "top-0 -translate-y-1/2 text-xs font-medium px-1.5 bg-background",
                    isLabelBorder && "peer-focus:text-primary"
                  )
                : cn("top-2 text-xs font-medium")),

            // Color overrides (only apply if no error)
            isFocused && !error && "text-primary",
            error && "text-destructive",
            
            // Allow custom label classes to override default colors when inactive
            !isActive && !error && labelClassName
          )}
        >
          {label}
        </label>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-xs text-destructive leading-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };