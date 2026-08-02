import { HttpError, jsonError, jsonOk } from "@/server/http";
import { getProductBySlug } from "@/server/services/productStore";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      throw new HttpError(404, "Product not found.");
    }
    return jsonOk(product);
  } catch (err) {
    return jsonError(err);
  }
}
