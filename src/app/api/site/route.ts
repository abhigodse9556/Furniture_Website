import { jsonError, jsonOk } from "@/server/http";
import { getSiteSettings } from "@/server/services/siteStore";

export async function GET() {
  try {
    const site = await getSiteSettings();
    return jsonOk(site);
  } catch (err) {
    return jsonError(err);
  }
}
