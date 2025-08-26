// src/pages/GuestManagement.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

import { Guest, GuestFormData } from '@/types/guest.types';
import { GuestStats } from '@/components/guests/GuestStats';
import GuestForm from '@/components/guests/GuestForm';
import { GuestList } from '@/components/guests/GuestList';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import Layout from '@/components/Layout';

// UI Components
import { Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Default values for a NEW guest, using camelCase for the form
const NEW_GUEST_DEFAULTS: Partial<GuestFormData> = {
  name: '',
  email: '',
  phone: '',
  side: 'bride',
  group: '',
  role: '',
  invite_status: 'pending',
  members_count: 1,
  dietary_restrictions: '',
};

export default function GuestManagement() {
  const { guests } = usePage<{ guests: Guest[] }>().props;

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');

  // State for the Add/Edit form dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // State for the single, centralized delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);

  // Single loading state for all form submissions (Add, Update, Delete)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoized calculations based on the 'guests' prop from Inertia
  const filteredGuests = useMemo(() => guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || guest.invite_status === filterStatus;
    return matchesSearch && matchesFilter;
  }), [guests, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: guests.length,
    totalAttendees: guests.reduce((sum, g) => sum + (g.invite_status === 'confirmed' ? g.members_count : 0), 0),
    confirmed: guests.filter(g => g.invite_status === 'confirmed').length,
    pending: guests.filter(g => g.invite_status === 'pending').length,
    declined: guests.filter(g => g.invite_status === 'declined').length,
  }), [guests]);

  // --- Form and Dialog Handlers ---
  const openFormForAdd = () => {
    setEditingGuest(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingGuest(null), 150);
  };

  const handleFormSubmit = (data: GuestFormData) => {
    const postData = { ...data, dietary_restrictions: data.dietary_restrictions };
    delete (postData as any).dietary_restrictions; // Remove the camelCase key

    const options = {
      preserveState: true,
      preserveScroll: true,
      onStart: () => setIsSubmitting(true),
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        closeForm();
        toast.success(`Guest ${editingGuest ? 'updated' : 'added'} successfully!`);
      },
      onError: () => toast.error('Please check the form for errors.'),
    };

    if (editingGuest) {
      router.put(`/guests/${editingGuest.id}`, postData, options);
    } else {
      router.post('/guests', postData, options);
    }
  };
  
  const handleDeleteClick = (guestId: string) => {
    setGuestToDelete(guestId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!guestToDelete) return;
    router.delete(`/guests/${guestToDelete}`, {
      preserveState: true,
      preserveScroll: true,
      onStart: () => setIsSubmitting(true),
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        toast.success('Guest deleted successfully!');
        setIsDeleteDialogOpen(false);
        setGuestToDelete(null);
      },
      onError: () => toast.error('Failed to delete guest.'),
    });
  };

  const formDefaultValues = useMemo(() => {
    if (editingGuest) {
      return {
        ...editingGuest,
        dietaryRestrictions: editingGuest.dietary_restrictions || '',
      };
    }
    return NEW_GUEST_DEFAULTS;
  }, [editingGuest]);
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Guest Management</h1>
        <p className="text-muted-foreground">Manage your wedding guest list</p>
      </div>

      <GuestStats stats={stats} />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
              <Input placeholder="Search guests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openFormForAdd}><Plus className="w-4 h-4 mr-2" /> Add Guest</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Guest List ({filteredGuests.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <GuestList guests={filteredGuests} onEdit={openFormForEdit} onDelete={handleDeleteClick} isMobile={isMobile} />
        </CardContent>
      </Card>

      {/* Add/Edit Guest Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle></DialogHeader>
          {isFormOpen && (
            <GuestForm
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
              isEdit={!!editingGuest}
              defaultValues={formDefaultValues}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Centralized Delete Guest Dialog */}
      <DeleteGuestDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        guestName={guests.find(g => g.id === guestToDelete)?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
}

GuestManagement.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;