// src/components/guests/DeleteGuestDialog.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Import DialogClose for better accessibility
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteGuestDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  guestName?: string;
  isLoading?: boolean;
}

export const DeleteGuestDialog: React.FC<DeleteGuestDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  guestName,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* FIX: Changed sm:max-w-2xl back to sm:max-w-md for a more compact dialog on desktop */}
      <DialogContent className="sm:max-w-m">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full dark:bg-red-900/30">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <DialogTitle className="text-lg font-semibold leading-6 text-foreground">
              Delete Guest?
            </DialogTitle>
            <div className="mt-2">
              <DialogDescription className="text-sm text-muted-foreground">
                Are you sure you want to delete "{guestName || 'this guest'}"? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {/* This stacks buttons on mobile and puts them in a row on the right for desktop */}
        <DialogFooter className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
