import { useMemo } from 'react';
import { Table, Input, Select, Button, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  useProducts,
  useSearchProducts,
  useProductsByCategory,
  useCategories,
} from '@/hooks/useProducts';
import { useProductStore } from '@/store/useProductStore';
import type { Product } from '@/types/product';

export default function ProductListPage() {
  const navigate = useNavigate();
  const {
    searchQuery,
    selectedCategory,
    page,
    pageSize,
    setSearchQuery,
    setSelectedCategory,
    setPage,
    setPageSize,
    resetFilters,
  } = useProductStore();

  const skip = (page - 1) * pageSize;
  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = selectedCategory.length > 0;

  const { data: allData, isFetching: fetchingAll, error } = useProducts(skip, pageSize);
  const { data: searchData, isFetching: fetchingSearch } = useSearchProducts(
    searchQuery,
    skip,
    pageSize
  );
  const { data: categoryData, isFetching: fetchingCategory } = useProductsByCategory(
    selectedCategory,
    skip,
    pageSize
  );
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const data = isSearching ? searchData : isFiltering ? categoryData : allData;
  const isFetching = isSearching ? fetchingSearch : isFiltering ? fetchingCategory : fetchingAll;

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        render: (rating: number) => rating.toFixed(1),
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        sorter: (a, b) => a.stock - b.stock,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (cat: string) => <Tag>{cat}</Tag>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button type="link" onClick={() => navigate(`/products/${record.id}`)}>
            View
          </Button>
        ),
      },
    ],
    [navigate]
  );

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Failed to load products. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-72"
          allowClear
          onClear={() => setSearchQuery('')}
        />
        <Select
          placeholder="All categories"
          value={selectedCategory || undefined}
          onChange={(val) => setSelectedCategory(val ?? '')}
          allowClear
          className="w-52"
          loading={loadingCategories}
          options={categories.map((cat) => ({ label: cat, value: cat }))}
        />
        {(isSearching || isFiltering) && <Button onClick={resetFilters}>Clear filters</Button>}
      </div>

      <Table
        columns={columns}
        dataSource={data?.products ?? []}
        rowKey="id"
        loading={isFetching}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (p) => setPage(p),
          onShowSizeChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `${total} products`,
        }}
      />
    </div>
  );
}
