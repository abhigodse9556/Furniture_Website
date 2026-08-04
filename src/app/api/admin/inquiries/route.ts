import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { listInquiries } from "@/server/services/inquiryStore";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const inquiries = await listInquiries();
    return jsonOk(inquiries);
  } catch (err) {
    return jsonError(err);
  }
}
