import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "relative fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-card p-6 shadow-lg focus:outline-none border border-ui-border",
        className
      )}
      {...props}
    >
      <DialogClose className="absolute top-2 right-2 rounded-full bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
        <X className="h-6 w-6" />
      </DialogClose>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-xl font-semibold text-text-primary">{children}</div>
);
