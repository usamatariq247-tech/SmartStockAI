import type { ReactElement } from 'react';
import DashboardPage from '@/pages/DashboardPage';
import InventoryPage from '@/pages/InventoryPage';

/**
 * Maps a route path to its page component.
 *
 * PHASE 2+: import the new page and add it here, then set
 * `implemented: true` for the matching item in `src/data/navigation.ts`.
 * Any nav item without an entry here renders <PlaceholderPage />.
 */
export const pageRegistry: Record<string, ReactElement> = {
  '/dashboard': <DashboardPage />,
  '/inventory': <InventoryPage />,
};
