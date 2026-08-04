"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  PRODUCT_CATEGORIES,
  INQUIRY_STATUSES,
  INVOICE_STATUSES,
  type Banner,
  type Inquiry,
  type InquiryStatus,
  type Invoice,
  type InvoiceStatus,
  type Product,
  type ProductCategory,
  type SiteSettings,
  CATEGORY_LABELS,
} from "@/lib/types";

type Tab = "site" | "banners" | "products" | "inquiries" | "invoices";

const TABS: Tab[] = ["site", "banners", "products", "inquiries", "invoices"];

function isTab(value: string | null): value is Tab {
  return value !== null && TABS.includes(value as Tab);
}

const emptyProductForm = {
  name: "",
  slug: "",
  category: "chairs" as ProductCategory,
  description: "",
  imageUrl: "",
  rate: 0,
  featured: false,
};

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="site-shell flex min-h-screen items-center justify-center text-[var(--muted)]">
          Loading admin…
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const { user, loading, configured, logout, adminFetch } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(() =>
    isTab(tabParam) ? tabParam : "site",
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [site, setSite] = useState<SiteSettings | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setError("");
    const [siteData, bannerData, productData, inquiryData, invoiceData] =
      await Promise.all([
        adminFetch<SiteSettings>("/api/site"),
        adminFetch<Banner[]>("/api/admin/banners"),
        adminFetch<Product[]>("/api/admin/products"),
        adminFetch<Inquiry[]>("/api/admin/inquiries"),
        adminFetch<Invoice[]>("/api/admin/invoices"),
      ]);
    setSite(siteData);
    setBanners(bannerData);
    setProducts(productData);
    setInquiries(inquiryData);
    setInvoices(invoiceData);
  }, [adminFetch]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (isTab(tabParam) && tabParam !== tab) {
      setTab(tabParam);
    }
  }, [tabParam, tab]);

  function selectTab(next: Tab) {
    setTab(next);
    router.replace(`/admin?tab=${next}`, { scroll: false });
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    void (async () => {
      try {
        const [siteData, bannerData, productData, inquiryData, invoiceData] =
          await Promise.all([
            adminFetch<SiteSettings>("/api/site"),
            adminFetch<Banner[]>("/api/admin/banners"),
            adminFetch<Product[]>("/api/admin/products"),
            adminFetch<Inquiry[]>("/api/admin/inquiries"),
            adminFetch<Invoice[]>("/api/admin/invoices"),
          ]);
        if (cancelled) return;
        setSite(siteData);
        setBanners(bannerData);
        setProducts(productData);
        setInquiries(inquiryData);
        setInvoices(invoiceData);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load admin data.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, adminFetch]);

  async function uploadFile(file: File, folder: "products" | "banners") {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const result = await adminFetch<{ imageUrl: string }>("/api/admin/upload", {
      method: "POST",
      body,
      headers: {},
    });
    return result.imageUrl;
  }

  async function saveSite(e: FormEvent) {
    e.preventDefault();
    if (!site) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await adminFetch<SiteSettings>("/api/admin/site", {
        method: "PUT",
        body: JSON.stringify(site),
      });
      setSite(updated);
      setMessage("Shop info saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save shop info.");
    } finally {
      setBusy(false);
    }
  }

  async function addBanner(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const imageUrl = await uploadFile(file, "banners");
      await adminFetch("/api/admin/banners", {
        method: "POST",
        body: JSON.stringify({ imageUrl, active: true }),
      });
      await loadAll();
      setMessage("Banner added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add banner.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleBanner(banner: Banner) {
    setBusy(true);
    setError("");
    try {
      await adminFetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        body: JSON.stringify({ active: !banner.active }),
      });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update banner.");
    } finally {
      setBusy(false);
    }
  }

  async function removeBanner(id: string) {
    if (!window.confirm("Delete this banner?")) return;
    setBusy(true);
    setError("");
    try {
      await adminFetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      await loadAll();
      setMessage("Banner deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete banner.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...productForm,
        slug: productForm.slug || undefined,
      };
      if (editingProductId) {
        await adminFetch(`/api/admin/products/${editingProductId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Product updated.");
      } else {
        await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Product created.");
      }
      setProductForm(emptyProductForm);
      setEditingProductId(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setBusy(false);
    }
  }

  async function editProduct(product: Product) {
    setEditingProductId(product.id ?? null);
    setProductForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      rate: product.rate ?? 0,
      featured: Boolean(product.featured),
    });
    setTab("products");
    router.replace("/admin?tab=products", { scroll: false });
  }

  async function removeProduct(id?: string) {
    if (!id) return;
    if (!window.confirm("Delete this product?")) return;
    setBusy(true);
    setError("");
    try {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      await loadAll();
      setMessage("Product deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product.");
    } finally {
      setBusy(false);
    }
  }

  async function setInvoiceStatus(id: string, status: InvoiceStatus) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await adminFetch<Invoice>(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInvoices((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
      setMessage(`Invoice marked as ${status}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update invoice.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function setInquiryStatus(id: string, status: InquiryStatus) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await adminFetch<Inquiry>(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
      setMessage(`Inquiry marked as ${status}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update inquiry.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="site-shell flex min-h-screen items-center justify-center text-[var(--muted)]">
        Checking admin session…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="site-shell py-16">
        <p className="text-red-800">
          Firebase is not configured. Add client env vars before using admin.
        </p>
      </div>
    );
  }

  return (
    <div className="site-shell py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Admin
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Shop dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="btn-secondary">
            View storefront
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => logout().then(() => router.replace("/admin/login"))}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["site", "Shop info"],
            ["banners", "Banners"],
            ["products", "Products"],
            ["inquiries", "Inquiries"],
            ["invoices", "Invoices"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTab(id)}
            className={`rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === id
                ? "bg-[var(--ink)] text-[var(--surface-elevated)]"
                : "bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-sm text-[var(--ink)]">
          {message}
        </p>
      ) : null}

      {tab === "site" && site ? (
        <form
          onSubmit={saveSite}
          className="mt-8 grid max-w-2xl gap-4 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-8"
        >
          {(
            [
              ["name", "Shop name"],
              ["nameMr", "Name (Marathi)"],
              ["tagline", "Tagline"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["address", "Address"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="field-label">{label}</span>
              <input
                className="field-input"
                value={site[key]}
                onChange={(e) =>
                  setSite((prev) =>
                    prev ? { ...prev, [key]: e.target.value } : prev,
                  )
                }
                required={key === "name" || key === "email"}
              />
            </label>
          ))}
          <button type="submit" className="btn-primary w-fit" disabled={busy}>
            Save shop info
          </button>
        </form>
      ) : null}

      {tab === "banners" ? (
        <div className="mt-8 space-y-6">
          <label className="inline-flex cursor-pointer flex-col gap-2">
            <span className="field-label">Upload new banner</span>
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                void addBanner(file);
                e.target.value = "";
              }}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)]"
              >
                <div className="relative aspect-[2/3] bg-[var(--surface)]">
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 p-3">
                  <span className="text-xs text-[var(--muted)]">
                    Order {banner.order} · {banner.active ? "Active" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => toggleBanner(banner)}
                  >
                    {banner.active ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => removeBanner(banner.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={saveProduct}
            className="space-y-4 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {editingProductId ? "Edit product" : "Add product"}
            </h2>
            <label className="block">
              <span className="field-label">Name</span>
              <input
                className="field-input"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Slug (optional)</span>
              <input
                className="field-input"
                value={productForm.slug}
                onChange={(e) =>
                  setProductForm((p) => ({ ...p, slug: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="field-label">Category</span>
              <select
                className="field-input"
                value={productForm.category}
                onChange={(e) =>
                  setProductForm((p) => ({
                    ...p,
                    category: e.target.value as ProductCategory,
                  }))
                }
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Description</span>
              <textarea
                className="field-input min-h-28"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Rate (INR)</span>
              <input
                className="field-input"
                type="number"
                min={0}
                step="0.01"
                value={productForm.rate}
                onChange={(e) =>
                  setProductForm((p) => ({
                    ...p,
                    rate: Number(e.target.value) || 0,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className="field-label">Image URL</span>
              <input
                className="field-input"
                value={productForm.imageUrl}
                onChange={(e) =>
                  setProductForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                required
              />
            </label>
            <label className="inline-flex cursor-pointer flex-col gap-2">
              <span className="field-label">Or upload image</span>
              <input
                type="file"
                accept="image/*"
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  setError("");
                  try {
                    const imageUrl = await uploadFile(file, "products");
                    setProductForm((p) => ({ ...p, imageUrl }));
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Upload failed.",
                    );
                  } finally {
                    setBusy(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={productForm.featured}
                onChange={(e) =>
                  setProductForm((p) => ({
                    ...p,
                    featured: e.target.checked,
                  }))
                }
              />
              Featured on home
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary" disabled={busy}>
                {editingProductId ? "Update product" : "Create product"}
              </button>
              {editingProductId ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm(emptyProductForm);
                  }}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id ?? product.slug}
                className="flex gap-3 rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-3"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--surface)]">
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {CATEGORY_LABELS[product.category]}
                    {product.featured ? " · Featured" : ""}
                    {` · ₹${Number(product.rate ?? 0).toFixed(2)}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={busy}
                      onClick={() => removeProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "inquiries" ? (
        <div className="mt-8 space-y-4">
          {inquiries.length === 0 ? (
            <p className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 text-sm text-[var(--muted)]">
              No inquiries yet. When visitors submit the contact form, they will
              appear here.
            </p>
          ) : (
            inquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--ink)]">
                      {inquiry.name}
                      {inquiry.status === "new" ? (
                        <span className="ml-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent-deep)]">
                          New
                        </span>
                      ) : null}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {inquiry.createdAt
                        ? new Date(inquiry.createdAt).toLocaleString()
                        : ""}
                      {inquiry.productName
                        ? ` · ${inquiry.productName}`
                        : " · General inquiry"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {inquiry.email ? (
                        <a
                          className="text-[var(--accent-deep)] underline"
                          href={`mailto:${inquiry.email}`}
                        >
                          {inquiry.email}
                        </a>
                      ) : null}
                      {inquiry.email && inquiry.phone ? " · " : null}
                      {inquiry.phone ? (
                        <a
                          className="text-[var(--accent-deep)] underline"
                          href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
                        >
                          {inquiry.phone}
                        </a>
                      ) : null}
                    </p>
                  </div>
                  <label className="block shrink-0 sm:w-40">
                    <span className="field-label">Status</span>
                    <select
                      className="field-input"
                      value={inquiry.status}
                      disabled={busy}
                      onChange={(e) =>
                        void setInquiryStatus(
                          inquiry.id,
                          e.target.value as InquiryStatus,
                        )
                      }
                    >
                      {INQUIRY_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                  {inquiry.message}
                </p>
              </article>
            ))
          )}
        </div>
      ) : null}

      {tab === "invoices" ? (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Invoices are created from the mobile app. You can review history and
            update status here.
          </p>
          {invoices.length === 0 ? (
            <p className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 text-sm text-[var(--muted)]">
              No invoices yet.
            </p>
          ) : (
            invoices.map((invoice) => (
              <article
                key={invoice.id}
                className="rounded-sm border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--ink)]">
                      {invoice.invoiceNumber}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {invoice.date} · {invoice.customer.name} · ₹
                      {Number(invoice.totalAmount).toFixed(2)}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--ink)]">
                      {invoice.lineItems.map((line, index) => (
                        <li key={`${invoice.id}-${index}`}>
                          {line.productName} — ₹{line.rate.toFixed(2)} ×{" "}
                          {line.quantity} = ₹{line.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <label className="block shrink-0 sm:w-40">
                    <span className="field-label">Status</span>
                    <select
                      className="field-input"
                      value={invoice.status}
                      disabled={busy}
                      onChange={(e) =>
                        void setInvoiceStatus(
                          invoice.id,
                          e.target.value as InvoiceStatus,
                        )
                      }
                    >
                      {INVOICE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
