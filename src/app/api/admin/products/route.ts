import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonOk } from "@/server/http";
import { createProduct, listProducts } from "@/server/services/productStore";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const products = await listProducts();
    return jsonOk(products);
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as {
      name: string;
      slug?: string;
      category: string;
      description: string;
      imageUrl: string;
      rate?: number;
      featured?: boolean;
    };
    const product = await createProduct(body);
    return jsonOk(product, 201);
  } catch (err) {
    return jsonError(err);
  }
}
