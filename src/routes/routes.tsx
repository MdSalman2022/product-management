import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Main from '@/layout/Main';

const ProductListPage = lazy(() => import('@/pages/Products/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/Products/ProductDetailPage'));

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <Spin size="large" />
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductListPage />
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductDetailPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
