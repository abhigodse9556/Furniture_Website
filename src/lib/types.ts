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
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

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
