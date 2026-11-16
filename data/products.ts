import rawProducts from "./products.json";
import rawCategories from "./categories.json";

export type CategoryId = "glass" | "floor" | "brushes" | "bags";

export type ProductId =
  | "glass-cloth"
  | "window-squeegee"
  | "floor-squeegee"
  | "floor-mop"
  | "brushes-brooms"
  | "waste-bags";

export type VisualId =
  | "glassCloth"
  | "windowSqueegee"
  | "floorSqueegee"
  | "floorMop"
  | "brushesBrooms"
  | "wasteBags";

export type Product = {
  id: ProductId;
  /** Illustration key rendered by <ProductVisual />. Used when `image` is null. */
  visual: VisualId;
  /** Optional uploaded photograph. null = show the SVG illustration. */
  image: string | null;
  gallery: string[];
  category: CategoryId;
  /** Available sizes. Not translated — they are written once in products.json. */
  sizes: string[];
  featured?: boolean;
  visible?: boolean;
  order: number;
};

export type Category = { id: CategoryId; labelKey: string };

/**
 * Editable data lives in JSON so the browser-based admin panel can read and
 * write it safely. The TypeScript exports below keep their original names.
 */
export const categories: Category[] = rawCategories as Category[];

export const categoryOrder: CategoryId[] = categories.map((category) => category.id);

export const products: Product[] = (rawProducts as unknown as Product[])
  .filter((product) => product.visible !== false)
  .sort((a, b) => a.order - b.order);

export function getProduct(id: ProductId): Product | undefined {
  return products.find((product) => product.id === id);
}
