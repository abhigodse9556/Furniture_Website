"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductCategory } from "@/lib/types";
import { CATEGORY_LABELS, PRODUCT_CATEGORIES } from "@/lib/types";

type Props = {
  active: ProductCategory | "all";
};

export function CategoryFilter({ active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = PRODUCT_CATEGORIES;

  function select(next: ProductCategory | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete("category");
    else params.set("category", next);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  }

  const items: Array<{ id: ProductCategory | "all"; label: string }> = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin"
      role="tablist"
      aria-label="Filter by category"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(item.id)}
            className={`shrink-0 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-[var(--ink)] text-[var(--surface)]"
                : "bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
      {/* Fallback links for no-JS / crawlability */}
      <span className="sr-only">
        {items.map((item) => (
          <Link
            key={`link-${item.id}`}
            href={
              item.id === "all" ? "/catalog" : `/catalog?category=${item.id}`
            }
          >
            {item.label}
          </Link>
        ))}
      </span>
    </div>
  );
}
