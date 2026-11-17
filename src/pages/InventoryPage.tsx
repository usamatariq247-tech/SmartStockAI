import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, ChevronDown, ChevronLeft, ChevronRight, Clock, Package, Plus, RotateCcw, Search, SearchX, TrendingDown, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { statusLabels } from '@/components/ui/StatusBadge';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryFormModal from '@/components/inventory/InventoryFormModal';
import InventoryDetailsModal from '@/components/inventory/InventoryDetailsModal';
import { useInventory } from '@/context/InventoryContext';
import { useToast } from '@/context/ToastContext';
import { categories } from '@/data/products';
import { cn, daysUntil, formatNumber, getStockStatus } from '@/lib/utils';
import type { InventoryFormValues, InventoryItem, StockStatus } from '@/types';

const PAGE_SIZE = 8;
const statusOptions = Object.keys(statusLabels) as StockStatus[];

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Box; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', tone)}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-[28px] font-bold leading-tight tracking-tight text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { items, loading, addItem, updateItem, deleteItem, resetDemoData } = useInventory();
  const { notify } = useToast();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? 'all');
  const [status, setStatus] = useState<StockStatus | 'all'>((params.get('status') as StockStatus) ?? 'all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [viewing, setViewing] = useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = useState<InventoryItem | null>(null);

  // Sync filters when the URL changes (e.g. from topbar search or dashboard links)
  useEffect(() => {
    setSearch(params.get('q') ?? '');
    setCategory(params.get('category') ?? 'all');
    const s = params.get('status');
    setStatus(s && statusOptions.includes(s as StockStatus) ? (s as StockStatus) : 'all');
    if (params.get('new') === '1') {
      setEditing(null);
      setFormOpen(true);
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  useEffect(() => setPage(1), [search, category, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (category !== 'all' && i.category !== category) return false;
      if (status !== 'all' && getStockStatus(i) !== status) return false;
      if (!q) return true;
      return [i.productName, i.sku, i.barcode, i.batchNumber, i.location, i.category, i.supplier].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, search, category, status]);

  const stats = useMemo(
    () => ({
      lines: new Set(items.map((i) => i.productId)).size,
      units: items.filter((i) => daysUntil(i.expiryDate) >= 0).reduce((s, i) => s + i.quantity, 0),
      low: items.filter((i) => getStockStatus(i) === 'low_stock').length,
      expiring: items.filter((i) => ['expiring_soon', 'expired'].includes(getStockStatus(i))).length,
    }),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);
  const hasFilters = search !== '' || category !== 'all' || status !== 'all';

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setParams({}, { replace: true });
  }, [setParams]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (item: InventoryItem) => {
    setViewing(null);
    setEditing(item);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (values: InventoryFormValues) => {
    if (editing) {
      updateItem(editing.id, values);
      notify(`Updated batch ${values.batchNumber}.`);
    } else {
      addItem(values);
      notify(`Added ${values.productName} – batch ${values.batchNumber}.`);
    }
    closeForm();
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteItem(deleting.id);
    notify(`Deleted batch ${deleting.batchNumber}.`, 'info');
    setDeleting(null);
  };

  const batchNumbersForValidation = items.filter((i) => i.id !== editing?.id).map((i) => i.batchNumber);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[40px] sm:leading-tight">Inventory</h1>
          <p className="mt-1 text-lg text-slate-500">Track live stock from verified receiving and movement events.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              resetDemoData();
              notify('Demo data restored.', 'info');
            }}
          >
            Reset demo data
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>
            Add Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Product lines" value={formatNumber(stats.lines)} tone="bg-teal-50 text-teal-600" />
        <StatCard icon={Box} label="Available units" value={formatNumber(stats.units)} tone="bg-teal-50 text-teal-600" />
        <StatCard icon={TrendingDown} label="Low stock" value={formatNumber(stats.low)} tone="bg-amber-50 text-amber-600" />
        <StatCard icon={Clock} label="Expiring / expired" value={formatNumber(stats.expiring)} tone="bg-red-50 text-red-500" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        {/* Filters */}
        <div className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SKU, barcode or batch..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-ink focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 lg:w-48"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StockStatus | 'all')}
              aria-label="Filter by stock status"
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-ink focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 lg:w-48"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>

        {/* Table / empty state */}
        {!loading && filtered.length === 0 ? (
          items.length === 0 ? (
            <EmptyState
              icon={Box}
              title="No inventory yet"
              description="Add your first batch to start tracking stock levels."
              action={<Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Inventory</Button>}
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No matching inventory"
              description="Try a different search term or clear your filters."
              action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          )
        ) : (
          <InventoryTable items={pageItems} loading={loading} onView={setViewing} onEdit={openEdit} onDelete={setDeleting} />
        )}

        {/* Footer / pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              {from}–{to} of {filtered.length} record{filtered.length === 1 ? '' : 's'}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} icon={<ChevronLeft className="h-4 w-4" />}>
                  Prev
                </Button>
                <span className="px-2 text-sm text-slate-500">
                  Page {safePage} / {totalPages}
                </span>
                <Button variant="secondary" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <InventoryFormModal
        open={formOpen}
        item={editing}
        existingBatchNumbers={batchNumbersForValidation}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
      <InventoryDetailsModal item={viewing} onClose={() => setViewing(null)} onEdit={openEdit} onDelete={(i) => { setViewing(null); setDeleting(i); }} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete inventory record?"
        message={deleting ? `Batch ${deleting.batchNumber} (${deleting.productName}) will be permanently removed from inventory.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
