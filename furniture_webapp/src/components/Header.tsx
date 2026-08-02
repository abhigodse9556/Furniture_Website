"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);

  if (navPath !== pathname) {
    setNavPath(pathname);
    if (open) setOpen(false);
  }

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-md">
        <div className="site-shell flex h-[4.25rem] items-center justify-between gap-4 md:h-20">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Image
              src="/logo/logo-with-name-rectangle.png"
              alt={SITE.name}
              width={2172}
              height={724}
              className="h-12 w-auto max-w-[min(100%,18rem)] object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-14 sm:max-w-[22rem] md:h-16 md:max-w-[26rem]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-[var(--accent-deep)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-primary ml-2">
              Inquire
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--ink)] transition-colors hover:bg-[var(--surface)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Outside the blurred header so fixed positioning covers the viewport */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] backdrop-blur-md transition-[visibility,opacity] duration-300 md:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={closeMenu}
      >
        <div className="h-[4.25rem] md:h-20" aria-hidden />
        <nav
          className="site-shell flex flex-col gap-2 pb-8 pt-4"
          aria-label="Mobile"
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((link, i) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-sm px-4 py-3.5 text-lg font-semibold shadow-sm transition-all duration-300 ${
                  active
                    ? "bg-[var(--ink)] text-[var(--surface-elevated)]"
                    : "bg-[color-mix(in_srgb,var(--surface-elevated)_92%,transparent)] text-[var(--ink)] ring-1 ring-[var(--border)]"
                } ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={closeMenu}
            className="btn-primary mt-4 w-full text-center"
          >
            Inquire about a piece
          </Link>
        </nav>
      </div>
    </>
  );
}
