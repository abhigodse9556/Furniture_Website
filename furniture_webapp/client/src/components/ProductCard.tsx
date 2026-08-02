import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority }: Props) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group product-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-elevated)]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
          priority={priority}
        />
      </div>
      <div className="pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--accent-deep)]">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
