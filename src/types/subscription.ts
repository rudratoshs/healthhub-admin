
export interface SubscriptionPlan {
  id: number;
  name: string;
  code: string;
  description: string;
  monthly_price: number;
  quarterly_price: number;
  annual_price: number;
  features: {
    max_clients: number;
    max_diet_plans: number;
    ai_meal_generation: boolean;
    ai_meal_generation_limit: number;
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  code: string;
  description: string;
  monthly_price: number;
  quarterly_price: number;
  annual_price: number;
  features: {
    max_clients: number;
    max_diet_plans: number;
    ai_meal_generation: boolean;
    ai_meal_generation_limit: number;
    [key: string]: any;
  };
  is_active: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string;
  description?: string;
  monthly_price?: number;
  quarterly_price?: number;
  annual_price?: number;
  features?: {
    max_clients?: number;
    max_diet_plans?: number;
    ai_meal_generation?: boolean;
    ai_meal_generation_limit?: number;
    [key: string]: any;
  };
  is_active?: boolean;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface GymSubscription {
  id: number;
  gym_id: number;
  subscription_plan_id: number;
  subscription_plan: SubscriptionPlan;
  billing_cycle: BillingCycle;
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_provider: string;
  payment_method_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubscribeGymRequest {
  plan_id: number;
  billing_cycle: BillingCycle;
  payment_provider: string;
  payment_method_id: string;
  payment_data?: Record<string, any>;
}

export interface UpdateGymSubscriptionRequest {
  plan_id?: number;
  payment_method_id?: string;
}

export interface CancelGymSubscriptionRequest {
  at_period_end: boolean;
}

// Gym subscription plans for clients
export interface GymSubscriptionPlan {
  id: number;
  gym_id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: BillingCycle;
  features: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGymSubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
  billing_cycle: BillingCycle;
  features: Record<string, any>;
  is_active: boolean;
}

export interface UpdateGymSubscriptionPlanRequest {
  name?: string;
  description?: string;
  price?: number;
  billing_cycle?: BillingCycle;
  features?: Record<string, any>;
  is_active?: boolean;
}

// Client subscriptions
export interface ClientSubscription {
  id: number;
  user_id: number;
  gym_id: number;
  gym_subscription_plan_id: number;
  gym_subscription_plan: GymSubscriptionPlan;
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_status: 'paid' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CreateClientSubscriptionRequest {
  user_id: number;
  gym_id: number;
  gym_subscription_plan_id: number;
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  auto_renew: boolean;
  payment_status: 'paid' | 'pending' | 'failed';
}

export interface UpdateClientSubscriptionRequest {
  status?: 'active' | 'canceled' | 'expired';
  end_date?: string;
  auto_renew?: boolean;
  payment_status?: 'paid' | 'pending' | 'failed';
}

export interface SubscribeUserRequest {
  gym_id: number;
  gym_subscription_plan_id: number;
  auto_renew: boolean;
  payment_status: 'paid' | 'pending' | 'failed';
}

export interface SubscriptionPlanListResponse {
  data: SubscriptionPlan[];
}

export interface GymSubscriptionPlanListResponse {
  data: GymSubscriptionPlan[];
}

export interface ClientSubscriptionListResponse {
  data: ClientSubscription[];
}
