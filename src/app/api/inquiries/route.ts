import { jsonError, jsonOk } from "@/server/http";
import { sendInquiryNotification } from "@/server/services/inquiryEmail";
import { createInquiry } from "@/server/services/inquiryStore";

type InquiryBody = {
  name?: string;
  email?: string;
  phone?: string;
  productSlug?: string;
  productName?: string;
  message?: string;
  /** Honeypot — leave empty; bots that fill it are silently ignored. */
  website?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryBody;

    // Silent success for bots that fill the honeypot.
    if (body.website?.trim()) {
      return jsonOk({ ok: true }, 201);
    }

    const inquiry = await createInquiry({
      name: body.name ?? "",
      email: body.email,
      phone: body.phone,
      productSlug: body.productSlug,
      productName: body.productName,
      message: body.message ?? "",
    });

    const emailResult = await sendInquiryNotification(inquiry);
    if (!emailResult.sent) {
      console.warn(
        "Inquiry saved but email was not sent:",
        emailResult.reason ?? "unknown",
      );
    }

    return jsonOk({ ok: true, id: inquiry.id }, 201);
  } catch (err) {
    return jsonError(err);
  }
}
