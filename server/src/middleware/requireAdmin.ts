import type { NextFunction, Request, Response } from "express";

import { config } from "../config/env";
import { getAdminAuth } from "../config/firebaseAdmin";
import { HttpError } from "./errorHandler";

export type AuthedRequest = Request & {
  adminEmail?: string;
  adminUid?: string;
};

export async function requireAdmin(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (!config.adminEmail) {
      throw new HttpError(
        500,
        "ADMIN_EMAIL is not configured on the server.",
      );
    }

    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing Authorization bearer token.");
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      throw new HttpError(401, "Missing Authorization bearer token.");
    }

    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = (decoded.email ?? "").toLowerCase();

    if (!email || email !== config.adminEmail) {
      throw new HttpError(403, "Not authorized as shop admin.");
    }

    req.adminEmail = email;
    req.adminUid = decoded.uid;
    next();
  } catch (err) {
    if (err instanceof HttpError) {
      next(err);
      return;
    }
    next(new HttpError(401, "Invalid or expired auth token."));
  }
}
