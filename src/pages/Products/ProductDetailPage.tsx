import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Tag,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Rate,
  Badge,
  Carousel,
} from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { Pencil } from 'lucide-react';
import { useProductById, useCategories } from '@/hooks/useProducts';
import { usePageHeader } from '@/context/PageHeaderContext';
import PageSpinner from '@/components/Shared/PageSpinner';
import PageError from '@/components/Shared/PageError';
import type { ProductFormValues } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);
  const [form] = Form.useForm<ProductFormValues>();
  const { setHeader, resetHeader } = usePageHeader();

  const { data: product, isLoading, error } = useProductById(Number(id));
  const { data: categories = [] } = useCategories();

  const openEditDrawer = useCallback(() => {
    if (!product) return;
    form.setFieldsValue({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail,
    });
    setDrawerOpen(true);
  }, [product, form]);

  useEffect(() => {
    if (!product || error) {
      resetHeader();
      return;
    }
    setHeader({
      title: product.title,
      onBack: () => navigate(-1),
      extra: (
        <Button
          type="primary"
          icon={<Pencil size={14} />}
          onClick={openEditDrawer}
          className="flex items-center shadow-sm"
        >
          <span className="hidden sm:inline">Edit Product</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      ),
    });
    return () => resetHeader();
  }, [product, error, openEditDrawer, navigate, setHeader, resetHeader]);

  function handleFormSubmit(values: ProductFormValues) {
    console.log('Updated values:', values);
    setDrawerOpen(false);
  }

  if (isLoading) {
    return <PageSpinner />;
  }

  if (error || !product) {
    return (
      <PageError
        status="404"
        title="Product not found"
        subTitle="This product could not be loaded."
      />
    );
  }

  const stockStatus = product.stock > 50 ? 'success' : product.stock > 10 ? 'warning' : 'error';
  const stockLabel =
    product.stock > 50 ? 'In Stock' : product.stock > 10 ? 'Low Stock' : 'Critical';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Images */}
        <Card bordered={false} className="shadow-sm" styles={{ body: { padding: '12px' } }}>
          <Carousel
            ref={carouselRef}
            dots={false}
            draggable
            afterChange={(i) => setActiveSlide(i)}
            className="product-carousel overflow-hidden rounded-lg"
          >
            {product.images.map((img, i) => (
              <div key={i}>
                <img
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 8 }}
                />
              </div>
            ))}
          </Carousel>

          {/* Thumbnail strip */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {product.images.map((img, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => {
                  carouselRef.current?.goTo(i);
                  setActiveSlide(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    carouselRef.current?.goTo(i);
                    setActiveSlide(i);
                  }
                }}
                className={`flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 cursor-pointer select-none outline-none ${
                  activeSlide === i ? 'brightness-100' : 'brightness-75 hover:brightness-90'
                }`}
                style={{ width: 64, height: 64 }}
              >
                <img
                  src={img}
                  alt={`thumb ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Details */}
        <Card bordered={false} className="shadow-sm" styles={{ body: { padding: '20px' } }}>
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Tag color="blue" className="m-0">
                  {product.category}
                </Tag>
                <Badge status={stockStatus} text={stockLabel} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl leading-tight">
                {product.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                by <span className="font-medium">{product.brand}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Rate
                disabled
                allowHalf
                defaultValue={product.rating}
                className="text-sm sm:text-base text-yellow-500"
              />
              <span className="text-sm font-medium text-gray-600">
                {product.rating.toFixed(1)} / 5
              </span>
            </div>

            <p className="text-[15px] leading-relaxed text-gray-600">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-3 text-center transition-colors hover:bg-gray-100">
                <span className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Price
                </span>
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                <span className="mb-1 text-xs font-medium tracking-wider text-emerald-600 uppercase">
                  Discount
                </span>
                <span className="text-lg font-bold text-emerald-700">
                  {product.discountPercentage}%
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-3 text-center transition-colors hover:bg-gray-100">
                <span className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Stock
                </span>
                <span className="text-lg font-semibold text-gray-900">{product.stock} units</span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-3 text-center transition-colors hover:bg-gray-100">
                <span className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Brand
                </span>
                <span
                  className="text-sm font-semibold text-gray-900 line-clamp-2"
                  title={product.brand}
                >
                  {product.brand}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Drawer
        title="Edit Product"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width="100%"
        styles={{
          wrapper: { maxWidth: 480 },
          body: { padding: '20px 16px', paddingBottom: '10px' },
        }}
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setDrawerOpen(false)} className="h-10 text-base">
              Cancel
            </Button>
            <Button type="primary" onClick={() => form.submit()} className="h-10 text-base">
              Save Changes
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Title is required' },
              { min: 3, message: 'At least 3 characters' },
              { max: 150, message: 'Cannot exceed 150 characters' },
              {
                validator: (_, value) =>
                  !value || value.trim().length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error('Title cannot be blank spaces')),
              },
            ]}
          >
            <Input className="h-10 text-base" showCount maxLength={150} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description is required' },
              { min: 10, message: 'At least 10 characters' },
              { max: 1000, message: 'Cannot exceed 1000 characters' },
            ]}
          >
            <Input.TextArea rows={5} className="text-base" showCount maxLength={1000} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 0.01, message: 'Must be greater than $0' },
              { type: 'number', max: 1_000_000, message: 'Cannot exceed $1,000,000' },
            ]}
          >
            <InputNumber
              className="h-10 w-full text-base"
              min={0.01}
              max={1_000_000}
              precision={2}
              prefix="$"
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: 'Stock is required' },
              { type: 'number', min: 0, message: 'Cannot be negative' },
              { type: 'number', max: 100_000, message: 'Cannot exceed 100,000 units' },
            ]}
          >
            <InputNumber className="h-10 w-full text-base" min={0} max={100_000} precision={0} />
          </Form.Item>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[
              { required: true, message: 'Brand is required' },
              { min: 2, message: 'At least 2 characters' },
              { max: 80, message: 'Cannot exceed 80 characters' },
            ]}
          >
            <Input className="h-10 text-base" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              options={categories.map((cat) => ({ label: cat, value: cat }))}
              placeholder="Select a category"
            />
          </Form.Item>
          <Form.Item
            name="thumbnail"
            label="Thumbnail URL"
            rules={[
              { required: true, message: 'URL is required' },
              { type: 'url', message: 'Enter a valid URL (must start with http/https)' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i;
                  const knownImageHosts = /cdn\.|images\.|img\.|assets\.|media\./i;
                  if (imageExtensions.test(value) || knownImageHosts.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('URL should point to an image file'));
                },
              },
            ]}
          >
            <Input className="h-10 text-base" placeholder="https://..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
