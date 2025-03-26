
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubscriptionPlan, deleteSubscriptionPlan } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BillingCycleSelector from '@/components/subscription/BillingCycleSelector';
import DeleteSubscriptionPlanDialog from '@/components/subscription/DeleteSubscriptionPlanDialog';
import { BillingCycle } from '@/types/subscription';

const SubscriptionPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscriptionPlan', id],
    queryFn: () => getSubscriptionPlan(parseInt(id as string)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: number) => deleteSubscriptionPlan(planId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Subscription plan deleted successfully',
      });
      navigate('/subscription-plans');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subscription plan',
        variant: 'destructive',
      });
    },
  });

  const handleDeletePlan = () => {
    if (id) {
      deleteMutation.mutate(parseInt(id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getSelectedPrice = () => {
    if (!data?.data) return '$0.00';
    
    switch (billingCycle) {
      case 'monthly':
        return formatPrice(data.data.monthly_price);
      case 'quarterly':
        return formatPrice(data.data.quarterly_price);
      case 'annual':
        return formatPrice(data.data.annual_price);
      default:
        return formatPrice(data.data.monthly_price);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/subscription-plans')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </div>
        <div className="rounded-lg border bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="mb-2 text-xl font-semibold">Error Loading Plan</h2>
          <p className="mb-4">
            {(error as Error)?.message || "The subscription plan couldn't be found."}
          </p>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subscriptionPlan', id] })}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const plan = data.data;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <Button variant="outline" onClick={() => navigate('/subscription-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/subscription-plans/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Plan
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
        <div className="mt-2 flex items-center">
          <Badge variant={plan.is_active ? 'default' : 'outline'}>
            {plan.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <span className="ml-2 text-sm text-muted-foreground">Plan Code: {plan.code}</span>
        </div>
      </div>

      <div className="mb-8">
        <BillingCycleSelector value={billingCycle} onChange={setBillingCycle} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Information about this subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium">Monthly Price</h3>
                <p className="text-sm text-muted-foreground">{formatPrice(plan.monthly_price)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Quarterly Price</h3>
                <p className="text-sm text-muted-foreground">{formatPrice(plan.quarterly_price)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Annual Price</h3>
                <p className="text-sm text-muted-foreground">{formatPrice(plan.annual_price)}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Features</h3>
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-medium uppercase text-muted-foreground">Max Clients</h4>
                    <p className="text-sm">{plan.features.max_clients}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium uppercase text-muted-foreground">Diet Plans per Client</h4>
                    <p className="text-sm">{plan.features.max_diet_plans}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium uppercase text-muted-foreground">AI Meal Generation</h4>
                    <p className="text-sm">{plan.features.ai_meal_generation ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  {plan.features.ai_meal_generation && (
                    <div>
                      <h4 className="text-xs font-medium uppercase text-muted-foreground">AI Generation Limit</h4>
                      <p className="text-sm">{plan.features.ai_meal_generation_limit}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium">Created At</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(plan.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Last Updated</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(plan.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price</CardTitle>
            <CardDescription>Subscription cycle pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-center">
              <div className="text-4xl font-bold">{getSelectedPrice()}</div>
              <div className="text-sm text-muted-foreground">
                {billingCycle === 'monthly' 
                  ? 'per month' 
                  : billingCycle === 'quarterly' 
                    ? 'per quarter' 
                    : 'per year'}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 text-sm font-medium">What's included:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Up to {plan.features.max_clients} clients</li>
                <li>• {plan.features.max_diet_plans} diet plans per client</li>
                {plan.features.ai_meal_generation && (
                  <li>• AI meal generation ({plan.features.ai_meal_generation_limit} per cycle)</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteSubscriptionPlanDialog
        isOpen={isDeleteDialogOpen}
        isLoading={deleteMutation.isPending}
        planName={plan.name}
        onConfirm={handleDeletePlan}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default SubscriptionPlanDetail;
