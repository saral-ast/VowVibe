export enum InviteStatus {
    Pending = 'pending',
    Attending = 'attending',
    NotAttending = 'not_attending',
}

export enum GuestSide {
    Bride = 'bride',
    Groom = 'groom',
}

export enum GuestGroup {
    Family = 'family',
    Friends = 'friends',
    Colleagues = 'colleagues',
    Other = 'other',
}

// Base guest interface with all fields from the database schema
export interface Guest {
     id: string;
     name: string;
     email: string;
     phone: string | null;
     side: 'bride' | 'groom';
     group: string;
     invite_status: 'pending' | 'confirmed' | 'declined';
     members_count: number; // 1 for single, 2 for plus one
     dietary_restrictions: string | null;
     role: string;
}
    

export type GuestType = Guest; // Alias for compatibility

// Form data types
export type GuestFormData = Pick<Guest, 'name' | 'email' | 'side' | 'group' | 'role' | 'members_count' | 'invite_status'> & Partial<Pick<Guest, 'phone' | 'dietary_restrictions'>>;

// Type for guest statistics
export interface GuestStats {
    totalGuests: number;
    attending: number;
    pending: number;
    notAttending: number;
}

export interface GuestFilters {
    side: 'all' | GuestSide;
    group: 'all' | GuestGroup;
    status: 'all' | InviteStatus;
    search: string;
}

