import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { peekNextInvoiceNumber } from "@/server/services/invoiceStore";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const invoiceNumber = await peekNextInvoiceNumber();
    return jsonOk({ invoiceNumber });
  } catch (err) {
    return jsonError(err);
  }
}
