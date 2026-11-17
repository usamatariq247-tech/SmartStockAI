import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { locations, products, suppliers } from '@/data/products';
import { isoDateFromToday, cn } from '@/lib/utils';
import type { InventoryFormValues, InventoryItem } from '@/types';

interface InventoryFormModalProps {
  open: boolean;
  /** When provided the modal edits this item; otherwise it creates a new one. */
  item?: InventoryItem | null;
  existingBatchNumbers: string[];
  onClose: () => void;
  onSubmit: (values: InventoryFormValues) => void;
}

type FormState = {
  productId: string;
  batchNumber: string;
  quantity: string;
  minLevel: string;
  location: string;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  productId: '',
  batchNumber: '',
  quantity: '',
  minLevel: '100',
  location: '',
  supplier: '',
  receivedDate: isoDateFromToday(0),
  expiryDate: '',
  notes: '',
});

function fromItem(item: InventoryItem): FormState {
  return {
    productId: item.productId,
    batchNumber: item.batchNumber,
    quantity: String(item.quantity),
    minLevel: String(item.minLevel),
    location: item.location,
    supplier: item.supplier,
    receivedDate: item.receivedDate,
    expiryDate: item.expiryDate,
    notes: item.notes ?? '',
  };
}

export default function InventoryFormModal({ open, item, existingBatchNumbers, onClose, onSubmit }: InventoryFormModalProps) {
  const isEdit = !!item;
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<Errors>({});

  // Reset the form whenever the modal opens
  useEffect(() => {
    if (open) {
      setForm(item ? fromItem(item) : emptyForm());
      setErrors({});
    }
  }, [open, item]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.productId) e.productId = 'Select a product.';

    const batch = form.batchNumber.trim();
    if (!batch) e.batchNumber = 'Batch number is required.';
    else if (!/^[A-Za-z0-9-]{4,}$/.test(batch)) e.batchNumber = 'Use letters, numbers and dashes (min 4 chars).';
    else if (existingBatchNumbers.some((b) => b.toLowerCase() === batch.toLowerCase())) e.batchNumber = 'This batch number already exists.';

    const qty = Number(form.quantity);
    if (form.quantity === '') e.quantity = 'Quantity is required.';
    else if (!Number.isInteger(qty) || qty < 0) e.quantity = 'Enter a whole number (0 or more).';

    const min = Number(form.minLevel);
    if (form.minLevel === '') e.minLevel = 'Reorder level is required.';
    else if (!Number.isInteger(min) || min < 0) e.minLevel = 'Enter a whole number (0 or more).';

    if (!form.location) e.location = 'Select a storage location.';
    if (!form.supplier) e.supplier = 'Select a supplier.';
    if (!form.receivedDate) e.receivedDate = 'Received date is required.';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required.';
    else if (form.receivedDate && form.expiryDate < form.receivedDate) e.expiryDate = 'Expiry must be after the received date.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const product = products.find((p) => p.id === form.productId)!;
    onSubmit({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category,
      unit: product.unit,
      batchNumber: form.batchNumber.trim().toUpperCase(),
      quantity: Number(form.quantity),
      minLevel: Number(form.minLevel),
      location: form.location,
      supplier: form.supplier,
      receivedDate: form.receivedDate,
      expiryDate: form.expiryDate,
      notes: form.notes.trim() || undefined,
    });
  };

  const selectedProduct = products.find((p) => p.id === form.productId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Edit inventory' : 'Add inventory'}
      description={isEdit ? `Update batch ${item?.batchNumber}` : 'Receive a new batch into the warehouse.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="inventory-form">
            {isEdit ? 'Save changes' : 'Add inventory'}
          </Button>
        </>
      }
    >
      <form id="inventory-form" onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <Field label="Product" htmlFor="productId" required error={errors.productId} className="sm:col-span-2">
          <select
            id="productId"
            value={form.productId}
            onChange={(e) => set('productId', e.target.value)}
            className={cn('input-base', errors.productId && 'input-error')}
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className="pt-1 text-xs text-slate-500">
              Category: <b>{selectedProduct.category}</b> · Barcode: <span className="font-mono">{selectedProduct.barcode}</span>
            </p>
          )}
        </Field>

        <Field label="Batch number" htmlFor="batchNumber" required error={errors.batchNumber}>
          <input
            id="batchNumber"
            value={form.batchNumber}
            onChange={(e) => set('batchNumber', e.target.value)}
            placeholder="BT-2611-A02"
            className={cn('input-base font-mono uppercase', errors.batchNumber && 'input-error')}
          />
        </Field>

        <Field label="Supplier" htmlFor="supplier" required error={errors.supplier}>
          <select
            id="supplier"
            value={form.supplier}
            onChange={(e) => set('supplier', e.target.value)}
            className={cn('input-base', errors.supplier && 'input-error')}
          >
            <option value="">Select a supplier…</option>
            {suppliers.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label={`Quantity${selectedProduct ? ` (${selectedProduct.unit})` : ''}`} htmlFor="quantity" required error={errors.quantity}>
          <input
            id="quantity"
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
            placeholder="0"
            className={cn('input-base', errors.quantity && 'input-error')}
          />
        </Field>

        <Field label="Reorder level" htmlFor="minLevel" required error={errors.minLevel} hint="Flagged as low stock at or below this quantity.">
          <input
            id="minLevel"
            type="number"
            min={0}
            value={form.minLevel}
            onChange={(e) => set('minLevel', e.target.value)}
            className={cn('input-base', errors.minLevel && 'input-error')}
          />
        </Field>

        <Field label="Storage location" htmlFor="location" required error={errors.location} className="sm:col-span-2">
          <select
            id="location"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            className={cn('input-base', errors.location && 'input-error')}
          >
            <option value="">Select a location…</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="Received date" htmlFor="receivedDate" required error={errors.receivedDate}>
          <input
            id="receivedDate"
            type="date"
            value={form.receivedDate}
            onChange={(e) => set('receivedDate', e.target.value)}
            className={cn('input-base', errors.receivedDate && 'input-error')}
          />
        </Field>

        <Field label="Expiry date" htmlFor="expiryDate" required error={errors.expiryDate}>
          <input
            id="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
            className={cn('input-base', errors.expiryDate && 'input-error')}
          />
        </Field>

        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Optional handling or storage notes"
            className="input-base resize-none"
          />
        </Field>
      </form>
    </Modal>
  );
}
