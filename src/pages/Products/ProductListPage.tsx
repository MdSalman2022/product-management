import { useMemo } from 'react';
import { Table, Input, Select, Button, Tag, Card, Rate, Avatar, Pagination } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  useProducts,
  useSearchProducts,
  useProductsByCategory,
  useCategories,
} from '@/hooks/useProducts';
import { useProductStore } from '@/store/useProductStore';
import PageError from '@/components/Shared/PageError';
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
        title: 'Product',
        key: 'product',
        width: 250,
        render: (_, record) => (
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate(`/products/${record.id}`)}
          >
            <Avatar
              src={record.thumbnail}
              shape="square"
              size={48}
              className="flex-shrink-0 bg-gray-100"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-blue-600 hover:text-blue-800 hover:underline">
                {record.title}
              </p>
              <p className="truncate text-xs text-gray-500">{record.brand}</p>
            </div>
          </div>
        ),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (price: number) => (
          <span className="font-semibold text-gray-800">${price.toFixed(2)}</span>
        ),
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        width: 130,
        render: (rating: number) => (
          <div className="flex items-center gap-1">
            <Rate disabled allowHalf defaultValue={rating} style={{ fontSize: 13 }} />
            <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
          </div>
        ),
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        width: 110,
        render: (stock: number) => (
          <Tag color={stock > 50 ? 'green' : stock > 10 ? 'orange' : 'red'}>{stock} units</Tag>
        ),
        sorter: (a, b) => a.stock - b.stock,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 140,
        render: (cat: string) => <Tag color="blue">{cat}</Tag>,
      },
      {
        title: 'Action',
        key: 'action',
        width: 80,
        render: (_, record) => (
          <Button type="primary" size="small" onClick={() => navigate(`/products/${record.id}`)}>
            View
          </Button>
        ),
      },
    ],
    [navigate]
  );

  if (error) {
    return (
      <PageError
        title="Failed to load products"
        subTitle="Something went wrong while fetching products. Please try again."
        onBack={() => window.location.reload()}
      />
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold sm:text-xl">Products</span>
          {data?.total !== undefined && (
            <span className="text-sm font-normal text-gray-500">{data.total} total</span>
          )}
        </div>
      }
      bordered={false}
      className="shadow-sm"
      styles={{ body: { padding: '16px 0' }, header: { padding: '0 16px' } }}
    >
      <div className="mb-4 flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
        <Input.Search
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={(val) => setSearchQuery(val)}
          className="w-full sm:max-w-[280px]"
          allowClear
        />
        <Select
          placeholder="All categories"
          value={selectedCategory || undefined}
          onChange={(val) => setSelectedCategory(val ?? '')}
          allowClear
          className="w-full sm:max-w-[200px]"
          loading={loadingCategories}
          options={categories.map((cat) => ({ label: cat, value: cat }))}
        />
        {(isSearching || isFiltering) && (
          <Button onClick={resetFilters} className="w-full sm:w-auto">
            Clear filters
          </Button>
        )}
      </div>

      <div className="pb-16 sm:pb-0">
        <Table
          columns={columns}
          dataSource={data?.products ?? []}
          rowKey="id"
          loading={isFetching}
          scroll={{ x: 'max-content' }}
          size="middle"
          pagination={false}
          className="ant-table-striped"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center overflow-x-auto border-t border-slate-200 bg-white p-3 shadow-[0_-4px_10px_-1px_rgb(0,0,0,0.1)] scrollbar-hide sm:static sm:mt-4 sm:justify-end sm:overflow-visible sm:border-t-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:px-4">
        <div className="min-w-max">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={data?.total ?? 0}
            onChange={(p) => setPage(p)}
            onShowSizeChange={(_, size) => setPageSize(size)}
            showSizeChanger
            pageSizeOptions={['5', '10', '20']}
            showTotal={(total, range) => (
              <span className="hidden sm:inline">
                {range[0]}-{range[1]} of {total} products
              </span>
            )}
            size="default"
          />
        </div>
      </div>
    </Card>
  );
}
