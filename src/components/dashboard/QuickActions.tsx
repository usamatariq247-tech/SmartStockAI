import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, BarChart3, PackagePlus, ScanLine, type LucideIcon } from 'lucide-react';

interface Action {
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

const actions: Action[] = [
  { label: 'Add inventory', description: 'Receive a new batch', icon: PackagePlus, to: '/inventory?new=1' },
  { label: 'Stock movement', description: 'Transfer or dispatch', icon: ArrowLeftRight, to: '/stock-movements' },
  { label: 'Run AI detection', description: 'Scan live camera feed', icon: ScanLine, to: '/ai-detection' },
  { label: 'Generate report', description: 'Export stock summary', icon: BarChart3, to: '/reports' },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map(({ label, description, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">{label}</span>
            <span className="block text-xs text-slate-500">{description}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
