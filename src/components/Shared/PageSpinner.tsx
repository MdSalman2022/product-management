import { Spin } from 'antd';

export default function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
