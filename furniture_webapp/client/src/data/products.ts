import type { Product, ProductCategory } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "comfort-lounge-chair",
    name: "Comfort Lounge Chair",
    category: "chairs",
    description:
      "A soft-contour lounge chair built for everyday ease, with a solid frame and inviting silhouette.",
    imageUrl:
      "/images/chair/png-transparent-chair-comfort-furniture-commode-comfortable-chairs-angle-furniture-fashion-thumbnail.png",
    featured: true,
  },
  {
    slug: "outdoor-wood-chair",
    name: "Outdoor Wood Chair",
    category: "chairs",
    description:
      "Weather-ready wooden seating with clean lines ΓÇö suited for verandahs, gardens, and open courtyards.",
    imageUrl:
      "/images/chair/png-transparent-chair-furniture-chair-furniture-outdoor-table-wood-thumbnail.png",
  },
  {
    slug: "mission-dining-chair",
    name: "Mission Dining Chair",
    category: "chairs",
    description:
      "Mission-inspired dining chair with sturdy joinery and a timeless kitchen-table presence.",
    imageUrl:
      "/images/chair/png-transparent-dining-room-chair-mission-style-furniture-chair-angle-kitchen-furniture-thumbnail.png",
    featured: true,
  },
  {
    slug: "park-bench",
    name: "Park Bench",
    category: "chairs",
    description:
      "A generous wooden bench for gardens and entryways ΓÇö simple, durable, and welcoming.",
    imageUrl:
      "/images/chair/png-transparent-street-furniture-bench-wood-park-furniture-park-chair-thumbnail.png",
  },
  {
    slug: "classic-side-chair",
    name: "Classic Side Chair",
    category: "chairs",
    description:
      "A refined side chair that pairs with dining tables or stands alone as accent seating.",
    imageUrl:
      "/images/chair/png-transparent-table-chair-furniture-chair-angle-white-furniture-thumbnail.png",
  },
  {
    slug: "closed-panel-door",
    name: "Closed Panel Door",
    category: "doors",
    description:
      "A solid wooden door with warm grain and a classic closed-panel face for privacy and presence.",
    imageUrl:
      "/images/door/png-transparent-closed-browd-wooden-door-door-wood-furniture-table-door-angle-service-open-door-thumbnail.png",
    featured: true,
  },
  {
    slug: "drawer-panel-door",
    name: "Drawer Panel Door",
    category: "doors",
    description:
      "Crafted wood door detailing that complements cupboard and cabinet work throughout the home.",
    imageUrl:
      "/images/door/png-transparent-door-furniture-wood-door-furniture-drawer-cupboard-thumbnail.png",
  },
  {
    slug: "hardwood-carved-door",
    name: "Hardwood Carved Door",
    category: "doors",
    description:
      "Hardwood door with subtle carving ΓÇö a statement entry that showcases skilled woodwork.",
    imageUrl:
      "/images/door/png-transparent-wood-stain-door-hardwood-furniture-wooden-simple-room-wood-carving-thumbnail.png",
  },
  {
    slug: "bedroom-furniture-set",
    name: "Bedroom Furniture Set",
    category: "generic",
    description:
      "A coordinated bedroom collection with bedside tables and matching wood tones.",
    imageUrl:
      "/images/generic/png-transparent-brown-wooden-bedroom-furniture-set-art-bedside-tables-metal-furniture-couch-furniture-angle-furniture-drawer-thumbnail.png",
    featured: true,
  },
  {
    slug: "rustic-living-set",
    name: "Rustic Living Set",
    category: "generic",
    description:
      "Rustic living and bedroom pieces that bring warmth and texture into everyday spaces.",
    imageUrl:
      "/images/generic/png-transparent-rustic-furniture-table-bedroom-furniture-sets-living-room-bedroom-angle-furniture-couch-thumbnail.png",
  },
  {
    slug: "office-desk",
    name: "Office Desk",
    category: "generic",
    description:
      "A practical office desk with drawer storage ΓÇö built for focused work at home.",
    imageUrl:
      "/images/generic/png-transparent-table-furniture-office-desk-drawer-office-angle-furniture-drawer-thumbnail.png",
  },
  {
    slug: "glass-top-dining-table",
    name: "Glass-Top Dining Table",
    category: "tables",
    description:
      "Dining table with a luminous glass top and solid base ΓÇö light, modern, and easy to live with.",
    imageUrl:
      "/images/table/png-transparent-bedside-tables-furniture-coffee-tables-dining-room-table-glass-angle-kitchen-thumbnail.png",
  },
  {
    slug: "rustic-coffee-table",
    name: "Rustic Coffee Table",
    category: "tables",
    description:
      "Low coffee table in rustic wood ΓÇö the centerpiece for living-room gatherings.",
    imageUrl:
      "/images/table/png-transparent-coffee-tables-rustic-furniture-wood-coffee-table-angle-furniture-rectangle-thumbnail.png",
    featured: true,
  },
  {
    slug: "garden-bench-table",
    name: "Garden Bench Table",
    category: "tables",
    description:
      "Outdoor-ready bench and table pairing for gardens, terraces, and shaded courtyards.",
    imageUrl:
      "/images/table/png-transparent-table-bench-garden-furniture-bench-angle-furniture-rectangle-thumbnail.png",
  },
  {
    slug: "garden-dining-set",
    name: "Garden Dining Set",
    category: "tables",
    description:
      "Dining table with matching benches ΓÇö made for open-air meals and weekend company.",
    imageUrl:
      "/images/table/png-transparent-table-chair-bench-garden-furniture-dining-table-angle-furniture-rectangle-thumbnail.png",
    featured: true,
  },
  {
    slug: "framed-dining-table",
    name: "Framed Dining Table",
    category: "tables",
    description:
      "Dining table with a strong frame profile ΓÇö durable construction for daily family use.",
    imageUrl:
      "/images/table/png-transparent-table-furniture-dining-room-frames-table-frame-angle-kitchen-thumbnail.png",
  },
  {
    slug: "rectangle-coffee-table",
    name: "Rectangle Coffee Table",
    category: "tables",
    description:
      "Clean rectangular coffee table that anchors sofas and seating arrangements.",
    imageUrl:
      "/images/table/png-transparent-table-furniture-table-angle-rectangle-coffee-tables-thumbnail.png",
  },
  {
    slug: "loft-dining-table",
    name: "Loft Dining Table",
    category: "tables",
    description:
      "Loft-inspired dining table with an open, contemporary silhouette for modern homes.",
    imageUrl:
      "/images/table/png-transparent-table-loft-dining-room-furniture-chair-table-angle-furniture-room-thumbnail.png",
  },
  {
    slug: "nightstand-table",
    name: "Nightstand Table",
    category: "tables",
    description:
      "Compact nightstand with a sculpted form ΓÇö practical bedside storage with quiet style.",
    imageUrl:
      "/images/table/png-transparent-table-nightstand-furniture-couch-divan-3d-model-beautiful-furniture-kitchen-household-beautiful-vector-thumbnail.png",
  },
  {
    slug: "teak-dining-table",
    name: "Teak Dining Table",
    category: "tables",
    description:
      "Teak dining table with garden-ready presence ΓÇö rich grain and lasting strength.",
    imageUrl:
      "/images/table/png-transparent-table-teak-furniture-chair-garden-furniture-dining-table-angle-furniture-coffee-tables-thumbnail.png",
    featured: true,
  },
  {
    slug: "wood-coffee-table",
    name: "Wood Coffee Table",
    category: "tables",
    description:
      "Solid wood coffee table with a simple profile that lets the timber take center stage.",
    imageUrl:
      "/images/table/png-transparent-table-wood-furniture-table-angle-furniture-coffee-tables-thumbnail.png",
  },
  {
    slug: "classic-armoire",
    name: "Classic Armoire",
    category: "wardrobes",
    description:
      "Full-height armoire with generous storage ΓÇö a wardrobe landmark for the bedroom.",
    imageUrl:
      "/images/wardrobes/png-transparent-armoires-wardrobes-closet-drawer-door-furniture-closet-angle-mattress-furniture-thumbnail.png",
    featured: true,
  },
  {
    slug: "drawer-chest-wardrobe",
    name: "Drawer Chest Wardrobe",
    category: "wardrobes",
    description:
      "Wardrobe with chest-of-drawers character ΓÇö organized storage in warm hardwood.",
    imageUrl:
      "/images/wardrobes/png-transparent-armoires-wardrobes-furniture-chest-of-drawers-wood-closet-angle-kitchen-drawer-thumbnail.png",
  },
  {
    slug: "sliding-door-wardrobe",
    name: "Sliding Door Wardrobe",
    category: "wardrobes",
    description:
      "Sliding-door wardrobe with mirrored accents ΓÇö space-smart storage for modern rooms.",
    imageUrl:
      "/images/wardrobes/png-transparent-bedside-tables-armoires-wardrobes-furniture-sliding-door-wardrobe-angle-drawer-mirror-thumbnail.png",
  },
  {
    slug: "cupboard-closet",
    name: "Cupboard Closet",
    category: "wardrobes",
    description:
      "Tall cupboard closet with clean paneling ΓÇö versatile storage for clothing or linens.",
    imageUrl:
      "/images/wardrobes/png-transparent-closet-armoires-wardrobes-furniture-cupboard-closet-angle-furniture-image-file-formats-thumbnail.png",
  },
  {
    slug: "cabinetry-wardrobe",
    name: "Cabinetry Wardrobe",
    category: "wardrobes",
    description:
      "Built-in feel cabinetry wardrobe ΓÇö precise panels and practical compartment layout.",
    imageUrl:
      "/images/wardrobes/png-transparent-closet-cabinetry-cupboard-furniture-wardrobe-closet-angle-kitchen-drawer-thumbnail.png",
  },
  {
    slug: "panel-cupboard",
    name: "Panel Cupboard",
    category: "wardrobes",
    description:
      "Panel-front cupboard with a balanced silhouette for bedrooms and dressing areas.",
    imageUrl:
      "/images/wardrobes/png-transparent-wardrobe-closet-cupboard-furniture-cupboard-angle-kitchen-drawer-thumbnail.png",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category?: ProductCategory | "all") {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getCategories(): ProductCategory[] {
  return ["chairs", "tables", "doors", "wardrobes", "generic"];
}

