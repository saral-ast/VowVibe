import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FamilyMember } from '@/types';
import { FamilyMemberFormData } from '@/types/guest.types';

interface FamilyMemberFormProps {
  member?: FamilyMember & { id?: string };
  onSubmit: (data: FamilyMemberFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  member,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FamilyMemberFormData>({
    defaultValues: {
      name: member?.name || '',
      relationship: member?.relationship || '',
      age: member?.age,
      dietary_restrictions: member?.dietary_restrictions || '',
      invite_status: member?.invite_status || 'pending',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Jane Smith"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship *</Label>
          <Input
            id="relationship"
            {...register('relationship', { required: 'Relationship is required' })}
            placeholder="Spouse, Child, Parent, etc."
          />
          {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="0"
            {...register('age', { valueAsNumber: true })}
            placeholder="Age (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite_status">Status *</Label>
          <Controller
            name="invite_status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.invite_status && <p className="text-sm text-red-500">{errors.invite_status.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
        <Textarea
          id="dietary_restrictions"
          {...register('dietary_restrictions')}
          placeholder="Any allergies or dietary restrictions?"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Family Member'}
        </Button>
      </div>
    </form>
  );
};

export default FamilyMemberForm;
