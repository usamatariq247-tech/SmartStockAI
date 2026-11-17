import { Bot, Link2, PackageCheck, Truck, UserPlus, ArrowLeftRight, type LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import { recentActivities } from '@/data/dashboard';
import { cn, timeAgo } from '@/lib/utils';
import type { ActivityKind } from '@/types';

const kindStyle: Record<ActivityKind, { icon: LucideIcon; classes: string }> = {
  receive: { icon: PackageCheck, classes: 'bg-emerald-50 text-emerald-600' },
  dispatch: { icon: Truck, classes: 'bg-navy-50 text-navy-600' },
  transfer: { icon: ArrowLeftRight, classes: 'bg-teal-50 text-teal-600' },
  ai: { icon: Bot, classes: 'bg-violet-50 text-violet-600' },
  user: { icon: UserPlus, classes: 'bg-amber-50 text-amber-600' },
  blockchain: { icon: Link2, classes: 'bg-sky-50 text-sky-600' },
};

export default function RecentActivities() {
  return (
    <Card title="Recent activities" subtitle="What your team did today" bodyClassName="px-6 py-5">
      <ol className="relative space-y-5">
        <span className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-200" aria-hidden />
        {recentActivities.map((a) => {
          const { icon: Icon, classes } = kindStyle[a.kind];
          return (
            <li key={a.id} className="relative flex gap-4">
              <span className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white', classes)}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{a.description}</p>
                <p className="mt-1 text-xs text-slate-400">{timeAgo(a.timestamp)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
