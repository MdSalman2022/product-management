import type { Product, ProductsResponse } from '@/types/product';

const API_BASE = 'https://dummyjson.com';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export const productsApi = {
  getProducts: (skip = 0, limit = 10): Promise<ProductsResponse> =>
    fetchJson(`${API_BASE}/products?skip=${skip}&limit=${limit}`),

  searchProducts: (query: string, skip = 0, limit = 10): Promise<ProductsResponse> =>
    fetchJson(
      `${API_BASE}/products/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`
    ),

  getProductById: (id: number): Promise<Product> => fetchJson(`${API_BASE}/products/${id}`),

  getCategories: (): Promise<string[]> => fetchJson(`${API_BASE}/products/category-list`),

  getProductsByCategory: (category: string, skip = 0, limit = 10): Promise<ProductsResponse> =>
    fetchJson(
      `${API_BASE}/products/category/${encodeURIComponent(category)}?skip=${skip}&limit=${limit}`
    ),
};
