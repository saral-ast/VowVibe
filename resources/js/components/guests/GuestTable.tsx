import React from 'react';
import { Guest } from '@/types/guest.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Mail, Phone, Trash2, Users } from 'lucide-react';

// Helper to get initials from a name
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

export function GuestTable({ guests, onEdit, onDelete }: { guests: Guest[], onEdit: (g: Guest) => void, onDelete: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Party Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center h-24">No guests found.</TableCell></TableRow>
          )}
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>{getInitials(guest.name)}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-muted-foreground">{guest.role}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {guest.email}</div>
                {guest.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {guest.phone}</div>}
              </TableCell>
              <TableCell className="capitalize">{guest.side}</TableCell>
              <TableCell><Badge variant={guest.invite_status === 'confirmed' ? 'default' : 'outline'} className="capitalize">{guest.invite_status}</Badge></TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {guest.members_count}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onEdit(guest)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                {/* REMOVED AlertDialog, just call onDelete directly */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation(); // <-- This is the crucial fix for event bubbling
                    onDelete(guest.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}