import type { ActivityItem, AiAlert, StockMovement } from '@/types';
import { isoDateTimeFromNow } from '@/lib/utils';

export const recentMovements: StockMovement[] = [
  {
    id: 'mv-1',
    reference: 'MV-20481',
    productName: 'Organic Whole Milk',
    batchNumber: 'BT-2611-M21',
    type: 'Inbound',
    quantity: 760,
    from: 'Green Valley Dairy',
    to: 'Cold Room 2 – Chilled',
    performedBy: 'Ayesha Khan',
    timestamp: isoDateTimeFromNow(35),
  },
  {
    id: 'mv-2',
    reference: 'MV-20480',
    productName: 'Premium Arabica Coffee',
    batchNumber: 'BT-2607-B05',
    type: 'Outbound',
    quantity: 120,
    from: 'Zone D – Beverage Bay 3',
    to: 'Order #SO-7731',
    performedBy: 'Bilal Ahmed',
    timestamp: isoDateTimeFromNow(95),
  },
  {
    id: 'mv-3',
    reference: 'MV-20479',
    productName: 'Frozen Atlantic Salmon',
    batchNumber: 'BT-2609-F02',
    type: 'Transfer',
    quantity: 60,
    from: 'Cold Room 1 – Frozen',
    to: 'Dispatch Dock 2',
    performedBy: 'Usama',
    timestamp: isoDateTimeFromNow(180),
  },
  {
    id: 'mv-4',
    reference: 'MV-20478',
    productName: 'Canned San Marzano',
    batchNumber: 'BT-2610-C15',
    type: 'Inbound',
    quantity: 1200,
    from: 'Mediterranean Foods Ltd.',
    to: 'Zone B – Dry Aisle 5',
    performedBy: 'Ayesha Khan',
    timestamp: isoDateTimeFromNow(60 * 26),
  },
  {
    id: 'mv-5',
    reference: 'MV-20477',
    productName: 'Extra Virgin Olive Oil',
    batchNumber: 'BT-2609-G09',
    type: 'Adjustment',
    quantity: -12,
    from: 'Zone C – Grocery Bay 1',
    to: 'Damaged goods',
    performedBy: 'Bilal Ahmed',
    timestamp: isoDateTimeFromNow(60 * 30),
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: 'ac-1',
    kind: 'receive',
    title: 'Goods received – BT-2611-M21',
    description: '760 cartons of Organic Whole Milk verified at Dock 1.',
    timestamp: isoDateTimeFromNow(35),
  },
  {
    id: 'ac-2',
    kind: 'ai',
    title: 'AI detection flagged a count mismatch',
    description: 'Camera 3 detected 4 fewer pallets than recorded in Zone B.',
    timestamp: isoDateTimeFromNow(70),
  },
  {
    id: 'ac-3',
    kind: 'blockchain',
    title: 'Batch BT-2610-F03 anchored on-chain',
    description: 'Traceability record written and verified.',
    timestamp: isoDateTimeFromNow(140),
  },
  {
    id: 'ac-4',
    kind: 'dispatch',
    title: 'Order SO-7731 dispatched',
    description: '120 bags of Premium Arabica Coffee left Dock 3.',
    timestamp: isoDateTimeFromNow(190),
  },
  {
    id: 'ac-5',
    kind: 'user',
    title: 'New user invited',
    description: 'Warehouse operator account created for Hamza Ali.',
    timestamp: isoDateTimeFromNow(60 * 22),
  },
];

export const aiAlerts: AiAlert[] = [
  {
    id: 'al-1',
    severity: 'critical',
    title: 'Expired batch in Cold Room 2',
    description: 'BT-2610-M19 (Organic Whole Milk) expired 2 days ago. 48 cartons need disposal.',
    action: 'Review batch',
    timestamp: isoDateTimeFromNow(20),
  },
  {
    id: 'al-2',
    severity: 'warning',
    title: 'Low stock predicted',
    description: 'Extra Virgin Olive Oil will run out in ~6 days at the current demand rate.',
    action: 'Create reorder',
    timestamp: isoDateTimeFromNow(55),
  },
  {
    id: 'al-3',
    severity: 'warning',
    title: 'Two batches expiring within 14 days',
    description: 'Artisan Sourdough and Frozen Atlantic Salmon need FEFO prioritisation.',
    action: 'View expiring',
    timestamp: isoDateTimeFromNow(120),
  },
  {
    id: 'al-4',
    severity: 'info',
    title: 'Demand spike forecast',
    description: 'Coffee demand is forecast to rise 18% next week.',
    action: 'See forecast',
    timestamp: isoDateTimeFromNow(60 * 5),
  },
];

/** Weekly inbound vs outbound units for the "Weekly movement" chart. */
export const weeklyMovement = [
  { day: 'Mon', inbound: 1240, outbound: 980 },
  { day: 'Tue', inbound: 860, outbound: 1120 },
  { day: 'Wed', inbound: 1480, outbound: 1010 },
  { day: 'Thu', inbound: 720, outbound: 1260 },
  { day: 'Fri', inbound: 1630, outbound: 1390 },
  { day: 'Sat', inbound: 540, outbound: 760 },
  { day: 'Sun', inbound: 310, outbound: 420 },
];
