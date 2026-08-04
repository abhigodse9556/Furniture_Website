import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import {
  createInvoice,
  listInvoices,
} from "@/server/services/invoiceStore";
import type { InvoiceLineItem, InvoiceParty, InvoiceStatus } from "@/lib/types";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const invoices = await listInvoices({ status });
    return jsonOk(invoices);
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    const body = (await request.json()) as {
      customer: InvoiceParty;
      shopkeeper: InvoiceParty;
      lineItems: InvoiceLineItem[];
      notes?: string;
      date?: string;
      status?: InvoiceStatus;
    };
    const invoice = await createInvoice({
      ...body,
      createdBy: admin.email,
    });
    return jsonOk(invoice, 201);
  } catch (err) {
    return jsonError(err);
  }
}
