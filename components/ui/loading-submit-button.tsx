"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoadingSubmitButton({
  idleLabel,
  pendingLabel,
  className,
  disabled,
  variant = "primary",
  size = "lg",
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={cn(buttonStyles({ variant, size }), className)}
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </button>
  );
}
