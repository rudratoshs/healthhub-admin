
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createSubscriptionPlan } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { CreateSubscriptionPlanRequest } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubscriptionPlanForm from '@/components/subscription/SubscriptionPlanForm';

const CreateSubscriptionPlan: React.FC = () => {
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: (data: CreateSubscriptionPlanRequest) => createSubscriptionPlan(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Subscription plan created successfully',
      });
      navigate('/subscription-plans');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create subscription plan',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/subscription-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h1>
        <p className="text-muted-foreground">
          Set up a new subscription plan for your platform
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <SubscriptionPlanForm
          onSubmit={(data) => mutation.mutate(data as CreateSubscriptionPlanRequest)}
          isLoading={mutation.isPending}
        />
      </div>
    </div>
  );
};

export default CreateSubscriptionPlan;
