"use client";

import { useEffect, useState } from "react";

export function TypewriterRole({ text }: { text: string }) {
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!text) {
      return;
    }

    const speed = isDeleting ? 42 : 88;

    const timeout = window.setTimeout(() => {
      setDisplay((current) => {
        if (!isDeleting) {
          const next = text.slice(0, current.length + 1);

          if (next === text) {
            window.setTimeout(() => setIsDeleting(true), 1100);
          }

          return next;
        }

        const next = text.slice(0, current.length - 1);

        if (!next) {
          setIsDeleting(false);
        }

        return next;
      });
    }, speed);

    return () => window.clearTimeout(timeout);
  }, [display, isDeleting, text]);

  return (
    <span className="inline-flex items-center gap-2 font-display text-2xl font-medium text-[var(--secondary-color)] sm:text-3xl">
      {display}
      <span className="h-7 w-px animate-pulse bg-[var(--secondary-color)]" />
    </span>
  );
}
