import { Card } from 'antd';

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ''}`} style={style} />
  );
}

export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card bordered={false} className="shadow-sm" styles={{ body: { padding: '12px' } }}>
          <Shimmer style={{ width: '100%', height: 320 }} />
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 6 }} />
            ))}
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm" styles={{ body: { padding: '20px' } }}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Shimmer style={{ width: 80, height: 24, borderRadius: 12 }} />
              <Shimmer style={{ width: 64, height: 24, borderRadius: 12 }} />
            </div>
            <Shimmer style={{ width: '72%', height: 28 }} />
            <Shimmer style={{ width: '40%', height: 16 }} />
            <Shimmer style={{ width: 160, height: 20 }} />
            <div className="space-y-2">
              <Shimmer style={{ width: '100%', height: 14 }} />
              <Shimmer style={{ width: '95%', height: 14 }} />
              <Shimmer style={{ width: '80%', height: 14 }} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Shimmer key={i} style={{ height: 72, borderRadius: 12 }} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
