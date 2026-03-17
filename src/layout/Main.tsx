import { Outlet } from 'react-router-dom';
import Header from '@/components/Shared/Header';

export default function Main() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col bg-slate-50">
        <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
