// FILE: components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-ui-border bg-surface-background px-4 py-2 text-sm text-text-primary placeholder-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
