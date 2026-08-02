import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../middleware/errorHandler";
import * as productStore from "../services/productStore";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const featuredOnly = req.query.featured === "true";
    const products = await productStore.listProducts({
      category,
      featuredOnly,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await productStore.getProductBySlug(String(req.params.slug));
    if (!product) {
      throw new HttpError(404, "Product not found.");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await productStore.createProduct(req.body ?? {});
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await productStore.updateProduct(
      String(req.params.id),
      req.body ?? {},
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await productStore.deleteProduct(String(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
