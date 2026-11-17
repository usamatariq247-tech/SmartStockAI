import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

type Tone = 'slate' | 'teal' | 'red' | 'amber' | 'navy';

interface KpiCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone?: Tone;
  to?: string;
  loading?: boolean;
}

const iconTone: Record<Tone, string> = {
  slate: 'bg-slate-100 text-navy-700',
  teal: 'bg-teal-50 text-teal-600',
  red: 'bg-red-50 text-red-500',
  amber: 'bg-amber-50 text-amber-600',
  navy: 'bg-navy-50 text-navy-600',
};

const captionTone: Record<Tone, string> = {
  slate: 'text-teal-700',
  teal: 'text-teal-700',
  red: 'text-red-600',
  amber: 'text-amber-600',
  navy: 'text-teal-700',
};

export default function KpiCard({ label, value, caption, icon: Icon, tone = 'teal', to, loading }: KpiCardProps) {
  const body = (
    <div
      className={cn(
        'h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition',
        to && 'hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md',
      )}
    >
      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconTone[tone])}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <p className="mt-5 text-[15px] text-slate-500">{label}</p>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-9 w-24" />
          <Skeleton className="mt-3 h-4 w-28" />
        </>
      ) : (
        <>
          <p className="mt-1 text-[34px] font-bold leading-tight tracking-tight text-ink">{value}</p>
          <p className={cn('mt-2 text-[15px] font-medium', captionTone[tone])}>{caption}</p>
        </>
      )}
    </div>
  );

  return to ? <Link to={to}>{body}</Link> : body;
}
