"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BANNERS = [
  {
    src: "/images/banners/banner-1.jpeg",
    alt: "Guruprasad Furniture advertisement",
  },
  {
    src: "/images/banners/banner-2.jpeg",
    alt: "Guruprasad Furniture advertisement",
  },
] as const;

const INTERVAL_MS = 3000;

type Props = {
  className?: string;
  priority?: boolean;
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M9.5 6.5 15 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdBannerCarousel({ className = "", priority = false }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || BANNERS.length < 2) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    // Restart a full INTERVAL_MS for every slide so the loop never stops
    // (e.g. 1 → 2 → 1 → …, or more images in sequence).
    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % BANNERS.length);
    }, INTERVAL_MS);

    return () => window.clearTimeout(id);
  }, [paused, index]);

  function goTo(next: number) {
    setIndex((next + BANNERS.length) % BANNERS.length);
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-md ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {/* Fixed 2:3 frame matches banner files (1024×1536) — object-contain keeps full ad visible */}
      <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-[var(--surface-elevated)] ring-1 ring-[var(--border)]">
        {BANNERS.map((banner, i) => (
          <div
            key={banner.src}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-contain"
              priority={priority && i === 0}
            />
          </div>
        ))}

        <button
          type="button"
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--surface-elevated)_78%,transparent)] text-[var(--ink)] shadow-[0_6px_20px_rgba(26,22,18,0.12)] backdrop-blur-sm transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:shadow-[0_8px_24px_rgba(26,22,18,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          aria-label="Previous advertisement"
          onClick={() => goTo(index - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--surface-elevated)_78%,transparent)] text-[var(--ink)] shadow-[0_6px_20px_rgba(26,22,18,0.12)] backdrop-blur-sm transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:shadow-[0_8px_24px_rgba(26,22,18,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          aria-label="Next advertisement"
          onClick={() => goTo(index + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Advertisement slides"
        >
          {BANNERS.map((banner, i) => (
            <button
              key={banner.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show advertisement ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                i === index
                  ? "w-5 bg-[var(--ink)]"
                  : "w-1.5 bg-[color-mix(in_srgb,var(--ink)_28%,transparent)] hover:bg-[color-mix(in_srgb,var(--ink)_50%,transparent)]"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Advertisement {index + 1} of {BANNERS.length}
      </p>
    </div>
  );
}
