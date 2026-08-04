import { requireAdmin } from "@/server/auth/requireAdmin";
import { HttpError, jsonError, jsonOk } from "@/server/http";
import {
  getInvoiceById,
  updateInvoice,
} from "@/server/services/invoiceStore";
import type { InvoiceParty, InvoiceStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const invoice = await getInvoiceById(id);
    if (!invoice) {
      throw new HttpError(404, "Invoice not found.");
    }
    return jsonOk(invoice);
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = (await request.json()) as Partial<{
      status: InvoiceStatus;
      notes: string;
      customer: InvoiceParty;
    }>;
    const invoice = await updateInvoice(id, body);
    return jsonOk(invoice);
  } catch (err) {
    return jsonError(err);
  }
}
