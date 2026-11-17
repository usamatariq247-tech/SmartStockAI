import {
  ArrowLeftRight,
  BarChart3,
  Box,
  Building2,
  Camera,
  GitBranch,
  Layers,
  LayoutGrid,
  Link2,
  MapPin,
  Package,
  Scan,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Pages built in the current phase. Others render a placeholder page. */
  implemented: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Single source of truth for the sidebar AND the router.
 * To add a new page in a later phase:
 *   1. Create the page component in /src/pages
 *   2. Flip `implemented` to true here
 *   3. Map the path to the component in /src/routes/pageRegistry.tsx
 */
export const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: '/dashboard', icon: LayoutGrid, implemented: true }],
  },
  {
    title: 'Inventory',
    items: [
      { label: 'Inventory', path: '/inventory', icon: Box, implemented: true },
      { label: 'Products', path: '/products', icon: Package, implemented: false },
      { label: 'Batches', path: '/batches', icon: Layers, implemented: false },
      { label: 'Locations', path: '/locations', icon: MapPin, implemented: false },
      { label: 'Stock Movements', path: '/stock-movements', icon: ArrowLeftRight, implemented: false },
    ],
  },
  {
    title: 'AI Operations',
    items: [
      { label: 'Live Monitoring', path: '/live-monitoring', icon: Camera, implemented: false },
      { label: 'AI Detection', path: '/ai-detection', icon: Scan, implemented: false },
      { label: 'Demand Forecasting', path: '/demand-forecasting', icon: TrendingUp, implemented: false },
      { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, implemented: false },
    ],
  },
  {
    title: 'Traceability',
    items: [
      { label: 'Blockchain Records', path: '/blockchain-records', icon: Link2, implemented: false },
      { label: 'Batch Traceability', path: '/batch-traceability', icon: GitBranch, implemented: false },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', path: '/users', icon: Users, implemented: false },
      { label: 'Organizations', path: '/organizations', icon: Building2, implemented: false },
      { label: 'Reports', path: '/reports', icon: BarChart3, implemented: false },
      { label: 'Settings', path: '/settings', icon: Settings, implemented: false },
    ],
  },
];

export const allNavItems: NavItem[] = navSections.flatMap((s) => s.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return allNavItems.find((i) => pathname === i.path || pathname.startsWith(`${i.path}/`));
}
