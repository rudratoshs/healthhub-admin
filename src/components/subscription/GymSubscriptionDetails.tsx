
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGymSubscription } from '@/lib/subscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CheckCircle, Clock, CreditCard, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GymSubscriptionDetailsProps {
  gymId: number;
  onSubscribe: () => void;
  onUpdateSubscription: () => void;
  onCancelSubscription: () => void;
}

const GymSubscriptionDetails: React.FC<GymSubscriptionDetailsProps> = ({
  gymId,
  onSubscribe,
  onUpdateSubscription,
  onCancelSubscription,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gymSubscription', gymId],
    queryFn: () => getGymSubscription(gymId),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardHeader>
          <CardTitle>Subscription Error</CardTitle>
          <CardDescription>
            There was an error loading the subscription information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {(error as Error).message || "Couldn't retrieve subscription details."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // No active subscription
  if (!data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            This gym doesn't have an active subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Subscribe to a plan to access premium features like AI meal generation,
            increased client limits, and more.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onSubscribe}>Subscribe Now</Button>
        </CardFooter>
      </Card>
    );
  }

  const subscription = data.data;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              {subscription.subscription_plan.name}
            </CardDescription>
          </div>
          <Badge variant={subscription.status === 'active' ? 'default' : 'outline'}>
            {subscription.status === 'active' ? 'Active' : subscription.status === 'canceled' ? 'Canceled' : 'Expired'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start">
            <CalendarClock className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Billing Cycle</p>
              <p className="text-sm text-muted-foreground capitalize">
                {subscription.billing_cycle}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">
                {subscription.payment_provider === 'stripe' ? 'Credit Card' : subscription.payment_provider}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(subscription.start_date)}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Renewal Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(subscription.end_date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <RefreshCw className="mr-2 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Auto Renewal</p>
            <p className="text-sm text-muted-foreground">
              {subscription.auto_renew ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-2 text-sm font-medium">Plan Features:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Up to {subscription.subscription_plan.features.max_clients} clients
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              {subscription.subscription_plan.features.max_diet_plans} diet plans per client
            </li>
            {subscription.subscription_plan.features.ai_meal_generation && (
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                AI meal generation ({subscription.subscription_plan.features.ai_meal_generation_limit} per cycle)
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onUpdateSubscription}>
          Change Plan
        </Button>
        <Button variant="secondary" onClick={onCancelSubscription}>
          {subscription.status === 'canceled' ? 'View Cancellation' : 'Cancel Subscription'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GymSubscriptionDetails;
