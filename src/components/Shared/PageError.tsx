import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface PageErrorProps {
  status?: '404' | '500' | 'error';
  title?: string;
  subTitle?: string;
  onBack?: () => void;
}

export default function PageError({
  title = 'Something went wrong',
  subTitle = 'An unexpected error occurred. Please try again.',
  onBack,
}: PageErrorProps) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="rounded-full bg-red-50 p-4">
        <AlertCircle className="text-red-500" size={40} />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subTitle}</p>
      </div>
      <Button type="primary" onClick={onBack ?? (() => navigate(-1))} className="h-10 px-6">
        Go back
      </Button>
    </div>
  );
}
