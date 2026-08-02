export type ProductCategory =
  | "chairs"
  | "tables"
  | "doors"
  | "wardrobes"
  | "generic";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  featured?: boolean;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  chairs: "Chairs",
  tables: "Tables",
  doors: "Doors",
  wardrobes: "Wardrobes",
  generic: "Sets & More",
};
