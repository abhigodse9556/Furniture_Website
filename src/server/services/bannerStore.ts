import "server-only";

import type { Banner } from "@/lib/types";
import { getDb } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const collection = () => getDb().collection("banners");

function mapBanner(id: string, data: Record<string, unknown>): Banner {
  return {
    id,
    imageUrl: String(data.imageUrl ?? ""),
    order: Number(data.order ?? 0),
    active: Boolean(data.active ?? true),
    createdAt: data.createdAt as string | undefined,
    updatedAt: data.updatedAt as string | undefined,
  };
}

export async function listBanners(options?: {
  activeOnly?: boolean;
}): Promise<Banner[]> {
  const snap = await collection().orderBy("order", "asc").get();
  let items = snap.docs.map((doc) =>
    mapBanner(doc.id, doc.data() as Record<string, unknown>),
  );
  if (options?.activeOnly) {
    items = items.filter((b) => b.active && b.imageUrl);
  }
  return items;
}

export async function createBanner(input: {
  imageUrl: string;
  order?: number;
  active?: boolean;
}): Promise<Banner> {
  if (!input.imageUrl?.trim()) {
    throw new HttpError(400, "imageUrl is required.");
  }

  const existing = await listBanners();
  const order =
    typeof input.order === "number"
      ? input.order
      : existing.length > 0
        ? Math.max(...existing.map((b) => b.order)) + 1
        : 0;

  const now = new Date().toISOString();
  const ref = collection().doc();
  const doc = {
    imageUrl: input.imageUrl.trim(),
    order,
    active: input.active ?? true,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(doc);
  return mapBanner(ref.id, doc);
}

export async function updateBanner(
  id: string,
  input: Partial<Pick<Banner, "imageUrl" | "order" | "active">>,
): Promise<Banner> {
  const ref = collection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpError(404, "Banner not found.");
  }

  const current = mapBanner(id, snap.data() as Record<string, unknown>);
  const next = {
    imageUrl: input.imageUrl?.trim() || current.imageUrl,
    order: typeof input.order === "number" ? input.order : current.order,
    active: typeof input.active === "boolean" ? input.active : current.active,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await ref.set(next, { merge: true });
  return mapBanner(id, next);
}

export async function deleteBanner(id: string): Promise<void> {
  const ref = collection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpError(404, "Banner not found.");
  }
  await ref.delete();
}
