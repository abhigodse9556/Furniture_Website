import "server-only";

import { config } from "@/server/config/env";
import { getAdminAuth } from "@/server/config/firebaseAdmin";
import { HttpError } from "@/server/http";

export type AdminIdentity = {
  email: string;
  uid: string;
};

export async function requireAdmin(
  request: Request,
): Promise<AdminIdentity> {
  if (!config.adminEmail) {
    throw new HttpError(500, "ADMIN_EMAIL is not configured on the server.");
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing Authorization bearer token.");
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    throw new HttpError(401, "Missing Authorization bearer token.");
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = (decoded.email ?? "").toLowerCase();

    if (!email || email !== config.adminEmail) {
      throw new HttpError(403, "Not authorized as shop admin.");
    }

    return { email, uid: decoded.uid };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, "Invalid or expired auth token.");
  }
}
