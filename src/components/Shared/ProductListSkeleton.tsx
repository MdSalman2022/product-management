import { Card } from 'antd';

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className ?? ''}`} style={style} />
  );
}

function SkeletonHeaderRow() {
  return (
    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2.5 gap-4">
      <Shimmer style={{ width: 56, height: 12, flexShrink: 0 }} />
      <div className="flex-1" />
      <Shimmer className="hidden lg:block" style={{ width: 52, height: 12, flexShrink: 0 }} />
      <Shimmer className="hidden lg:block" style={{ width: 44, height: 12, flexShrink: 0 }} />
      <Shimmer className="hidden xl:block" style={{ width: 64, height: 12, flexShrink: 0 }} />
      <Shimmer style={{ width: 48, height: 12, flexShrink: 0 }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center border-b border-gray-100 px-4 py-3 gap-4">
      <div className="flex items-center gap-3" style={{ width: 220, minWidth: 0, flexShrink: 0 }}>
        <Shimmer style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 6 }} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Shimmer style={{ width: '70%', height: 14 }} />
          <Shimmer style={{ width: '45%', height: 12 }} />
        </div>
      </div>
      <div className="flex-1" />
      <Shimmer style={{ width: 60, height: 14, flexShrink: 0 }} />
      <Shimmer className="hidden lg:block" style={{ width: 96, height: 14, flexShrink: 0 }} />
      <Shimmer
        className="hidden lg:block"
        style={{ width: 64, height: 22, flexShrink: 0, borderRadius: 10 }}
      />
      <Shimmer
        className="hidden xl:block"
        style={{ width: 72, height: 22, flexShrink: 0, borderRadius: 10 }}
      />
      <Shimmer style={{ width: 52, height: 28, borderRadius: 6, flexShrink: 0 }} />
    </div>
  );
}

export default function ProductListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Card
      bordered={false}
      className="shadow-sm"
      styles={{ body: { padding: '0' }, header: { padding: '0 16px' } }}
      title={
        <div className="flex items-center justify-between py-1">
          <Shimmer style={{ width: 100, height: 22 }} />
          <Shimmer style={{ width: 60, height: 16 }} />
        </div>
      }
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row">
        <Shimmer style={{ height: 32, borderRadius: 6, flex: 1, maxWidth: 360 }} />
        <Shimmer style={{ height: 32, borderRadius: 6, width: 160 }} />
      </div>

      <SkeletonHeaderRow />

      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}

      <div className="flex justify-end gap-2 px-4 py-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Shimmer key={i} style={{ width: 32, height: 32, borderRadius: 6 }} />
        ))}
      </div>
    </Card>
  );
}
