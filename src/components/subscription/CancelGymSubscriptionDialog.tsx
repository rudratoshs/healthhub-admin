
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelGymSubscription } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader } from '@/components/ui/loader';
import { AlertCircle } from 'lucide-react';

interface CancelGymSubscriptionDialogProps {
  gymId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CancelGymSubscriptionDialog: React.FC<CancelGymSubscriptionDialogProps> = ({
  gymId,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);
  
  const cancelMutation = useMutation({
    mutationFn: () => {
      return cancelGymSubscription(gymId, { at_period_end: cancelAtPeriodEnd });
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Canceled',
        description: cancelAtPeriodEnd 
          ? 'Your subscription will be canceled at the end of the current billing period' 
          : 'Your subscription has been canceled immediately',
      });
      queryClient.invalidateQueries({ queryKey: ['gymSubscription', gymId] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Canceling your subscription will limit your access to premium features.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cancel-at-period-end"
              checked={cancelAtPeriodEnd}
              onCheckedChange={(checked: boolean) => setCancelAtPeriodEnd(checked)}
            />
            <label
              htmlFor="cancel-at-period-end"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cancel at the end of the current billing period
            </label>
          </div>

          {!cancelAtPeriodEnd && (
            <p className="mt-2 text-sm text-red-500">
              Your subscription will be canceled immediately and you will lose access to all premium features.
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={cancelMutation.isPending}>
            No, Keep My Subscription
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader size="sm" className="mr-2" />
                Canceling...
              </>
            ) : (
              'Yes, Cancel Subscription'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelGymSubscriptionDialog;
