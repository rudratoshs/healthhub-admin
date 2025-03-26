
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubscriptionPlans, deleteSubscriptionPlan } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { BillingCycle, SubscriptionPlan } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { Plus } from 'lucide-react';
import SubscriptionPlanCard from '@/components/subscription/SubscriptionPlanCard';
import DeleteSubscriptionPlanDialog from '@/components/subscription/DeleteSubscriptionPlanDialog';
import BillingCycleSelector from '@/components/subscription/BillingCycleSelector';

const SubscriptionPlans: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: getSubscriptionPlans,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubscriptionPlan(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Subscription plan deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      setPlanToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subscription plan',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id);
    }
  };

  const activePlans = data?.data.filter(plan => plan.is_active) || [];
  const inactivePlans = data?.data.filter(plan => !plan.is_active) || [];

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-lg border bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="mb-2 text-xl font-semibold">Error Loading Subscription Plans</h2>
          <p className="mb-4">
            {(error as Error).message || "There was an error loading the subscription plans."}
          </p>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] })}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Manage your platform subscription plans
          </p>
        </div>
        <Button onClick={() => navigate('/subscription-plans/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <div className="mb-6">
        <BillingCycleSelector value={billingCycle} onChange={setBillingCycle} />
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : activePlans.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold">No Active Plans</h3>
              <p className="mb-4 text-muted-foreground">
                You don't have any active subscription plans yet.
              </p>
              <Button onClick={() => navigate('/subscription-plans/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activePlans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  selectedCycle={billingCycle}
                  onSelect={() => navigate(`/subscription-plans/${plan.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : inactivePlans.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold">No Inactive Plans</h3>
              <p className="text-muted-foreground">
                You don't have any inactive subscription plans.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inactivePlans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  selectedCycle={billingCycle}
                  onSelect={() => navigate(`/subscription-plans/${plan.id}`)}
                  variant="outlined"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DeleteSubscriptionPlanDialog
        isOpen={!!planToDelete}
        isLoading={deleteMutation.isPending}
        planName={planToDelete?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setPlanToDelete(null)}
      />
    </div>
  );
};

export default SubscriptionPlans;
