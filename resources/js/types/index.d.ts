import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     avatar?: string;
//     email_verified_at: string | null;
//     created_at: string;
//     updated_at: string;
//     [key: string]: unknown; // This allows for additional properties...
// }

export interface Wedding {
    bride_name: string;
    groom_name: string;
    wedding_date: string; // Dates are passed as strings
    budget: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    wedding: Wedding | null;
}

export interface DashboardStats {
    daysUntilWedding: number;
    totalGuests: number;
    confirmedGuests: number;
    totalTasks: number;
    completedTasks: number;
    totalBudget: number;
}

export interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

export interface MonthlyTaskItem {
    month: string;
    completed: number;
    total: number;
}

export interface ActivityItem {
    action: string;
    time: string;
    type: string;
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
};

// ... your existing User, Wedding, and PageProps interfaces ...

export interface FamilyMember {
  _id: string;
  name: string;
  relationship: string;
  age?: number;
  dietary_restrictions?: string;
  invite_status: 'pending' | 'confirmed' | 'declined';
}

export interface Guest {
  _id: string; // MongoDB uses _id
  wedding_id: string;
  name: string;
  email: string;
  phone: string;
  side: 'bride' | 'groom';
  group: string;
  invite_status: 'pending' | 'confirmed' | 'declined';
  plus_one: boolean;
  dietary_restrictions: string;
  role: string;
  family_members: FamilyMember[];
}

// This defines the props for the GuestManagement page
export interface GuestPageProps extends PageProps {
    guests: Guest[];
}