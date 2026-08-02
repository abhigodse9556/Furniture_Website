import { jsonError, jsonOk } from "@/server/http";
import { listProducts } from "@/server/services/productStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const products = await listProducts({ category, featuredOnly });
    return jsonOk(products);
  } catch (err) {
    return jsonError(err);
  }
}
