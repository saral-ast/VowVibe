// src/components/guests/GuestCardList.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Heart, Mail, Phone, Trash2, Users, Check, X, Clock } from 'lucide-react';
import { Guest } from '@/types/guest.types';

interface GuestCardListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('') || '';

const getRSVPIcon = (status: Guest['invite_status']) => {
  switch (status) {
    case 'confirmed': return <Check className="w-4 h-4 text-green-600" />;
    case 'declined': return <X className="w-4 h-4 text-red-600" />;
    default: return <Clock className="w-4 h-4 text-yellow-600" />;
  }
};

const getRSVPBadge = (status: Guest['invite_status']) => {
  switch (status) {
    case 'confirmed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
    case 'declined': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
    default: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
  }
};

export function GuestCardList({ guests, onEdit, onDelete }: GuestCardListProps) {
  if (guests.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No guests found.</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-3 sm:p-4">
      {guests.map((guest) => (
        <Card key={guest.id} className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10"><AvatarFallback>{getInitials(guest.name)}</AvatarFallback></Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{guest.name}</h3>
                <p className="text-sm text-muted-foreground">{guest.role}</p>
              </div>
              <div className="flex">
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onEdit(guest)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(guest.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pl-14 space-y-3">
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{guest.email}</span>
                </div>
                {guest.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{guest.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {getRSVPIcon(guest.invite_status)}
                  {getRSVPBadge(guest.invite_status)}
                </div>
                <Badge variant="outline" className={guest.side === 'bride' ? 'border-pink-300 text-pink-700' : 'border-blue-300 text-blue-700'}>
                  {guest.side === 'bride' ? "Bride's Side" : "Groom's Side"}
                </Badge>
                {guest.members_count > 1 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Heart className="w-3 h-3 mr-1.5 text-pink-500" /> {guest.members_count} Attendees
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}