import "server-only";

import nodemailer from "nodemailer";

import type { Inquiry } from "@/lib/types";
import { config } from "@/server/config/env";
import { getSiteSettings } from "@/server/services/siteStore";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildInquiryEmail(
  inquiry: Inquiry,
  siteName: string,
  adminInquiriesUrl: string,
) {
  const rows: Array<{ label: string; value: string; href?: string }> = [
    { label: "Name", value: inquiry.name },
  ];
  if (inquiry.email) {
    rows.push({
      label: "Email",
      value: inquiry.email,
      href: `mailto:${inquiry.email}`,
    });
  }
  if (inquiry.phone) {
    rows.push({
      label: "Phone",
      value: inquiry.phone,
      href: `tel:${inquiry.phone.replace(/\s/g, "")}`,
    });
  }
  if (inquiry.productName) {
    rows.push({ label: "Product", value: inquiry.productName });
  }

  const text = [
    `New inquiry for ${siteName}`,
    "",
    `Name: ${inquiry.name}`,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    inquiry.productName ? `Product: ${inquiry.productName}` : null,
    "",
    inquiry.message,
    "",
    `Inquiry ID: ${inquiry.id}`,
    "",
    `Open in admin: ${adminInquiriesUrl}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const detailRows = rows
    .map((row) => {
      const safeValue = escapeHtml(row.value);
      const valueHtml = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:#6e4a2a;text-decoration:underline;">${safeValue}</a>`
        : safeValue;
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e4dfd8;width:110px;vertical-align:top;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7a7268;font-family:Georgia,'Times New Roman',serif;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e4dfd8;vertical-align:top;font-size:15px;color:#1a1612;font-family:Arial,Helvetica,sans-serif;">
            ${valueHtml}
          </td>
        </tr>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#e9e6e1;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e6e1;padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#f4f2ee;border:1px solid #d9d2c8;">
            <tr>
              <td style="padding:28px 28px 20px;border-bottom:3px solid #9a6b3f;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7a7268;font-family:Arial,Helvetica,sans-serif;">
                  Website inquiry
                </p>
                <h1 style="margin:0;font-size:26px;line-height:1.25;color:#1a1612;font-weight:normal;font-family:Georgia,'Times New Roman',serif;">
                  New message for ${escapeHtml(siteName)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${detailRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;">
                <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7a7268;font-family:Arial,Helvetica,sans-serif;">
                  Message
                </p>
                <div style="padding:16px 18px;background:#ebe7e1;border-left:3px solid #9a6b3f;font-size:15px;line-height:1.6;color:#1a1612;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">
${escapeHtml(inquiry.message)}
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 0;">
                  <tr>
                    <td style="background:#1a1612;">
                      <a href="${escapeHtml(adminInquiriesUrl)}" style="display:inline-block;padding:12px 20px;font-size:14px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;color:#f4f2ee;text-decoration:none;">
                        Open in admin
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:18px 0 0;font-size:12px;color:#7a7268;font-family:Arial,Helvetica,sans-serif;">
                  Inquiry ID: ${escapeHtml(inquiry.id)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  return { text, html };
}

export async function sendInquiryNotification(
  inquiry: Inquiry,
): Promise<{ sent: boolean; reason?: string }> {
  if (!config.smtpUser || !config.smtpPass) {
    return {
      sent: false,
      reason: "SMTP_USER and SMTP_PASS are not configured.",
    };
  }

  const site = await getSiteSettings();
  const to = config.inquiryToEmail || site.email;
  if (!to) {
    return { sent: false, reason: "No To email address configured." };
  }

  const from = config.smtpFrom || config.smtpUser;

  const subject = inquiry.productName
    ? `Guruprasad Furniture - Inquiry: ${inquiry.productName}`
    : `Inquiry from ${site.name} website`;

  const { text, html } = buildInquiryEmail(
    inquiry,
    site.name,
    `${config.siteUrl}/admin?tab=inquiries`,
  );

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      ...(config.inquiryCcEmail ? { cc: config.inquiryCcEmail } : {}),
      ...(config.inquiryBccEmail ? { bcc: config.inquiryBccEmail } : {}),
      replyTo: inquiry.email || undefined,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (err) {
    console.error("Failed to send inquiry email:", err);
    return {
      sent: false,
      reason: err instanceof Error ? err.message : "Email send failed.",
    };
  }
}
