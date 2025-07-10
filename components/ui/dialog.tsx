// FILE: components/ui/dialog.tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
    <DialogPrimitive.Content
      ref={ref}
      aria-describedby="dialog-description"
      className={cn(
        "fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-card p-6 shadow-lg focus:outline-none border border-ui-border",
        className
      )}
      {...props}
    >
      <div id="dialog-description" className="sr-only">
        This dialog allows you to add or edit announcements.
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

// Menambahkan DialogTitle
export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-2xl font-semibold text-text-primary mb-4">
    {children}
  </div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-xl font-semibold text-text-primary">{children}</div>
);

export const DialogClose = DialogPrimitive.Close;
