import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../middleware/errorHandler";
import { uploadImage } from "../services/uploadStore";

const FOLDERS = new Set(["products", "banners", "generic"] as const);

export async function upload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    if (!file) {
      throw new HttpError(400, "No file uploaded. Use field name \"file\".");
    }

    const folderRaw =
      typeof req.body?.folder === "string" ? req.body.folder : "generic";
    if (!FOLDERS.has(folderRaw as "products" | "banners" | "generic")) {
      throw new HttpError(400, "folder must be products, banners, or generic.");
    }

    const result = await uploadImage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
      folder: folderRaw as "products" | "banners" | "generic",
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
