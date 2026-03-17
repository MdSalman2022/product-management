import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductFiltersState {
  searchQuery: string;
  selectedCategory: string;
  page: number;
  pageSize: number;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductFiltersState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedCategory: '',
      page: 1,
      pageSize: 10,
      setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
      setSelectedCategory: (category) => set({ selectedCategory: category, page: 1 }),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize, page: 1 }),
      resetFilters: () => set({ searchQuery: '', selectedCategory: '', page: 1 }),
    }),
    { name: 'product-filters' }
  )
);
