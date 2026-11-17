import type { InventoryItem, StockStatus } from '@/types';

/** Merge class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const EXPIRY_WARNING_DAYS = 14;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Returns an ISO date (yyyy-mm-dd) offset from today by `days`. */
export function isoDateFromToday(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns an ISO datetime offset from now by the given minutes. */
export function isoDateTimeFromNow(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

/** Whole days from today until the given ISO date (negative if past). */
export function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`).getTime();
  return Math.round((target - startOfToday()) / 86_400_000);
}

export function getStockStatus(item: Pick<InventoryItem, 'quantity' | 'minLevel' | 'expiryDate'>): StockStatus {
  const days = daysUntil(item.expiryDate);
  if (days < 0) return 'expired';
  if (item.quantity <= 0) return 'out_of_stock';
  if (days <= EXPIRY_WARNING_DAYS) return 'expiring_soon';
  if (item.quantity <= item.minLevel) return 'low_stock';
  return 'in_stock';
}

export function isLowStock(item: InventoryItem): boolean {
  return daysUntil(item.expiryDate) >= 0 && item.quantity <= item.minLevel;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '—';
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(isoDateTime: string): string {
  const diffMin = Math.max(0, Math.round((Date.now() - new Date(isoDateTime).getTime()) / 60_000));
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const hours = Math.round(diffMin / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
