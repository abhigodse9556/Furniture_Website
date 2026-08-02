import { jsonError, jsonOk } from "@/server/http";
import { listBanners } from "@/server/services/bannerStore";

export async function GET() {
  try {
    const banners = await listBanners({ activeOnly: true });
    return jsonOk(banners);
  } catch (err) {
    return jsonError(err);
  }
}
