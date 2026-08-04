import "server-only";

import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/types";
import { getDb } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const collection = () => getDb().collection("products");

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseRate(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    slug: String(data.slug ?? ""),
    name: String(data.name ?? ""),
    category: data.category as ProductCategory,
    description: String(data.description ?? ""),
    imageUrl: String(data.imageUrl ?? data.image ?? ""),
    rate: parseRate(data.rate),
    featured: Boolean(data.featured ?? false),
    createdAt: data.createdAt as string | undefined,
    updatedAt: data.updatedAt as string | undefined,
  };
}

function assertCategory(category: string): ProductCategory {
  if (!PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
    throw new HttpError(400, `Invalid category: ${category}`);
  }
  return category as ProductCategory;
}

export async function listProducts(options?: {
  category?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  const snap = await collection().orderBy("name", "asc").get();
  let items = snap.docs.map((doc) =>
    mapProduct(doc.id, doc.data() as Record<string, unknown>),
  );

  if (options?.category && options.category !== "all") {
    const category = assertCategory(options.category);
    items = items.filter((p) => p.category === category);
  }
  if (options?.featuredOnly) {
    items = items.filter((p) => p.featured);
  }
  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snap = await collection().where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapProduct(doc.id, doc.data() as Record<string, unknown>);
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await collection().doc(id).get();
  if (!snap.exists) return null;
  return mapProduct(id, snap.data() as Record<string, unknown>);
}

async function assertUniqueSlug(slug: string, excludeId?: string) {
  const snap = await collection().where("slug", "==", slug).limit(1).get();
  if (snap.empty) return;
  if (excludeId && snap.docs[0]!.id === excludeId) return;
  throw new HttpError(409, `Slug already in use: ${slug}`);
}

export async function createProduct(input: {
  name: string;
  slug?: string;
  category: string;
  description: string;
  imageUrl: string;
  rate?: number;
  featured?: boolean;
}): Promise<Product> {
  const name = input.name?.trim();
  const description = input.description?.trim();
  const imageUrl = input.imageUrl?.trim();
  if (!name || !description || !imageUrl) {
    throw new HttpError(400, "name, description, and imageUrl are required.");
  }

  const category = assertCategory(input.category);
  const slug = slugify(input.slug?.trim() || name);
  if (!slug) {
    throw new HttpError(400, "Could not derive a valid slug.");
  }
  await assertUniqueSlug(slug);

  const rate = parseRate(input.rate);
  const now = new Date().toISOString();
  const ref = collection().doc();
  const doc = {
    slug,
    name,
    category,
    description,
    imageUrl,
    rate,
    featured: Boolean(input.featured),
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(doc);
  return mapProduct(ref.id, doc);
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    category: string;
    description: string;
    imageUrl: string;
    rate: number;
    featured: boolean;
  }>,
): Promise<Product> {
  const existing = await getProductById(id);
  if (!existing) {
    throw new HttpError(404, "Product not found.");
  }

  const name = input.name?.trim() || existing.name;
  const description = input.description?.trim() || existing.description;
  const imageUrl = input.imageUrl?.trim() || existing.imageUrl;
  const category = input.category
    ? assertCategory(input.category)
    : existing.category!;
  const slug = slugify(input.slug?.trim() || existing.slug || name);
  await assertUniqueSlug(slug, id);

  const rate =
    input.rate !== undefined ? parseRate(input.rate) : existing.rate;

  const next = {
    slug,
    name,
    category,
    description,
    imageUrl,
    rate,
    featured:
      typeof input.featured === "boolean" ? input.featured : Boolean(existing.featured),
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await collection().doc(id).set(next, { merge: true });
  return mapProduct(id, next);
}

export async function deleteProduct(id: string): Promise<void> {
  const existing = await getProductById(id);
  if (!existing) {
    throw new HttpError(404, "Product not found.");
  }
  await collection().doc(id).delete();
}
