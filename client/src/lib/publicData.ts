import { apiFetch } from "@/lib/api";
import type { Banner, Product, ProductCategory, SiteSettings } from "@/lib/types";
import { SITE as FALLBACK_SITE } from "@/lib/site";
import {
  getFeaturedProducts as staticFeatured,
  getProductBySlug as staticBySlug,
  getProductsByCategory as staticByCategory,
  products as staticProducts,
} from "@/data/products";

export async function fetchSite(): Promise<SiteSettings> {
  try {
    return await apiFetch<SiteSettings>("/api/site");
  } catch {
    return { ...FALLBACK_SITE };
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  try {
    return await apiFetch<Banner[]>("/api/banners");
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
  try {
    const params = new URLSearchParams();
    if (options?.category && options.category !== "all") {
      params.set("category", options.category);
    }
    if (options?.featured) params.set("featured", "true");
    const qs = params.toString();
    return await apiFetch<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  } catch {
    if (options?.featured) return staticFeatured();
    return staticByCategory(options?.category);
  }
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/${encodeURIComponent(slug)}`);
  } catch {
    return staticBySlug(slug) ?? null;
  }
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  try {
    const products = await apiFetch<Product[]>("/api/products");
    return products.map((p) => p.slug);
  } catch {
    return staticProducts.map((p) => p.slug);
  }
}
