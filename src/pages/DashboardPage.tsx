import { useMemo } from 'react';
import { Box, Clock, Layers, Package, TrendingDown } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import InventoryOverviewChart from '@/components/dashboard/InventoryOverviewChart';
import RecentMovementsTable from '@/components/dashboard/RecentMovementsTable';
import RecentActivities from '@/components/dashboard/RecentActivities';
import AiAlerts from '@/components/dashboard/AiAlerts';
import QuickActions from '@/components/dashboard/QuickActions';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { daysUntil, EXPIRY_WARNING_DAYS, formatDateLong, formatNumber, getStockStatus, isLowStock } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { items, loading } = useInventory();

  const kpis = useMemo(() => {
    const active = items.filter((i) => daysUntil(i.expiryDate) >= 0);
    return {
      products: new Set(items.map((i) => i.productId)).size,
      batches: items.length,
      units: active.reduce((sum, i) => sum + i.quantity, 0),
      low: items.filter(isLowStock).length,
      expiring: items.filter((i) => getStockStatus(i) === 'expiring_soon').length,
    };
  }, [items]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[17px] text-slate-500">{formatDateLong(new Date())}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-[40px] sm:leading-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1.5 text-lg text-slate-500">Here&apos;s what&apos;s happening across your supply chain.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Products" value={formatNumber(kpis.products)} caption="Catalog lines" icon={Package} tone="slate" to="/inventory" loading={loading} />
        <KpiCard label="Total Batches" value={formatNumber(kpis.batches)} caption="Tracked batches" icon={Layers} tone="navy" to="/inventory" loading={loading} />
        <KpiCard label="Total Stock" value={formatNumber(kpis.units)} caption="Available units" icon={Box} tone="teal" to="/inventory" loading={loading} />
        <KpiCard label="Low Stock" value={formatNumber(kpis.low)} caption="Below reorder level" icon={TrendingDown} tone="amber" to="/inventory?status=low_stock" loading={loading} />
        <KpiCard label="Expiring Soon" value={formatNumber(kpis.expiring)} caption={`Next ${EXPIRY_WARNING_DAYS} days`} icon={Clock} tone="red" to="/inventory?status=expiring_soon" loading={loading} />
      </div>

      <section aria-label="Quick actions">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Quick actions</h2>
        <QuickActions />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InventoryOverviewChart />
        </div>
        <AiAlerts />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentMovementsTable />
        </div>
        <RecentActivities />
      </div>
    </div>
  );
}
