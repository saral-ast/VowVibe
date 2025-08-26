// src/components/guests/GuestForm.tsx

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';
import { GuestFormData } from '@/types/guest.types';

interface GuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<GuestFormData>;
  isEdit?: boolean;
  isLoading?: boolean;
}

const GuestForm: React.FC<GuestFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = { members_count: 1, invite_status: 'pending' },
  isEdit = false,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" placeholder="Enter full name" {...register('name', { required: 'Full name is required' })} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="Enter email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }})} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="Phone number" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="side">Side *</Label>
          <Controller name="side" control={control} rules={{ required: 'Please select a side' }} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select side" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride's Side</SelectItem>
                  <SelectItem value="groom">Groom's Side</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.side && <p className="mt-1 text-xs text-red-500">{errors.side.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group">Group *</Label>
          <Input id="group" placeholder="e.g., Family, Friends" {...register('group', { required: 'Group is required' })} />
          {errors.group && <p className="mt-1 text-xs text-red-500">{errors.group.message}</p>}
        </div>
        <div>
          <Label htmlFor="members_count">Party Size *</Label>
          <Input id="members_count" type="number" min="1" {...register('members_count', { valueAsNumber: true, min: { value: 1, message: 'Party size must be at least 1' } })} />
          {errors.members_count && <p className="mt-1 text-xs text-red-500">{errors.members_count.message}</p>}
        </div>
      </div>
      
      <div>
        <Label htmlFor="role">Role *</Label>
        <Input id="role" placeholder="e.g., Bridesmaid, Friend" {...register('role', { required: 'Role is required' })} />
        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="invite_status">Invite Status</Label>
          <Controller name="invite_status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select invite status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div>
        <Label htmlFor="dietary">Dietary Restrictions</Label>
        <Textarea id="dietary" placeholder="Any dietary restrictions or allergies" {...register('dietary_restrictions')} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isEdit ? 'Update Guest' : 'Add Guest'}
        </Button>
      </div>
    </form>
  );
};

export default GuestForm;