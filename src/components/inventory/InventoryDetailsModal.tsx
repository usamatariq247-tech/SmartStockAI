import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { daysUntil, formatDate, formatNumber, getStockStatus } from '@/lib/utils';
import type { InventoryItem } from '@/types';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}

export default function InventoryDetailsModal({ item, onClose, onEdit, onDelete }: Props) {
  const status = item ? getStockStatus(item) : 'in_stock';
  const days = item ? daysUntil(item.expiryDate) : 0;

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      title={item?.productName ?? ''}
      description={item ? `Batch ${item.batchNumber}` : undefined}
      footer={
        item && (
          <>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(item)} className="sm:mr-auto">
              Delete
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(item)}>
              Edit
            </Button>
          </>
        )
      }
    >
      {item && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status} />
            <span className="text-sm text-slate-500">
              {days < 0 ? `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago` : days === 0 ? 'Expires today' : `Expires in ${days} day${days === 1 ? '' : 's'}`}
            </span>
          </div>

          {(status === 'expired' || status === 'low_stock' || status === 'expiring_soon') && (
            <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {status === 'expired' && 'This batch has expired. Quarantine it and follow your disposal SOP.'}
              {status === 'low_stock' && `Quantity is at or below the reorder level of ${formatNumber(item.minLevel)}. Consider replenishing.`}
              {status === 'expiring_soon' && 'This batch expires soon. Prioritise it for outbound orders (FEFO).'}
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Row label="SKU">
              <span className="font-mono">{item.sku}</span>
            </Row>
            <Row label="Barcode">
              <span className="font-mono">{item.barcode}</span>
            </Row>
            <Row label="Category">{item.category}</Row>
            <Row label="Batch number">
              <span className="font-mono">{item.batchNumber}</span>
            </Row>
            <Row label="Quantity">
              {formatNumber(item.quantity)} {item.unit}
            </Row>
            <Row label="Reorder level">{formatNumber(item.minLevel)}</Row>
            <Row label="Location">{item.location}</Row>
            <Row label="Supplier">{item.supplier}</Row>
            <Row label="Received">{formatDate(item.receivedDate)}</Row>
            <Row label="Expiry">{formatDate(item.expiryDate)}</Row>
          </dl>

          {item.notes && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Notes</p>
              <p className="mt-1 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
