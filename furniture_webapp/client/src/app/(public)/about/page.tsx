import type { Metadata } from "next";
import Link from "next/link";
import { AdBannerCarousel } from "@/components/AdBannerCarousel";
import { fetchBanners, fetchSite } from "@/lib/publicData";

export async function generateMetadata(): Promise<Metadata> {
  const site = await fetchSite();
  return {
    title: "About",
    description: `Learn about ${site.name} and our approach to handcrafted furniture.`,
  };
}

export default async function AboutPage() {
  const [site, banners] = await Promise.all([fetchSite(), fetchBanners()]);

  return (
    <div className="site-shell py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            About
          </p>
          <h1 className="section-heading mt-2">{site.name}</h1>
          <p lang="mr" className="mt-2 text-lg text-[var(--accent-deep)]">
            {site.nameMr}
          </p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            <p>
              We design and build furniture for homes that are meant to be used —
              dining rooms that gather family, bedrooms that stay calm, and
              entryways that welcome every day.
            </p>
            <p>
              Our work spans chairs, tables, doors, wardrobes, and coordinated
              sets. Whether you choose a ready piece from the catalog or ask for
              a custom fit, the focus stays on solid wood, clean joinery, and
              finishes that age gracefully.
            </p>
            <p>
              Based in {site.address}, we work closely with customers to match
              scale, timber, and style to each room.
            </p>
          </div>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Start a conversation
          </Link>
        </div>

        <AdBannerCarousel banners={banners} priority />
      </div>
    </div>
  );
}
