export type ProductCategory =
  | "chairs"
  | "tables"
  | "doors"
  | "wardrobes"
  | "generic";

export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  /** INR unit price for invoicing; defaults to 0 for legacy docs */
  rate: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type InvoiceStatus = "draft" | "issued" | "cancelled";

export type InvoiceLineItem = {
  productId?: string;
  productSlug?: string;
  productName: string;
  rate: number;
  quantity: number;
  price: number;
};

export type InvoiceParty = {
  name: string;
  contact: string;
  address?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: InvoiceParty;
  shopkeeper: InvoiceParty;
  lineItems: InvoiceLineItem[];
  totalAmount: number;
  notes?: string;
  status: InvoiceStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "draft",
  "issued",
  "cancelled",
];

export type SiteSettings = {
  name: string;
  nameMr: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  updatedAt?: string;
};

export type Banner = {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  productSlug: string;
  productName: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
};

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "new",
  "read",
  "replied",
  "archived",
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  chairs: "Chairs",
  tables: "Tables",
  doors: "Doors",
  wardrobes: "Wardrobes",
  generic: "Sets & More",
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "chairs",
  "tables",
  "doors",
  "wardrobes",
  "generic",
];
