import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, ChevronRight, LogOut, Menu, Search, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { findNavItem } from '@/data/navigation';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export default function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const current = findNavItem(pathname);

  // Close user menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Ctrl/⌘ + K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
      e.currentTarget.value = '';
      e.currentTarget.blur();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            onKeyDown={handleSearch}
            placeholder="Search products, batches, locations..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-14 text-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 sm:block">
            ⌘ K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold uppercase text-white">
                {user?.name.charAt(0)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold capitalize leading-tight text-ink">{user?.name}</span>
                <span className="block text-xs leading-tight text-slate-500">{user?.role}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 animate-pop-in rounded-2xl border border-slate-200 bg-white p-1.5 shadow-pop">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-sm font-semibold capitalize text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle className="h-4 w-4" /> Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb row */}
      <div className="flex h-12 items-center gap-2 border-t border-slate-100 px-4 text-sm sm:px-6">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-700">
          SmartStock AI
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-400" />
        <span className="font-semibold text-ink">{current?.label ?? 'Page'}</span>
      </div>
    </header>
  );
}
