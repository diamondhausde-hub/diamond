export interface ProductSpec {
  key: string;
  value: string;
  unit?: string;
}

export interface ProductVariant {
  id: string;
  name: {
    de: string;
    en: string;
  };
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  specs: ProductSpec[];
  size?: string;
  packSize?: string;
  weight?: string;
}

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  type: string;
  surface: ProductSurface[];
  name: {
    de: string;
    en: string;
  };
  shortDescription: {
    de: string;
    en: string;
  };
  description: {
    de: string;
    en: string;
  };
  usage: {
    de: string;
    en: string;
  };
  safety: {
    de: string;
    en: string;
  };
  variants: ProductVariant[];
  badges: ProductBadge[];
  features: string[];
  relatedProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'glass'
  | 'floor'
  | 'mops-buckets'
  | 'cloths-sponges'
  | 'brushes-squeegees'
  | 'cleaners-sprays'
  | 'accessories';

export type ProductSurface =
  | 'glass'
  | 'floor'
  | 'tiles'
  | 'wood'
  | 'kitchen'
  | 'bathroom'
  | 'multi-surface';

export type ProductBadge = 'new' | 'bestseller' | 'sale' | 'eco' | 'profi';

export interface CategoryInfo {
  id: ProductCategory;
  name: {
    de: string;
    en: string;
  };
  description: {
    de: string;
    en: string;
  };
  image: string;
  productCount: number;
  subcategories: string[];
}

export interface FilterOptions {
  categories: { value: ProductCategory; label: { de: string; en: string } }[];
  types: { value: string; label: { de: string; en: string } }[];
  surfaces: { value: ProductSurface; label: { de: string; en: string } }[];
  sizes: { value: string; label: { de: string; en: string } }[];
  priceRange: { min: number; max: number };
  brands: { value: string; label: { de: string; en: string } }[];
  ecoFriendly: { value: boolean; label: { de: string; en: string } }[];
  inStock: { value: boolean; label: { de: string; en: string } }[];
}

export interface SortOption {
  value: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';
  label: {
    de: string;
    en: string;
  };
}