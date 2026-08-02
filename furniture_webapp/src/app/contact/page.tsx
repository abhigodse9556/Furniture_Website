import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Inquire with ${SITE.name} about furniture for your home.`,
};

export default function ContactPage() {
  return (
    <div className="site-shell py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Contact
          </p>
          <h1 className="section-heading mt-2">Inquire about a piece</h1>
          <p className="mt-4 max-w-prose text-[var(--muted)] leading-relaxed">
            Tell us what you are looking for — a catalog piece, custom sizing,
            or a full room set. We will follow up by email or phone.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  className="text-[var(--ink)] hover:text-[var(--accent-deep)]"
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                >
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  className="text-[var(--ink)] hover:text-[var(--accent-deep)]"
                  href={`mailto:${SITE.email}`}
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                Location
              </dt>
              <dd className="mt-1 text-[var(--ink)]">{SITE.address}</dd>
            </div>
          </dl>
        </div>

        <Suspense
          fallback={
            <div
              className="min-h-80 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)]"
              aria-hidden
            />
          }
        >
          <InquiryForm />
        </Suspense>
      </div>
    </div>
  );
}
