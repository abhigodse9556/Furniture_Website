import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { updateSiteSettings } from "@/server/services/siteStore";

export async function PUT(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as Record<string, unknown>;
    const site = await updateSiteSettings(body);
    return jsonOk(site);
  } catch (err) {
    return jsonError(err);
  }
}
