import { requireAdmin } from "@/server/auth/requireAdmin";
import { jsonError, jsonNoContent, jsonOk } from "@/server/http";
import { deleteProduct, updateProduct } from "@/server/services/productStore";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = (await request.json()) as Partial<{
      name: string;
      slug: string;
      category: string;
      description: string;
      imageUrl: string;
      featured: boolean;
    }>;
    const product = await updateProduct(id, body);
    return jsonOk(product);
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    await deleteProduct(id);
    return jsonNoContent();
  } catch (err) {
    return jsonError(err);
  }
}
