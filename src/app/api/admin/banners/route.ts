import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { createBanner, listBanners } from "@/server/services/bannerStore";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const banners = await listBanners();
    return jsonOk(banners);
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as {
      imageUrl: string;
      order?: number;
      active?: boolean;
    };
    const banner = await createBanner(body);
    return jsonOk(banner, 201);
  } catch (err) {
    return jsonError(err);
  }
}
