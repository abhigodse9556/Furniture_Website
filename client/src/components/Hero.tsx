import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function Hero({ site }: { site: SiteSettings }) {
  return (
    <section className="relative isolate min-h-[min(92vh,880px)] overflow-hidden">
      <Image
        src="/images/generic/home.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover animate-hero-zoom"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(22,18,14,0.82)] via-[rgba(22,18,14,0.55)] to-[rgba(22,18,14,0.25)]"
        aria-hidden
      />
      <div className="site-shell relative flex min-h-[min(92vh,880px)] flex-col justify-end pb-16 pt-28 sm:justify-center sm:pb-24 sm:pt-20">
        <div className="max-w-xl animate-rise">
          <p
            lang="mr"
            className="mb-3 font-[family-name:var(--font-display)] text-base text-[var(--oak-light)] sm:text-lg"
          >
            {site.nameMr}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.05] tracking-tight text-white">
            {site.name}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {site.tagline}. Browse our collection of chairs, tables, doors, and
            wardrobes — then inquire about the piece that fits your home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/catalog" className="btn-primary">
              Browse catalog
            </Link>
            <Link href="/contact" className="btn-ghost-light">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
