import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import { recentMovements } from '@/data/dashboard';
import { cn, formatNumber, timeAgo } from '@/lib/utils';
import type { MovementType } from '@/types';

const typeStyle: Record<MovementType, { icon: LucideIcon; classes: string }> = {
  Inbound: { icon: ArrowDownLeft, classes: 'bg-emerald-50 text-emerald-700' },
  Outbound: { icon: ArrowUpRight, classes: 'bg-navy-50 text-navy-700' },
  Transfer: { icon: ArrowLeftRight, classes: 'bg-teal-50 text-teal-700' },
  Adjustment: { icon: SlidersHorizontal, classes: 'bg-amber-50 text-amber-700' },
};

export default function RecentMovementsTable() {
  return (
    <Card
      title="Recent stock movements"
      subtitle="Latest receiving, dispatch and transfer events"
      action={
        <Link to="/stock-movements" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
          View all
        </Link>
      }
    >
      <div className="scroll-thin relative overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-50/70">
            <tr>
              <th className="th-cell">Reference</th>
              <th className="th-cell">Product / Batch</th>
              <th className="th-cell">Type</th>
              <th className="th-cell text-right">Qty</th>
              <th className="th-cell">From → To</th>
              <th className="th-cell">By</th>
              <th className="th-cell">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentMovements.map((m) => {
              const { icon: Icon, classes } = typeStyle[m.type];
              return (
                <tr key={m.id} className="transition hover:bg-slate-50/60">
                  <td className="td-cell font-mono text-xs text-slate-500">{m.reference}</td>
                  <td className="td-cell">
                    <p className="font-medium text-ink">{m.productName}</p>
                    <p className="font-mono text-xs text-slate-400">{m.batchNumber}</p>
                  </td>
                  <td className="td-cell">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', classes)}>
                      <Icon className="h-3.5 w-3.5" /> {m.type}
                    </span>
                  </td>
                  <td className={cn('td-cell text-right font-semibold', m.quantity < 0 ? 'text-red-600' : 'text-ink')}>
                    {m.quantity < 0 || m.type === 'Outbound' ? '-' : ''}
                    {formatNumber(Math.abs(m.quantity))}
                  </td>
                  <td className="td-cell text-xs text-slate-500">
                    <span className="block">{m.from}</span>
                    <span className="block text-slate-400">→ {m.to}</span>
                  </td>
                  <td className="td-cell">{m.performedBy}</td>
                  <td className="td-cell whitespace-nowrap text-slate-500">{timeAgo(m.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
