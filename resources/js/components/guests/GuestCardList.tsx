import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Mail, Trash2, Users, Phone, User, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Guest } from '@/types/guest.types';
import { cn } from '@/lib/utils';

interface GuestCardListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('') || '';

const getRSVPBadge = (status: Guest['invite_status']) => {
  switch (status) {
    case 'confirmed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
    case 'declined': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
    default: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
  }
};

const GuestCard = ({ guest, onEdit, onDelete }: { guest: Guest; onEdit: (guest: Guest) => void; onDelete: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-3 flex items-center gap-3 hover:bg-accent transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <Avatar className="h-9 w-9 text-xs">
          <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate" title={guest.name}>{guest.name}</h3>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate" title={guest.email}>{guest.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto" onClick={(e) => e.stopPropagation()}>
          {getRSVPBadge(guest.invite_status)}
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => onEdit(guest)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => onDelete(guest.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={cn(
        'border-t bg-muted/30 overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Role</span>
              </p>
              <p className="font-medium">{guest.role || 'Guest'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Side</span>
              </p>
              <p className="font-medium capitalize">{guest.side || 'Not specified'}</p>
            </div>

            {guest.phone && (
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </p>
                <p className="font-medium">{guest.phone}</p>
              </div>
            )}

            {guest.members_count > 1 && (
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>Group Size</span>
                </p>
                <p className="font-medium">{guest.members_count} people</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Card>
  );
};

export function GuestCardList({ guests, onEdit, onDelete }: GuestCardListProps) {
  if (guests.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No guests found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {guests.map((guest) => (
        <GuestCard key={guest.id} guest={guest} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}