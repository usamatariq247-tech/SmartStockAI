import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for doesn&apos;t exist.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
