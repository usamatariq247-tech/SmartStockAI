import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Hide the wordmark (used when the sidebar is collapsed). */
  iconOnly?: boolean;
  className?: string;
}

export default function Logo({ iconOnly, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-900/30">
        <Layers className="h-5 w-5" strokeWidth={2.25} />
      </div>
      {!iconOnly && (
        <span className="text-[22px] font-bold leading-none tracking-tight text-white">
          SmartStock
          <sup className="ml-0.5 align-super text-[11px] font-semibold text-teal-300">AI</sup>
        </span>
      )}
    </div>
  );
}
