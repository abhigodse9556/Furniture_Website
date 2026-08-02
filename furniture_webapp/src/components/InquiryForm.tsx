"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { SITE } from "@/lib/site";

type Status = "idle" | "success";

export function InquiryForm() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productSlug, setProductSlug] = useState(initialProduct);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const productName = useMemo(() => {
    return getProductBySlug(productSlug)?.name ?? "";
  }, [productSlug]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError("Please share your name and a short message.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Add an email or phone number so we can reply.");
      return;
    }

    const subject = encodeURIComponent(
      productName
        ? `Inquiry: ${productName}`
        : `Inquiry from ${SITE.name} website`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name.trim()}`,
        email.trim() ? `Email: ${email.trim()}` : null,
        phone.trim() ? `Phone: ${phone.trim()}` : null,
        productName ? `Product: ${productName}` : null,
        "",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );

    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-8"
        role="status"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Thank you
        </h2>
        <p className="mt-3 text-[var(--muted)] leading-relaxed">
          Your email client should open with the inquiry filled in. If it
          doesn&apos;t, write to us at{" "}
          <a className="text-[var(--accent-deep)] underline" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          .
        </p>
        <button
          type="button"
          className="btn-secondary mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="field-label">Name</span>
          <input
            className="field-input"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="field-label">Email</span>
          <input
            className="field-input"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="field-label">Phone</span>
          <input
            className="field-input"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Product interest</span>
          <select
            className="field-input"
            name="product"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
          >
            <option value="">General inquiry</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Message</span>
          <textarea
            className="field-input min-h-32 resize-y"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
      </div>

      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send inquiry
      </button>
    </form>
  );
}
