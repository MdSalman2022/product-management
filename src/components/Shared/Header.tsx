import { Layout, Typography, Button } from 'antd';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { usePageHeader } from '@/context/PageHeaderContext';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { header } = usePageHeader();
  const isProductPage = !!header.onBack;

  return (
    <AntHeader
      className="sticky top-0 z-50 flex items-center border-b border-slate-200 bg-white px-3 sm:px-6"
      style={{ height: 64 }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        {/* Left */}
        <div className="flex flex-1 items-center justify-start">
          {isProductPage ? (
            <Button
              icon={<ArrowLeft size={18} />}
              onClick={header.onBack}
              type="text"
              className="flex items-center text-slate-700 hover:text-blue-600"
            >
              <span className="hidden sm:inline font-medium text-base">Back</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} className="text-blue-600" />
              <Typography.Title
                level={4}
                style={{ margin: 0, color: '#1d4ed8' }}
                className="hidden sm:block"
              >
                Product Management
              </Typography.Title>
            </div>
          )}
        </div>

        {/* Center */}
        <div className="flex flex-[2] items-center justify-center overflow-hidden">
          {isProductPage ? (
            <Typography.Title
              level={5}
              style={{ margin: 0 }}
              className="truncate text-center w-full max-w-xs sm:max-w-md"
            >
              {header.title}
            </Typography.Title>
          ) : (
            <div className="flex items-center gap-2 sm:hidden">
              <Typography.Title level={5} style={{ margin: 0, color: '#1d4ed8' }}>
                Products
              </Typography.Title>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-1 items-center justify-end">{header.extra ?? null}</div>
      </div>
    </AntHeader>
  );
}
