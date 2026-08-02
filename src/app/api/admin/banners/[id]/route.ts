import type { Banner } from "@/lib/types";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonNoContent, jsonOk } from "@/server/http";
import { deleteBanner, updateBanner } from "@/server/services/bannerStore";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = (await request.json()) as Partial<
      Pick<Banner, "imageUrl" | "order" | "active">
    >;
    const banner = await updateBanner(id, body);
    return jsonOk(banner);
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    await deleteBanner(id);
    return jsonNoContent();
  } catch (err) {
    return jsonError(err);
  }
}
