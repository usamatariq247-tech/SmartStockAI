import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useInventory } from '@/context/InventoryContext';
import { weeklyMovement } from '@/data/dashboard';
import { daysUntil, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

type View = 'category' | 'movement';

const tabs: { id: View; label: string }[] = [
  { id: 'category', label: 'By category' },
  { id: 'movement', label: 'Weekly movement' },
];

export default function InventoryOverviewChart() {
  const { items, loading } = useInventory();
  const [view, setView] = useState<View>('category');

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    items
      .filter((i) => daysUntil(i.expiryDate) >= 0)
      .forEach((i) => map.set(i.category, (map.get(i.category) ?? 0) + i.quantity));
    return Array.from(map, ([category, units]) => ({ category, units })).sort((a, b) => b.units - a.units);
  }, [items]);

  return (
    <Card
      title="Inventory overview"
      subtitle="Stock levels across all warehouses"
      action={
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                view === t.id ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
      bodyClassName="p-6"
    >
      <div className="h-72 w-full">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : view === 'category' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCategory} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                formatter={(v: number) => [`${formatNumber(v)} units`, 'In stock']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
              />
              <Bar dataKey="units" fill="#168a86" radius={[8, 8, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyMovement} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#168a86" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#168a86" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a4a70" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2a4a70" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="inbound" name="Inbound" stroke="#168a86" strokeWidth={2.5} fill="url(#gIn)" />
              <Area type="monotone" dataKey="outbound" name="Outbound" stroke="#2a4a70" strokeWidth={2.5} fill="url(#gOut)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
