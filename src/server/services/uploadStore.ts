import "server-only";

import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { getBucket } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadImage(params: {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  folder: "products" | "banners" | "generic";
}): Promise<{ imageUrl: string; path: string }> {
  if (!ALLOWED.has(params.mimeType)) {
    throw new HttpError(400, "Only JPEG, PNG, WebP, or GIF images are allowed.");
  }

  const ext = extname(params.originalName).toLowerCase() || ".jpg";
  const path = `${params.folder}/${Date.now()}-${randomUUID()}${ext}`;
  const bucket = getBucket();
  const file = bucket.file(path);

  await file.save(params.buffer, {
    metadata: {
      contentType: params.mimeType,
      cacheControl: "public,max-age=31536000",
    },
    resumable: false,
  });

  try {
    await file.makePublic();
  } catch {
    // Bucket may already use uniform public access via rules; continue.
  }

  const imageUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
  return { imageUrl, path };
}
