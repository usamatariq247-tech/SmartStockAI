import type { StockStatus } from '@/types';
import { cn } from '@/lib/utils';

const config: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  in_stock: { label: 'In Stock', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', dot: 'bg-emerald-500' },
  low_stock: { label: 'Low Stock', classes: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
  expiring_soon: { label: 'Expiring Soon', classes: 'bg-orange-50 text-orange-700 ring-orange-600/20', dot: 'bg-orange-500' },
  expired: { label: 'Expired', classes: 'bg-red-50 text-red-700 ring-red-600/20', dot: 'bg-red-500' },
  out_of_stock: { label: 'Out of Stock', classes: 'bg-slate-100 text-slate-600 ring-slate-500/20', dot: 'bg-slate-400' },
};

export const statusLabels: Record<StockStatus, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  expiring_soon: 'Expiring Soon',
  expired: 'Expired',
  out_of_stock: 'Out of Stock',
};

export default function StatusBadge({ status, className }: { status: StockStatus; className?: string }) {
  const c = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        c.classes,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
