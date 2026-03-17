import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '@/api/products';

export function useProducts(skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['products', skip, limit],
    queryFn: () => productsApi.getProducts(skip, limit),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSearchProducts(query: string, skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['products', 'search', query, skip, limit],
    queryFn: () => productsApi.searchProducts(query, skip, limit),
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useProductById(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useProductsByCategory(category: string, skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['products', 'category', category, skip, limit],
    queryFn: () => productsApi.getProductsByCategory(category, skip, limit),
    enabled: category.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
