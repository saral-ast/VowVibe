import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Users, Filter, Download, MoreHorizontal, Heart, Check, X, Clock, ChevronDown, ChevronRight, UserPlus, Edit2, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import Layout from '../components/Layout';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  dietaryRestrictions?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  side: 'bride' | 'groom';
  group: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions: string;
  role: string;
  familyMembers: FamilyMember[];
  isExpanded?: boolean;
}

const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 123-4567',
    side: 'bride',
    group: 'College Friends',
    rsvpStatus: 'confirmed',
    plusOne: true,
    dietaryRestrictions: 'Vegetarian',
    role: 'Bridesmaid',
    familyMembers: [
      {
        id: '1a',
        name: 'Mark Johnson',
        relationship: 'Spouse',
        age: 28,
        dietaryRestrictions: '',
        rsvpStatus: 'confirmed'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael Smith',
    email: 'michael.smith@email.com',
    phone: '+1 (555) 234-5678',
    side: 'groom',
    group: 'Work Colleagues',
    rsvpStatus: 'confirmed',
    plusOne: false,
    dietaryRestrictions: '',
    role: 'Best Man',
    familyMembers: []
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '+1 (555) 345-6789',
    side: 'bride',
    group: 'Family',
    rsvpStatus: 'pending',
    plusOne: true,
    dietaryRestrictions: 'Gluten-free',
    role: 'Aunt',
    familyMembers: [
      {
        id: '3a',
        name: 'Robert Williams',
        relationship: 'Spouse',
        age: 55,
        dietaryRestrictions: 'Diabetic',
        rsvpStatus: 'pending'
      },
      {
        id: '3b',
        name: 'Jessica Williams',
        relationship: 'Daughter',
        age: 16,
        dietaryRestrictions: '',
        rsvpStatus: 'confirmed'
      }
    ]
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 456-7890',
    side: 'groom',
    group: 'Family',
    rsvpStatus: 'declined',
    plusOne: false,
    dietaryRestrictions: '',
    role: 'Uncle',
    familyMembers: []
  },
  {
    id: '5',
    name: 'Lisa Davis',
    email: 'lisa.davis@email.com',
    phone: '+1 (555) 567-8901',
    side: 'bride',
    group: 'High School Friends',
    rsvpStatus: 'confirmed',
    plusOne: true,
    dietaryRestrictions: 'Vegan',
    role: 'Friend',
    familyMembers: [
      {
        id: '5a',
        name: 'Tom Davis',
        relationship: 'Partner',
        age: 30,
        dietaryRestrictions: 'Vegan',
        rsvpStatus: 'confirmed'
      },
      {
        id: '5b',
        name: 'Sophie Davis',
        relationship: 'Daughter',
        age: 8,
        dietaryRestrictions: 'No nuts',
        rsvpStatus: 'confirmed'
      }
    ]
  },
];

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [expandedGuests, setExpandedGuests] = useState<Set<string>>(new Set());
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [selectedGuestForMember, setSelectedGuestForMember] = useState<string>('');
  const [guestFormData, setGuestFormData] = useState<Partial<Guest>>({});
  const [memberFormData, setMemberFormData] = useState<Partial<FamilyMember>>({});

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: guests.length,
    totalWithMembers: guests.reduce((sum, guest) => sum + 1 + guest.familyMembers.length, 0),
    confirmed: guests.filter(g => g.rsvpStatus === 'confirmed').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length,
    declined: guests.filter(g => g.rsvpStatus === 'declined').length,
    plusOnes: guests.filter(g => g.plusOne && g.rsvpStatus === 'confirmed').length,
  };

  const handleAddGuest = () => {
    if (!guestFormData.name || !guestFormData.email || !guestFormData.side || !guestFormData.group || !guestFormData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: guestFormData.name || '',
      email: guestFormData.email || '',
      phone: guestFormData.phone || '',
      side: guestFormData.side as 'bride' | 'groom',
      group: guestFormData.group || '',
      rsvpStatus: 'pending',
      plusOne: guestFormData.plusOne || false,
      dietaryRestrictions: guestFormData.dietaryRestrictions || '',
      role: guestFormData.role || '',
      familyMembers: []
    };

    setGuests([...guests, newGuest]);
    setGuestFormData({});
    setIsAddGuestOpen(false);
    toast.success('Guest added successfully!');
  };

  const handleEditGuest = () => {
    if (!editingGuest || !guestFormData.name || !guestFormData.email || !guestFormData.side || !guestFormData.group || !guestFormData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedGuest = {
      ...editingGuest,
      ...guestFormData
    };

    setGuests(guests.map(guest => guest.id === editingGuest.id ? updatedGuest : guest));
    setEditingGuest(null);
    setGuestFormData({});
    setIsEditGuestOpen(false);
    toast.success('Guest updated successfully!');
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter(guest => guest.id !== guestId));
    toast.success('Guest deleted successfully!');
  };

  const handleAddFamilyMember = () => {
    if (!memberFormData.name || !memberFormData.relationship || !selectedGuestForMember) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: memberFormData.name || '',
      relationship: memberFormData.relationship || '',
      age: memberFormData.age,
      dietaryRestrictions: memberFormData.dietaryRestrictions,
      rsvpStatus: 'pending'
    };

    setGuests(guests.map(guest => 
      guest.id === selectedGuestForMember 
        ? { ...guest, familyMembers: [...guest.familyMembers, newMember] }
        : guest
    ));

    setMemberFormData({});
    setSelectedGuestForMember('');
    setIsAddMemberOpen(false);
    toast.success('Family member added successfully!');
  };

  const handleEditFamilyMember = () => {
    if (!editingMember || !memberFormData.name || !memberFormData.relationship || !selectedGuestForMember) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedMember = {
      ...editingMember,
      ...memberFormData
    };

    setGuests(guests.map(guest => 
      guest.id === selectedGuestForMember 
        ? {
            ...guest,
            familyMembers: guest.familyMembers.map(member => 
              member.id === editingMember.id ? updatedMember : member
            )
          }
        : guest
    ));

    setEditingMember(null);
    setMemberFormData({});
    setSelectedGuestForMember('');
    setIsEditMemberOpen(false);
    toast.success('Family member updated successfully!');
  };

  const handleDeleteFamilyMember = (guestId: string, memberId: string) => {
    setGuests(guests.map(guest => 
      guest.id === guestId 
        ? { ...guest, familyMembers: guest.familyMembers.filter(member => member.id !== memberId) }
        : guest
    ));
    toast.success('Family member deleted successfully!');
  };

  const toggleGuestExpansion = (guestId: string) => {
    const newExpanded = new Set(expandedGuests);
    if (newExpanded.has(guestId)) {
      newExpanded.delete(guestId);
    } else {
      newExpanded.add(guestId);
    }
    setExpandedGuests(newExpanded);
  };

  const openEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestFormData(guest);
    setIsEditGuestOpen(true);
  };

  const openEditMember = (member: FamilyMember, guestId: string) => {
    setEditingMember(member);
    setMemberFormData(member);
    setSelectedGuestForMember(guestId);
    setIsEditMemberOpen(true);
  };

  const openAddMember = (guestId: string) => {
    setSelectedGuestForMember(guestId);
    setIsAddMemberOpen(true);
  };

  const resetGuestForm = () => {
    setGuestFormData({});
    setEditingGuest(null);
  };

  const resetMemberForm = () => {
    setMemberFormData({});
    setEditingMember(null);
    setSelectedGuestForMember('');
  };

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'declined':
        return <X className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getRSVPBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">Confirmed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30">Declined</Badge>;
      default:
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">Pending</Badge>;
    }
  };

  const GuestForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            value={guestFormData.name || ''}
            onChange={(e) => setGuestFormData({ ...guestFormData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            value={guestFormData.email || ''}
            onChange={(e) => setGuestFormData({ ...guestFormData, email: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Phone number"
            value={guestFormData.phone || ''}
            onChange={(e) => setGuestFormData({ ...guestFormData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="side">Side *</Label>
          <Select value={guestFormData.side || ''} onValueChange={(value) => setGuestFormData({ ...guestFormData, side: value as 'bride' | 'groom' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bride">Bride's Side</SelectItem>
              <SelectItem value="groom">Groom's Side</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group">Group *</Label>
          <Input
            id="group"
            placeholder="e.g., Family, Friends"
            value={guestFormData.group || ''}
            onChange={(e) => setGuestFormData({ ...guestFormData, group: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            placeholder="e.g., Bridesmaid, Friend"
            value={guestFormData.role || ''}
            onChange={(e) => setGuestFormData({ ...guestFormData, role: e.target.value })}
          />
        </div>
      </div>
      {isEdit && (
        <div>
          <Label htmlFor="rsvpStatus">RSVP Status</Label>
          <Select value={guestFormData.rsvpStatus || ''} onValueChange={(value) => setGuestFormData({ ...guestFormData, rsvpStatus: value as 'pending' | 'confirmed' | 'declined' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select RSVP status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="plusOne"
          checked={guestFormData.plusOne || false}
          onChange={(e) => setGuestFormData({ ...guestFormData, plusOne: e.target.checked })}
          className="rounded border-border"
        />
        <Label htmlFor="plusOne">Allow Plus One</Label>
      </div>
      <div>
        <Label htmlFor="dietary">Dietary Restrictions</Label>
        <Textarea
          id="dietary"
          placeholder="Any dietary restrictions or allergies"
          value={guestFormData.dietaryRestrictions || ''}
          onChange={(e) => setGuestFormData({ ...guestFormData, dietaryRestrictions: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetGuestForm();
            isEdit ? setIsEditGuestOpen(false) : setIsAddGuestOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditGuest : handleAddGuest}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Guest' : 'Add Guest'}
        </Button>
      </div>
    </div>
  );

  const FamilyMemberForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="memberName">Name *</Label>
        <Input
          id="memberName"
          placeholder="Enter family member name"
          value={memberFormData.name || ''}
          onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationship">Relationship *</Label>
          <Select value={memberFormData.relationship || ''} onValueChange={(value) => setMemberFormData({ ...memberFormData, relationship: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Partner">Partner</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Son">Son</SelectItem>
              <SelectItem value="Daughter">Daughter</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Age"
            value={memberFormData.age || ''}
            onChange={(e) => setMemberFormData({ ...memberFormData, age: parseInt(e.target.value) || undefined })}
          />
        </div>
      </div>
      {isEdit && (
        <div>
          <Label htmlFor="memberRsvpStatus">RSVP Status</Label>
          <Select value={memberFormData.rsvpStatus || ''} onValueChange={(value) => setMemberFormData({ ...memberFormData, rsvpStatus: value as 'pending' | 'confirmed' | 'declined' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select RSVP status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="memberDietary">Dietary Restrictions</Label>
        <Textarea
          id="memberDietary"
          placeholder="Any dietary restrictions or allergies"
          value={memberFormData.dietaryRestrictions || ''}
          onChange={(e) => setMemberFormData({ ...memberFormData, dietaryRestrictions: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            resetMemberForm();
            isEdit ? setIsEditMemberOpen(false) : setIsAddMemberOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={isEdit ? handleEditFamilyMember : handleAddFamilyMember}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guest Management</h1>
          <p className="text-muted-foreground">Manage your wedding guest list and RSVPs</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
                <DialogDescription>Add a family member to an existing guest</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guestSelect">Select Guest</Label>
                  <Select value={selectedGuestForMember} onValueChange={setSelectedGuestForMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {guests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>{guest.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FamilyMemberForm />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
                <DialogDescription>Add a new guest to your wedding list</DialogDescription>
              </DialogHeader>
              <GuestForm />
            </DialogContent>
          </Dialog>

          {/* Edit Dialogs */}
          <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Guest</DialogTitle>
                <DialogDescription>Update guest details</DialogDescription>
              </DialogHeader>
              <GuestForm isEdit={true} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Family Member</DialogTitle>
                <DialogDescription>Update family member details</DialogDescription>
              </DialogHeader>
              <FamilyMemberForm isEdit={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Primary Guests</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalWithMembers}</div>
            <div className="text-sm text-muted-foreground">Total Attendees</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.declined}</div>
            <div className="text-sm text-muted-foreground">Declined</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search guests by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by RSVP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest List with Expandable Rows - Mobile Optimized */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Guest List ({filteredGuests.length})
          </CardTitle>
          <CardDescription>Click on any guest to view family members</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredGuests.map((guest) => {
              const isExpanded = expandedGuests.has(guest.id);
              const totalFamilyMembers = guest.familyMembers.length;
              
              return (
                <div key={guest.id} className="border border-border rounded-lg overflow-hidden">
                  {/* Main Guest Row - Mobile Optimized */}
                  <div className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="space-y-3">
                      {/* Top Row: Avatar, Name, Expand Button */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {totalFamilyMembers > 0 && (
                            <button 
                              onClick={() => toggleGuestExpansion(guest.id)}
                              className="touch-target flex items-center justify-center w-8 h-8 rounded hover:bg-accent/50"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </button>
                          )}
                          {totalFamilyMembers === 0 && <div className="w-8 h-8" />}
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {guest.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium text-foreground">{guest.name}</h4>
                            {totalFamilyMembers > 0 && (
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                <UserPlus className="w-3 h-3 mr-1" />
                                +{totalFamilyMembers}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{guest.role}</div>
                        </div>
                        
                        {/* Actions - Mobile Optimized */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddMember(guest.id)}
                            className="touch-target w-10 h-10 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditGuest(guest)}
                            className="touch-target w-10 h-10 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="touch-target w-10 h-10 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Guest</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{guest.name}" and all their family members? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteGuest(guest.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Second Row: Contact & Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pl-10 sm:pl-12">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{guest.email}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={
                            guest.side === 'bride' 
                              ? 'border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/30' 
                              : 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30'
                          }>
                            {guest.side === 'bride' ? "Bride's Side" : "Groom's Side"}
                          </Badge>
                          {guest.plusOne && (
                            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                              <Heart className="w-3 h-3 mr-1" />
                              Plus One
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Third Row: RSVP Status */}
                      <div className="flex items-center gap-2 pl-10 sm:pl-12">
                        {getRSVPIcon(guest.rsvpStatus)}
                        {getRSVPBadge(guest.rsvpStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Family Members - Mobile Optimized */}
                  {isExpanded && totalFamilyMembers > 0 && (
                    <div className="border-t border-border bg-accent/20">
                      <div className="p-4">
                        <h5 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Family Members ({totalFamilyMembers})
                        </h5>
                        <div className="space-y-3">
                          {guest.familyMembers.map((member) => (
                            <div key={member.id} className="p-3 bg-card rounded-lg border border-border">
                              <div className="space-y-2">
                                {/* Member Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm text-foreground">{member.name}</span>
                                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                          {member.relationship}
                                        </Badge>
                                        {member.age && (
                                          <span className="text-xs text-muted-foreground">Age {member.age}</span>
                                        )}
                                      </div>
                                      {member.dietaryRestrictions && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          Dietary: {member.dietaryRestrictions}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Member Actions */}
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditMember(member, guest.id)}
                                      className="touch-target w-8 h-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="touch-target w-8 h-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{member.name}"?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteFamilyMember(guest.id, member.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                                
                                {/* Member RSVP */}
                                <div className="flex items-center gap-2 pl-11">
                                  {getRSVPIcon(member.rsvpStatus)}
                                  <div className="text-xs">
                                    {getRSVPBadge(member.rsvpStatus)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredGuests.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No guests found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
GuestManagement.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;