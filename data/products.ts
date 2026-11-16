export type CategoryId = "glass" | "floor" | "brushes" | "bags";

export type Product = {
  id: ProductId;
  /** Illustration key rendered by <ProductVisual />. Replace with a photo path when available. */
  visual: ProductId;
  /** Optional real photograph. When set it replaces the illustration. */
  image?: string;
  category: CategoryId;
  featured?: boolean;
};

export type ProductId =
  | "glassCloth"
  | "windowSqueegee"
  | "floorSqueegee"
  | "floorMop"
  | "brushesBrooms"
  | "wasteBags";

export const categories: { id: CategoryId; filter: "all" | CategoryId }[] = [
  { id: "glass", filter: "glass" },
  { id: "floor", filter: "floor" },
  { id: "brushes", filter: "brushes" },
  { id: "bags", filter: "bags" },
];

export const categoryOrder: CategoryId[] = ["glass", "floor", "brushes", "bags"];

/**
 * The complete DIAMOND range. All copy, specifications and available
 * sizes live in /messages/*.json so the catalogue is fully localised.
 */
export const products: Product[] = [
  {
    id: "glassCloth",
    visual: "glassCloth",
    category: "glass",
    featured: true,
  },
  {
    id: "windowSqueegee",
    visual: "windowSqueegee",
    category: "glass",
    featured: true,
  },
  {
    id: "floorSqueegee",
    visual: "floorSqueegee",
    category: "floor",
    featured: true,
  },
  {
    id: "floorMop",
    visual: "floorMop",
    category: "floor",
  },
  {
    id: "brushesBrooms",
    visual: "brushesBrooms",
    category: "brushes",
  },
  {
    id: "wasteBags",
    visual: "wasteBags",
    category: "bags",
  },
];

export function getProduct(id: ProductId): Product | undefined {
  return products.find((product) => product.id === id);
}
