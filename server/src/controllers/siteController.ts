import type { NextFunction, Request, Response } from "express";

import * as siteStore from "../services/siteStore";

export async function getSite(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const site = await siteStore.getSiteSettings();
    res.json(site);
  } catch (err) {
    next(err);
  }
}

export async function updateSite(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const site = await siteStore.updateSiteSettings(req.body ?? {});
    res.json(site);
  } catch (err) {
    next(err);
  }
}
