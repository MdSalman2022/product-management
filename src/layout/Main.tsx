import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Shared/Header';

const { Content } = Layout;

export default function Main() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content className="bg-slate-50">
        <div className="mx-auto w-full max-w-7xl p-2 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
