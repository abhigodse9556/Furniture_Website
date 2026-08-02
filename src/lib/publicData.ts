import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import type { Banner, Product, ProductCategory, SiteSettings } from "@/lib/types";
import { SITE as FALLBACK_SITE } from "@/lib/site";
import {
  getFeaturedProducts as staticFeatured,
  getProductBySlug as staticBySlug,
  getProductsByCategory as staticByCategory,
  products as staticProducts,
} from "@/data/products";
import { listBanners } from "@/server/services/bannerStore";
import {
  getProductBySlug,
  listProducts,
} from "@/server/services/productStore";
import { getSiteSettings } from "@/server/services/siteStore";

export async function fetchSite(): Promise<SiteSettings> {
  noStore();
  try {
    return await getSiteSettings();
  } catch {
    return { ...FALLBACK_SITE };
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  noStore();
  try {
    return await listBanners({ activeOnly: true });
  } catch {
    return [
      {
        id: "fallback-1",
        imageUrl: "/images/banners/banner-1.jpeg",
        order: 0,
        active: true,
      },
      {
        id: "fallback-2",
        imageUrl: "/images/banners/banner-2.jpeg",
        order: 1,
        active: true,
      },
    ];
  }
}

export async function fetchProducts(options?: {
  category?: ProductCategory | "all";
  featured?: boolean;
}): Promise<Product[]> {
  noStore();
  try {
    return await listProducts({
      category: options?.category,
      featuredOnly: options?.featured,
    });
  } catch {
    if (options?.featured) return staticFeatured();
    return staticByCategory(options?.category);
  }
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  noStore();
  try {
    return await getProductBySlug(slug);
  } catch {
    return staticBySlug(slug) ?? null;
  }
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  noStore();
  try {
    const products = await listProducts();
    return products.map((p) => p.slug);
  } catch {
    return staticProducts.map((p) => p.slug);
  }
}
