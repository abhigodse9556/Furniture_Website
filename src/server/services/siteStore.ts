import "server-only";

import type { SiteSettings } from "@/lib/types";
import { getDb } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const DEFAULT_SITE: SiteSettings = {
  name: "Guruprasad Furniture",
  nameMr: "गुरुप्रसाद फर्निचर",
  tagline: "Handcrafted furniture for lasting homes",
  email: "inquiries@guruprasadfurniture.example",
  phone: "+91 98765 43210",
  address: "Maharashtra, India",
};

function siteDoc() {
  return getDb().collection("site").doc("settings");
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await siteDoc().get();
  if (!snap.exists) {
    return { ...DEFAULT_SITE };
  }
  const data = snap.data() as Partial<SiteSettings>;
  return {
    name: data.name ?? DEFAULT_SITE.name,
    nameMr: data.nameMr ?? DEFAULT_SITE.nameMr,
    tagline: data.tagline ?? DEFAULT_SITE.tagline,
    email: data.email ?? DEFAULT_SITE.email,
    phone: data.phone ?? DEFAULT_SITE.phone,
    address: data.address ?? DEFAULT_SITE.address,
    updatedAt: data.updatedAt,
  };
}

export async function updateSiteSettings(
  input: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const next: SiteSettings = {
    name: input.name?.trim() || current.name,
    nameMr: input.nameMr?.trim() || current.nameMr,
    tagline: input.tagline?.trim() || current.tagline,
    email: input.email?.trim() || current.email,
    phone: input.phone?.trim() || current.phone,
    address: input.address?.trim() || current.address,
    updatedAt: new Date().toISOString(),
  };

  if (!next.name || !next.email) {
    throw new HttpError(400, "Name and email are required.");
  }

  await siteDoc().set(next, { merge: true });
  return next;
}
