import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { CATEGORY_LABELS } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="site-shell py-12 sm:py-16">
      <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/catalog" className="hover:text-[var(--ink)]">
              Catalog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/catalog?category=${product.category}`}
              className="hover:text-[var(--ink)]"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-[var(--ink)]">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--surface-elevated)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8 sm:p-12"
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="section-heading mt-2">{product.name}</h1>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {product.description}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
            Dimensions, finishes, and custom options can be confirmed when you
            inquire. We are happy to match wood tones and sizes to your space.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?product=${product.slug}`}
              className="btn-primary"
            >
              Inquire about this piece
            </Link>
            <Link href="/catalog" className="btn-secondary">
              Back to catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
