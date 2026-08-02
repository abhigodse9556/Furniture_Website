import type { NextFunction, Request, Response } from "express";

import * as bannerStore from "../services/bannerStore";

export async function getPublicBanners(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const banners = await bannerStore.listBanners({ activeOnly: true });
    res.json(banners);
  } catch (err) {
    next(err);
  }
}

export async function getAdminBanners(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const banners = await bannerStore.listBanners();
    res.json(banners);
  } catch (err) {
    next(err);
  }
}

export async function createBanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const banner = await bannerStore.createBanner(req.body ?? {});
    res.status(201).json(banner);
  } catch (err) {
    next(err);
  }
}

export async function updateBanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const banner = await bannerStore.updateBanner(
      String(req.params.id),
      req.body ?? {},
    );
    res.json(banner);
  } catch (err) {
    next(err);
  }
}

export async function deleteBanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await bannerStore.deleteBanner(String(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
