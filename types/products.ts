import { ApiResponse } from "./auth.types";

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  shade: string;
  category: string;
  colour_hex: string;
  price: string;
  discount_percentage?: number;
  rating?: string;
  description: string;
  image: string;
  created_at: string;
  is_saved?: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProductListData {
  total: number;
  page: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  products: Product[];
}

export type ProductListResponse = ApiResponse<ProductListData>;

export interface CategoriesInnerResult {
  success: boolean;
  message: string;
  categories: ProductCategory[];
}

export interface ProductCategoriesData {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: CategoriesInnerResult;
}

export type ProductCategoriesResponse = ApiResponse<ProductCategoriesData>;

export type SingleProductResponse = ApiResponse<Product>;

export interface ProductMutationPayload {
  name: string;
  brand: string;
  shade: string;
  category: string;
  colour_hex: string;
  price: string;
  description: string;
  image?: File | null;
}
