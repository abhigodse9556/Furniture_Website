import { requireAdmin } from "@/server/auth/requireAdmin";
import { HttpError, jsonError, jsonOk } from "@/server/http";
import { uploadImage } from "@/server/services/uploadStore";

const MAX_BYTES = 8 * 1024 * 1024;
const FOLDERS = new Set(["products", "banners", "generic"] as const);

type Folder = "products" | "banners" | "generic";

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new HttpError(400, 'No file uploaded. Use field name "file".');
    }

    if (file.size > MAX_BYTES) {
      throw new HttpError(400, "File too large. Maximum size is 8MB.");
    }

    const folderRaw = String(form.get("folder") ?? "generic");
    const folder: Folder = FOLDERS.has(folderRaw as Folder)
      ? (folderRaw as Folder)
      : "generic";

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage({
      buffer,
      mimeType: file.type || "application/octet-stream",
      originalName: file.name || "upload.jpg",
      folder,
    });

    return jsonOk(result, 201);
  } catch (err) {
    return jsonError(err);
  }
}
