
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPublicSubscriptionPlans, subscribeGym } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { BillingCycle, SubscribeGymRequest, SubscriptionPlan } from '@/types/subscription';
import BillingCycleSelector from '@/components/subscription/BillingCycleSelector';
import SubscriptionPlanCard from '@/components/subscription/SubscriptionPlanCard';

interface SubscribeGymDialogProps {
  gymId: number;
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeGymDialog: React.FC<SubscribeGymDialogProps> = ({
  gymId,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicSubscriptionPlans'],
    queryFn: getPublicSubscriptionPlans,
    enabled: isOpen,
  });

  const subscribeMutation = useMutation({
    mutationFn: (data: SubscribeGymRequest) => subscribeGym(gymId, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Gym subscribed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['gymSubscription', gymId] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to subscribe gym',
        variant: 'destructive',
      });
    },
  });

  const handleSubscribe = () => {
    if (!selectedPlanId) {
      toast({
        title: 'Error',
        description: 'Please select a subscription plan',
        variant: 'destructive',
      });
      return;
    }

    // This is a mock payment method ID
    // In a real implementation, you would collect payment details from the user
    const paymentMethodId = 'pm_test_payment_method';

    const subscriptionData: SubscribeGymRequest = {
      plan_id: selectedPlanId,
      billing_cycle: billingCycle,
      payment_provider: 'stripe',
      payment_method_id: paymentMethodId,
    };

    subscribeMutation.mutate(subscriptionData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Subscribe to a Plan</DialogTitle>
          <DialogDescription>
            Choose a subscription plan for your gym to access premium features
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BillingCycleSelector value={billingCycle} onChange={setBillingCycle} />
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
            <p className="text-sm">
              {(error as Error).message || "There was an error loading subscription plans."}
            </p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['publicSubscriptionPlans'] })}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid max-h-[400px] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((plan: SubscriptionPlan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                selectedCycle={billingCycle}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </div>
        )}

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={subscribeMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubscribe} 
            disabled={!selectedPlanId || subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? (
              <>
                <Loader size="sm" className="mr-2" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeGymDialog;
