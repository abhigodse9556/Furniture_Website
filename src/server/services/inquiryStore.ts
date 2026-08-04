import "server-only";

import {
  INQUIRY_STATUSES,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/types";
import { getDb } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const collection = () => getDb().collection("inquiries");

function mapInquiry(id: string, data: Record<string, unknown>): Inquiry {
  const status = String(data.status ?? "new") as InquiryStatus;
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    productSlug: String(data.productSlug ?? ""),
    productName: String(data.productName ?? ""),
    message: String(data.message ?? ""),
    status: INQUIRY_STATUSES.includes(status) ? status : "new",
    createdAt: String(data.createdAt ?? ""),
    updatedAt: data.updatedAt as string | undefined,
  };
}

function assertStatus(status: string): InquiryStatus {
  if (!INQUIRY_STATUSES.includes(status as InquiryStatus)) {
    throw new HttpError(400, `Invalid status: ${status}`);
  }
  return status as InquiryStatus;
}

export type CreateInquiryInput = {
  name: string;
  email?: string;
  phone?: string;
  productSlug?: string;
  productName?: string;
  message: string;
};

export async function createInquiry(
  input: CreateInquiryInput,
): Promise<Inquiry> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  const productSlug = input.productSlug?.trim() ?? "";
  const productName = input.productName?.trim() ?? "";

  if (!name || !message) {
    throw new HttpError(400, "Please share your name and a short message.");
  }
  if (!email && !phone) {
    throw new HttpError(400, "Add an email or phone number so we can reply.");
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Please enter a valid email address.");
  }
  if (message.length > 5000) {
    throw new HttpError(400, "Message is too long.");
  }

  const now = new Date().toISOString();
  const ref = collection().doc();
  const doc = {
    name,
    email,
    phone,
    productSlug,
    productName,
    message,
    status: "new" as const,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(doc);
  return mapInquiry(ref.id, doc);
}

export async function listInquiries(): Promise<Inquiry[]> {
  const snap = await collection().orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) =>
    mapInquiry(doc.id, doc.data() as Record<string, unknown>),
  );
}

export async function updateInquiryStatus(
  id: string,
  status: string,
): Promise<Inquiry> {
  const nextStatus = assertStatus(status);
  const ref = collection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpError(404, "Inquiry not found.");
  }

  const current = mapInquiry(id, snap.data() as Record<string, unknown>);
  const next = {
    name: current.name,
    email: current.email,
    phone: current.phone,
    productSlug: current.productSlug,
    productName: current.productName,
    message: current.message,
    status: nextStatus,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };
  await ref.set(next, { merge: true });
  return mapInquiry(id, next);
}
