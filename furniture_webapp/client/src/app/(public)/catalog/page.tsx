import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/publicData";
import type { ProductCategory } from "@/lib/types";
import { CATEGORY_LABELS, PRODUCT_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse chairs, tables, doors, wardrobes, and furniture sets.",
};

const validCategories = new Set<ProductCategory>(PRODUCT_CATEGORIES);

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.category;
  const active: ProductCategory | "all" =
    raw && validCategories.has(raw as ProductCategory)
      ? (raw as ProductCategory)
      : "all";

  const list = await fetchProducts({ category: active });
  const heading =
    active === "all" ? "All furniture" : CATEGORY_LABELS[active];

  return (
    <div className="site-shell py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Catalog
        </p>
        <h1 className="section-heading mt-2">{heading}</h1>
        <p className="mt-4 text-[var(--muted)] leading-relaxed">
          Explore our collection. Filter by category, open a piece for details,
          then inquire when you are ready.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-11" aria-hidden />}>
          <CategoryFilter active={active} />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-[var(--muted)]">
        {list.length} {list.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((product, i) => (
          <ProductCard key={product.slug} product={product} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
