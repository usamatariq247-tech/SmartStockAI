import { useState } from 'react';
import { AlertTriangle, Box, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Skeleton from '@/components/ui/Skeleton';
import { cn, daysUntil, formatDate, formatNumber, getStockStatus } from '@/lib/utils';
import type { InventoryItem } from '@/types';

interface InventoryTableProps {
  items: InventoryItem[];
  loading: boolean;
  onView: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

function RowActions({ item, onView, onEdit, onDelete }: Omit<InventoryTableProps, 'items' | 'loading'> & { item: InventoryItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      {/* Desktop: inline icon buttons */}
      <div className="hidden items-center gap-1 sm:flex">
        <button onClick={() => onView(item)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-teal-700" title="View details" aria-label="View details">
          <Eye className="h-4 w-4" />
        </button>
        <button onClick={() => onEdit(item)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy-700" title="Edit" aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(item)} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" title="Delete" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile: overflow menu */}
      <div className="relative sm:hidden">
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Actions">
          <MoreVertical className="h-4 w-4" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-pop">
              <button onClick={() => { setOpen(false); onView(item); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                <Eye className="h-4 w-4" /> View
              </button>
              <button onClick={() => { setOpen(false); onEdit(item); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button onClick={() => { setOpen(false); onDelete(item); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function InventoryTable({ items, loading, onView, onEdit, onDelete }: InventoryTableProps) {
  return (
    <div className="scroll-thin relative overflow-x-auto">
      <table className="w-full min-w-[1240px]">
        <thead className="border-y border-slate-100 bg-slate-50/70">
          <tr>
            <th className="th-cell">Product</th>
            <th className="th-cell">SKU / Barcode</th>
            <th className="th-cell">Category</th>
            <th className="th-cell">Batch no.</th>
            <th className="th-cell text-right">Quantity</th>
            <th className="th-cell">Location</th>
            <th className="th-cell">Status</th>
            <th className="th-cell">Expiry date</th>
            <th className="th-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : items.map((item) => {
                const status = getStockStatus(item);
                const days = daysUntil(item.expiryDate);
                const expired = status === 'expired';
                const low = status === 'low_stock';
                return (
                  <tr
                    key={item.id}
                    onDoubleClick={() => onView(item)}
                    className={cn('transition hover:bg-slate-50/70', expired && 'bg-red-50/40 hover:bg-red-50/70')}
                  >
                    <td className="td-cell min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600">
                          <Box className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </span>
                        <span className="font-semibold text-ink">{item.productName}</span>
                      </div>
                    </td>
                    <td className="td-cell">
                      <p className="font-mono text-[13px] text-slate-700">{item.sku}</p>
                      <p className="font-mono text-xs text-slate-400">{item.barcode}</p>
                    </td>
                    <td className="td-cell">{item.category}</td>
                    <td className="td-cell font-mono text-[13px]">{item.batchNumber}</td>
                    <td className="td-cell text-right">
                      <span className={cn('inline-flex items-center gap-1.5 font-semibold', low ? 'text-amber-600' : expired ? 'text-red-600' : 'text-ink')}>
                        {(low || expired) && <AlertTriangle className="h-3.5 w-3.5" />}
                        {formatNumber(item.quantity)}
                      </span>
                      <span className="block text-xs text-slate-400">{item.unit}</span>
                    </td>
                    <td className="td-cell">{item.location}</td>
                    <td className="td-cell">
                      <StatusBadge status={status} />
                    </td>
                    <td className="td-cell whitespace-nowrap">
                      <span className={cn(expired && 'font-semibold text-red-600', status === 'expiring_soon' && 'font-semibold text-orange-600')}>
                        {formatDate(item.expiryDate)}
                      </span>
                      {(expired || status === 'expiring_soon') && (
                        <span className="block text-xs text-slate-400">
                          {expired ? `${Math.abs(days)}d ago` : `in ${days}d`}
                        </span>
                      )}
                    </td>
                    <td className="td-cell">
                      <RowActions item={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
