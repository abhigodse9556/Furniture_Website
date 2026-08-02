import Image from "next/image";
import Link from "next/link";
import { AdBannerCarousel } from "@/components/AdBannerCarousel";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import {
  fetchBanners,
  fetchProducts,
  fetchSite,
} from "@/lib/publicData";
import { CATEGORY_LABELS, PRODUCT_CATEGORIES } from "@/lib/types";

const categoryImages: Record<string, string> = {
  chairs:
    "/images/chair/png-transparent-dining-room-chair-mission-style-furniture-chair-angle-kitchen-furniture-thumbnail.png",
  tables:
    "/images/table/png-transparent-table-teak-furniture-chair-garden-furniture-dining-table-angle-furniture-coffee-tables-thumbnail.png",
  doors:
    "/images/door/png-transparent-closed-browd-wooden-door-door-wood-furniture-table-door-angle-service-open-door-thumbnail.png",
  wardrobes:
    "/images/wardrobes/png-transparent-armoires-wardrobes-closet-drawer-door-furniture-closet-angle-mattress-furniture-thumbnail.png",
  generic:
    "/images/generic/png-transparent-brown-wooden-bedroom-furniture-set-art-bedside-tables-metal-furniture-couch-furniture-angle-furniture-drawer-thumbnail.png",
};

export default async function HomePage() {
  const [site, banners, featured] = await Promise.all([
    fetchSite(),
    fetchBanners(),
    fetchProducts({ featured: true }),
  ]);
  const featuredSlice = featured.slice(0, 4);

  return (
    <>
      <Hero site={site} />

      <section className="site-shell py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Collections
            </p>
            <h2 className="section-heading mt-2">Shop by category</h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-[var(--accent-deep)] hover:underline"
          >
            View full catalog
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/catalog?category=${category}`}
              className="group relative overflow-hidden rounded-sm bg-[var(--surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <div className="relative aspect-[5/4]">
                <Image
                  src={categoryImages[category]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-[var(--border)] px-4 py-3">
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                  {CATEGORY_LABELS[category]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-elevated)_70%,transparent)]">
        <div className="site-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Our craft
            </p>
            <h2 className="section-heading mt-2">
              Furniture made to be lived with
            </h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              At {site.name}, every piece starts with solid timber and careful
              joinery. From dining tables to wardrobes, we build furniture that
              feels grounded in the home — practical, warm, and lasting.
            </p>
            <Link href="/about" className="btn-secondary mt-8 inline-flex">
              About the shop
            </Link>
          </div>
          <AdBannerCarousel banners={banners} priority />
        </div>
      </section>

      <section className="site-shell py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Featured
            </p>
            <h2 className="section-heading mt-2">Pieces worth a closer look</h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-[var(--accent-deep)] hover:underline"
          >
            See all pieces
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSlice.map((product, i) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={i < 2}
            />
          ))}
        </div>
      </section>
    </>
  );
}
