import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { InventoryFormValues, InventoryItem } from '@/types';
import { initialInventory } from '@/data/inventory';
import { uid } from '@/lib/utils';

const STORAGE_KEY = 'smartstock.inventory.v1';

interface InventoryContextValue {
  items: InventoryItem[];
  loading: boolean;
  addItem: (values: InventoryFormValues) => InventoryItem;
  updateItem: (id: string, values: InventoryFormValues) => void;
  deleteItem: (id: string) => void;
  resetDemoData: () => void;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

function readStored(): InventoryItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InventoryItem[]) : null;
  } catch {
    return null;
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(() => readStored() ?? initialInventory);
  const [loading, setLoading] = useState(true);

  // Simulate an initial data fetch so loading states are visible.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Persist changes so the demo survives a refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback((values: InventoryFormValues) => {
    const item: InventoryItem = { ...values, id: uid('inv') };
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const updateItem = useCallback((id: string, values: InventoryFormValues) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...values, id } : i)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const resetDemoData = useCallback(() => setItems(initialInventory), []);

  const value = useMemo(
    () => ({ items, loading, addItem, updateItem, deleteItem, resetDemoData }),
    [items, loading, addItem, updateItem, deleteItem, resetDemoData],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within an InventoryProvider');
  return ctx;
}
