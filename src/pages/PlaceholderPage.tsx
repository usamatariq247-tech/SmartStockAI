import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PlaceholderPageProps {
  title: string;
  icon: LucideIcon;
}

/** Shown for sidebar items whose pages are planned for a later phase. */
export default function PlaceholderPage({ title, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
        <Icon className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 flex items-center gap-2 text-slate-500">
        <Hammer className="h-4 w-4" /> This page will be built in an upcoming phase.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
