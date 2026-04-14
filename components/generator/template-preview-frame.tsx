"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_PREVIEW_WIDTH = 1440;

export function TemplatePreviewFrame({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [frameHeight, setFrameHeight] = useState(1200);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const element = surfaceRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const nextScale = width / DESKTOP_PREVIEW_WIDTH;

      setScale(nextScale);
      setFrameHeight(height / nextScale);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={surfaceRef} className="template-card__preview-surface">
      <iframe
        title={title}
        src={src}
        className="template-card__iframe"
        loading="lazy"
        style={{
          width: `${DESKTOP_PREVIEW_WIDTH}px`,
          height: `${frameHeight}px`,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
