import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, Sparkles, X, type LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { aiAlerts } from '@/data/dashboard';
import { cn, timeAgo } from '@/lib/utils';
import type { AlertSeverity } from '@/types';

const severity: Record<AlertSeverity, { icon: LucideIcon; wrap: string; icn: string; btn: string }> = {
  critical: { icon: AlertOctagon, wrap: 'border-red-200 bg-red-50/60', icn: 'text-red-500', btn: 'text-red-700 hover:bg-red-100' },
  warning: { icon: AlertTriangle, wrap: 'border-amber-200 bg-amber-50/60', icn: 'text-amber-500', btn: 'text-amber-700 hover:bg-amber-100' },
  info: { icon: Info, wrap: 'border-sky-200 bg-sky-50/60', icn: 'text-sky-500', btn: 'text-sky-700 hover:bg-sky-100' },
};

const actionRoute: Record<string, string> = {
  'al-1': '/inventory?status=expired',
  'al-2': '/inventory?status=low_stock',
  'al-3': '/inventory?status=expiring_soon',
  'al-4': '/demand-forecasting',
};

export default function AiAlerts() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = aiAlerts.filter((a) => !dismissed.includes(a.id));

  return (
    <Card
      title="AI alerts"
      subtitle="Insights from SmartStock AI"
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
          <Sparkles className="h-3.5 w-3.5" /> {visible.length} active
        </span>
      }
      bodyClassName="space-y-3 p-5"
    >
      {visible.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="All clear" description="No AI alerts right now. We'll notify you when something needs attention." />
      ) : (
        visible.map((a) => {
          const s = severity[a.severity];
          const Icon = s.icon;
          return (
            <div key={a.id} className={cn('relative rounded-xl border p-4', s.wrap)}>
              <button
                onClick={() => setDismissed((d) => [...d, a.id])}
                className="absolute right-2.5 top-2.5 rounded p-1 text-slate-400 hover:bg-white/70 hover:text-slate-600"
                aria-label="Dismiss alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex gap-3 pr-5">
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.icn)} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{a.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => navigate(actionRoute[a.id] ?? '/inventory')}
                      className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold transition', s.btn)}
                    >
                      {a.action} →
                    </button>
                    <span className="text-xs text-slate-400">{timeAgo(a.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </Card>
  );
}
