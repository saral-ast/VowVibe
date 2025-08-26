import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GuestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'pending' | 'confirmed' | 'declined';
  onFilterStatusChange: (value: 'all' | 'pending' | 'confirmed' | 'declined') => void;
  onAddGuest: () => void;
}

export const GuestFilters: React.FC<GuestFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onAddGuest,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search guests..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select
          value={filterStatus}
          onValueChange={(value: 'all' | 'pending' | 'confirmed' | 'declined') => 
            onFilterStatusChange(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onAddGuest} className="whitespace-nowrap">
        Add Guest
      </Button>
    </div>
  );
};

export default GuestFilters;
