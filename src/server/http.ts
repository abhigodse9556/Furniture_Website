import "server-only";

import { NextResponse } from "next/server";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonNoContent() {
  return new NextResponse(null, { status: 204 });
}

export function jsonError(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
