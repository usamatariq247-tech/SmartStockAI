import type { Product } from '@/types';

export const products: Product[] = [
  { id: 'p-001', name: 'Artisan Sourdough', sku: 'BKR-BRD-009', barcode: '8901234567850', category: 'Bakery', unit: 'loaves' },
  { id: 'p-002', name: 'Canned San Marzano', sku: 'CND-TMT-042', barcode: '8901234567830', category: 'Canned Goods', unit: 'cans' },
  { id: 'p-003', name: 'Extra Virgin Olive Oil', sku: 'GRC-OIL-003', barcode: '8901234567860', category: 'Grocery', unit: 'bottles' },
  { id: 'p-004', name: 'Frozen Atlantic Salmon', sku: 'FRZ-SLM-027', barcode: '8901234567840', category: 'Frozen', unit: 'packs' },
  { id: 'p-005', name: 'Organic Whole Milk', sku: 'DRY-MLK-001', barcode: '8901234567810', category: 'Dairy', unit: 'cartons' },
  { id: 'p-006', name: 'Premium Arabica Coffee', sku: 'BEV-CFE-018', barcode: '8901234567820', category: 'Beverages', unit: 'bags' },
];

export const categories: string[] = Array.from(new Set(products.map((p) => p.category))).sort();

export const locations: string[] = [
  'Zone A – Bakery Rack 2',
  'Zone B – Dry Aisle 4',
  'Zone B – Dry Aisle 5',
  'Zone C – Grocery Bay 1',
  'Cold Room 1 – Frozen',
  'Cold Room 2 – Chilled',
  'Zone D – Beverage Bay 3',
];

export const suppliers: string[] = [
  'Golden Crust Bakery Co.',
  'Mediterranean Foods Ltd.',
  'Oceanic Seafood Traders',
  'Green Valley Dairy',
  'Highland Coffee Roasters',
  'FreshLine Distribution',
];
