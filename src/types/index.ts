export type StockStatus =
  | 'in_stock'
  | 'low_stock'
  | 'expiring_soon'
  | 'expired'
  | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  category: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  minLevel: number;
  location: string;
  supplier: string;
  receivedDate: string; // ISO yyyy-mm-dd
  expiryDate: string; // ISO yyyy-mm-dd
  notes?: string;
}

export type InventoryFormValues = Omit<InventoryItem, 'id'>;

export type MovementType = 'Inbound' | 'Outbound' | 'Transfer' | 'Adjustment';

export interface StockMovement {
  id: string;
  reference: string;
  productName: string;
  batchNumber: string;
  type: MovementType;
  quantity: number;
  from: string;
  to: string;
  performedBy: string;
  timestamp: string; // ISO datetime
}

export type ActivityKind = 'receive' | 'dispatch' | 'transfer' | 'ai' | 'user' | 'blockchain';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  timestamp: string; // ISO datetime
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AiAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  action: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}
