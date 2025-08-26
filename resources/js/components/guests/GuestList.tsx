// src/components/guests/GuestList.tsx

import React from 'react';
import { Guest } from '@/types/guest.types';
import { GuestTable } from './GuestTable';
import { GuestCardList } from './GuestCardList';

interface GuestListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  isMobile: boolean;
}

export function GuestList({ guests, onEdit, onDelete, isMobile }: GuestListProps) {
  if (isMobile) {
    return <GuestCardList guests={guests} onEdit={onEdit} onDelete={onDelete} />;
  }
  return <GuestTable guests={guests} onEdit={onEdit} onDelete={onDelete} />;
}