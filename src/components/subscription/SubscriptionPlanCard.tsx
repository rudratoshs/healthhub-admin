
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan, BillingCycle } from '@/types/subscription';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  selectedCycle: BillingCycle;
  isSelected?: boolean;
  onSelect?: () => void;
  onSubscribe?: () => void;
  showSubscribeButton?: boolean;
  variant?: 'default' | 'outlined';
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  selectedCycle,
  isSelected = false,
  onSelect,
  onSubscribe,
  showSubscribeButton = false,
  variant = 'default'
}) => {
  const getPrice = () => {
    switch (selectedCycle) {
      case 'monthly':
        return plan.monthly_price;
      case 'quarterly':
        return plan.quarterly_price;
      case 'annual':
        return plan.annual_price;
      default:
        return plan.monthly_price;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getPerMonthLabel = () => {
    switch (selectedCycle) {
      case 'monthly':
        return '/month';
      case 'quarterly':
        return '/quarter';
      case 'annual':
        return '/year';
      default:
        return '/month';
    }
  };

  return (
    <Card 
      className={`h-full transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${variant === 'outlined' ? 'border-2' : ''} ${
        onSelect ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold">{formatPrice(getPrice())}</span>
          <span className="text-sm text-muted-foreground">{getPerMonthLabel()}</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Features:</p>
          <ul className="space-y-1">
            <li className="flex items-center text-sm">
              {plan.features.max_clients ? (
                <Check size={16} className="mr-2 text-green-500" />
              ) : (
                <X size={16} className="mr-2 text-red-500" />
              )}
              <span>Up to {plan.features.max_clients} clients</span>
            </li>
            <li className="flex items-center text-sm">
              {plan.features.max_diet_plans ? (
                <Check size={16} className="mr-2 text-green-500" />
              ) : (
                <X size={16} className="mr-2 text-red-500" />
              )}
              <span>{plan.features.max_diet_plans} diet plans per client</span>
            </li>
            <li className="flex items-center text-sm">
              {plan.features.ai_meal_generation ? (
                <Check size={16} className="mr-2 text-green-500" />
              ) : (
                <X size={16} className="mr-2 text-red-500" />
              )}
              <span>AI Meal Generation</span>
            </li>
            {plan.features.ai_meal_generation && (
              <li className="flex items-center text-sm">
                <Check size={16} className="mr-2 text-green-500" />
                <span>Up to {plan.features.ai_meal_generation_limit} AI generations</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      {showSubscribeButton && (
        <CardFooter>
          <Button className="w-full" onClick={onSubscribe}>
            Subscribe
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SubscriptionPlanCard;
