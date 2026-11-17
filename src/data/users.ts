import type { User } from '@/types';

export interface DemoCredential extends User {
  password: string;
}

/** Mock authentication users. Replace with a real API in a later phase. */
export const demoUsers: DemoCredential[] = [
  {
    id: 'u-001',
    name: 'usama',
    email: 'admin@smartstock.ai',
    password: 'Admin@123',
    role: 'Warehouse Administrator',
    organization: 'SmartStock Demo Warehouse',
  },
];

export const DEMO_EMAIL = demoUsers[0].email;
export const DEMO_PASSWORD = demoUsers[0].password;
