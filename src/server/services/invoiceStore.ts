import "server-only";

import {
  INVOICE_STATUSES,
  type Invoice,
  type InvoiceLineItem,
  type InvoiceParty,
  type InvoiceStatus,
} from "@/lib/types";
import { getDb } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

const collection = () => getDb().collection("invoices");
const counterDoc = () => getDb().collection("site").doc("invoiceCounter");

function parseMoney(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

function mapParty(data: unknown): InvoiceParty {
  const obj = (data ?? {}) as Record<string, unknown>;
  return {
    name: String(obj.name ?? ""),
    contact: String(obj.contact ?? ""),
    address: obj.address !== undefined ? String(obj.address) : undefined,
  };
}

function mapLineItem(data: unknown): InvoiceLineItem {
  const obj = (data ?? {}) as Record<string, unknown>;
  const rate = parseMoney(obj.rate);
  const quantity = parseMoney(obj.quantity);
  const price =
    obj.price !== undefined ? parseMoney(obj.price) : parseMoney(rate * quantity);
  return {
    productId: obj.productId ? String(obj.productId) : undefined,
    productSlug: obj.productSlug ? String(obj.productSlug) : undefined,
    productName: String(obj.productName ?? ""),
    rate,
    quantity,
    price,
  };
}

function mapInvoice(id: string, data: Record<string, unknown>): Invoice {
  return {
    id,
    invoiceNumber: String(data.invoiceNumber ?? ""),
    date: String(data.date ?? ""),
    customer: mapParty(data.customer),
    shopkeeper: mapParty(data.shopkeeper),
    lineItems: Array.isArray(data.lineItems)
      ? data.lineItems.map(mapLineItem)
      : [],
    totalAmount: parseMoney(data.totalAmount),
    notes: data.notes ? String(data.notes) : undefined,
    status: (data.status as InvoiceStatus) ?? "issued",
    createdBy: String(data.createdBy ?? ""),
    createdAt: String(data.createdAt ?? ""),
    updatedAt: String(data.updatedAt ?? ""),
  };
}

function assertStatus(status: string): InvoiceStatus {
  if (!INVOICE_STATUSES.includes(status as InvoiceStatus)) {
    throw new HttpError(400, `Invalid invoice status: ${status}`);
  }
  return status as InvoiceStatus;
}

function normalizeLineItems(raw: unknown): InvoiceLineItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new HttpError(400, "At least one line item is required.");
  }

  return raw.map((item, index) => {
    const mapped = mapLineItem(item);
    if (!mapped.productName.trim()) {
      throw new HttpError(400, `lineItems[${index}].productName is required.`);
    }
    if (mapped.quantity <= 0) {
      throw new HttpError(400, `lineItems[${index}].quantity must be > 0.`);
    }
    const price = parseMoney(mapped.rate * mapped.quantity);
    return { ...mapped, price };
  });
}

/** Allocate next GPF-YYYY-#### using a Firestore transaction. */
export async function peekNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const snap = await counterDoc().get();
  const data = (snap.data() ?? {}) as { year?: number; seq?: number };
  const seq =
    data.year === year && typeof data.seq === "number" ? data.seq + 1 : 1;
  return `GPF-${year}-${String(seq).padStart(4, "0")}`;
}

async function allocateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const ref = counterDoc();

  return getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = (snap.data() ?? {}) as { year?: number; seq?: number };
    const nextSeq =
      data.year === year && typeof data.seq === "number" ? data.seq + 1 : 1;
    tx.set(
      ref,
      { year, seq: nextSeq, updatedAt: new Date().toISOString() },
      { merge: true },
    );
    return `GPF-${year}-${String(nextSeq).padStart(4, "0")}`;
  });
}

export async function listInvoices(options?: {
  status?: string;
}): Promise<Invoice[]> {
  const snap = await collection().orderBy("createdAt", "desc").get();
  let items = snap.docs.map((doc) =>
    mapInvoice(doc.id, doc.data() as Record<string, unknown>),
  );
  if (options?.status) {
    const status = assertStatus(options.status);
    items = items.filter((inv) => inv.status === status);
  }
  return items;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const snap = await collection().doc(id).get();
  if (!snap.exists) return null;
  return mapInvoice(id, snap.data() as Record<string, unknown>);
}

export async function createInvoice(input: {
  customer: InvoiceParty;
  shopkeeper: InvoiceParty;
  lineItems: InvoiceLineItem[];
  notes?: string;
  date?: string;
  status?: InvoiceStatus;
  createdBy: string;
}): Promise<Invoice> {
  const customerName = input.customer?.name?.trim();
  if (!customerName) {
    throw new HttpError(400, "customer.name is required.");
  }

  const lineItems = normalizeLineItems(input.lineItems);
  const totalAmount = parseMoney(
    lineItems.reduce((sum, item) => sum + item.price, 0),
  );

  const status = input.status ? assertStatus(input.status) : "issued";
  const invoiceNumber = await allocateInvoiceNumber();
  const now = new Date().toISOString();
  const date = input.date?.trim() || now.slice(0, 10);

  const ref = collection().doc();
  const notes = input.notes?.trim();
  const doc: Record<string, unknown> = {
    invoiceNumber,
    date,
    customer: {
      name: customerName,
      contact: String(input.customer.contact ?? "").trim(),
      address: String(input.customer.address ?? "").trim(),
    },
    shopkeeper: {
      name: String(input.shopkeeper?.name ?? "").trim(),
      contact: String(input.shopkeeper?.contact ?? "").trim(),
    },
    lineItems,
    totalAmount,
    status,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  };
  if (notes) {
    doc.notes = notes;
  }

  await ref.set(doc);
  return mapInvoice(ref.id, doc);
}

export async function updateInvoice(
  id: string,
  input: Partial<{
    status: InvoiceStatus;
    notes: string;
    customer: InvoiceParty;
  }>,
): Promise<Invoice> {
  const existing = await getInvoiceById(id);
  if (!existing) {
    throw new HttpError(404, "Invoice not found.");
  }

  const next: Record<string, unknown> = {
    invoiceNumber: existing.invoiceNumber,
    date: existing.date,
    customer: input.customer
      ? {
          name: input.customer.name?.trim() || existing.customer.name,
          contact:
            input.customer.contact?.trim() ?? existing.customer.contact,
          address:
            input.customer.address?.trim() ?? existing.customer.address ?? "",
        }
      : existing.customer,
    shopkeeper: existing.shopkeeper,
    lineItems: existing.lineItems,
    totalAmount: existing.totalAmount,
    status: input.status ? assertStatus(input.status) : existing.status,
    createdBy: existing.createdBy,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const notesValue =
    input.notes !== undefined
      ? input.notes.trim() || ""
      : existing.notes?.trim() || "";
  if (notesValue) {
    next.notes = notesValue;
  }

  await collection().doc(id).set(next, { merge: true });
  return mapInvoice(id, next);
}
