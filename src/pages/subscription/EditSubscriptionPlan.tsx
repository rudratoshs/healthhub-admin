
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/lib/subscriptions';
import { toast } from '@/hooks/use-toast';
import { UpdateSubscriptionPlanRequest } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft } from 'lucide-react';
import SubscriptionPlanForm from '@/components/subscription/SubscriptionPlanForm';

const EditSubscriptionPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['subscriptionPlan', id],
    queryFn: () => getSubscriptionPlan(parseInt(id as string)),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateSubscriptionPlanRequest) => 
      updateSubscriptionPlan(parseInt(id as string), data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Subscription plan updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlan', id] });
      navigate(`/subscription-plans/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription plan',
        variant: 'destructive',
      });
    },
  });

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
          <Button variant="outline" onClick={() => navigate(`/subscription-plans/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plan Details
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

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/subscription-plans/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plan Details
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Subscription Plan</h1>
        <p className="text-muted-foreground">
          Update the details for {data.data.name}
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <SubscriptionPlanForm
          plan={data.data}
          onSubmit={(formData) => mutation.mutate(formData as UpdateSubscriptionPlanRequest)}
          isLoading={mutation.isPending}
        />
      </div>
    </div>
  );
};

export default EditSubscriptionPlan;
