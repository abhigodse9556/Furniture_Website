import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { updateInquiryStatus } from "@/server/services/inquiryStore";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = (await request.json()) as { status?: string };
    const inquiry = await updateInquiryStatus(id, body.status ?? "");
    return jsonOk(inquiry);
  } catch (err) {
    return jsonError(err);
  }
}
