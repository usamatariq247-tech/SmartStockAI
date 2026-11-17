import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { navSections } from '@/data/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapsed, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 animate-fade-in bg-navy-950/50 lg:hidden" onClick={onCloseMobile} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-navy-800 text-slate-300 transition-all duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'lg:w-[76px]' : 'lg:w-60',
        )}
      >
        {/* Brand row */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/5 px-4">
          <Logo iconOnly={collapsed} className={cn(collapsed && 'lg:mx-auto')} />
          <button
            onClick={() => {
              onToggleCollapsed();
              onCloseMobile();
            }}
            className={cn(
              'rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white',
              collapsed && 'lg:hidden',
            )}
            aria-label="Toggle sidebar"
          >
            <Menu className="hidden h-5 w-5 lg:block" />
            <X className="h-5 w-5 lg:hidden" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scroll-thin flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p
                className={cn(
                  'mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400/80',
                  collapsed && 'lg:hidden',
                )}
              >
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition',
                            collapsed && 'lg:justify-center lg:px-0',
                            isActive
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-950/30'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white',
                          )
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                        <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
