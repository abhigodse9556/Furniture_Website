import Link from "next/link";
import { SITE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function Footer({ site = SITE }: { site?: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--ink)] text-[var(--surface)]">
      <div className="site-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            {site.name}
          </p>
          <p lang="mr" className="mt-1 text-sm text-white/70">
            {site.nameMr}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            {site.tagline}. Custom pieces and ready collections crafted with care.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="footer-link" href="/catalog">
                Catalog
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
            Visit
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>{site.address}</li>
            <li>
              <a
                className="footer-link"
                href={`tel:${site.phone.replace(/\s/g, "")}`}
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a className="footer-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="site-shell py-4 text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
