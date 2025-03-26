
import { api } from '@/lib/api';
import {
  ApiResponse,
  ApiResponseList,
  SubscriptionPlan,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
  GymSubscription,
  SubscribeGymRequest,
  UpdateGymSubscriptionRequest,
  CancelGymSubscriptionRequest,
  GymSubscriptionPlan,
  CreateGymSubscriptionPlanRequest,
  UpdateGymSubscriptionPlanRequest,
  ClientSubscription,
  CreateClientSubscriptionRequest,
  UpdateClientSubscriptionRequest,
  SubscribeUserRequest,
  SubscriptionPlanListResponse,
  GymSubscriptionPlanListResponse,
  ClientSubscriptionListResponse
} from '@/types/api';

// Platform Subscription Plans API

/**
 * Get all subscription plans (admin only)
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlanListResponse> => {
  return await api.get('/subscription-plans');
};

/**
 * Get public subscription plans
 */
export const getPublicSubscriptionPlans = async (): Promise<SubscriptionPlanListResponse> => {
  return await api.get('/public-subscription-plans');
};

/**
 * Create a new subscription plan (admin only)
 */
export const createSubscriptionPlan = async (
  data: CreateSubscriptionPlanRequest
): Promise<ApiResponse<SubscriptionPlan>> => {
  return await api.post('/subscription-plans', data);
};

/**
 * Get a subscription plan by ID
 */
export const getSubscriptionPlan = async (
  id: number
): Promise<ApiResponse<SubscriptionPlan>> => {
  return await api.get(`/subscription-plans/${id}`);
};

/**
 * Update a subscription plan (admin only)
 */
export const updateSubscriptionPlan = async (
  id: number,
  data: UpdateSubscriptionPlanRequest
): Promise<ApiResponse<SubscriptionPlan>> => {
  return await api.put(`/subscription-plans/${id}`, data);
};

/**
 * Delete a subscription plan (admin only)
 */
export const deleteSubscriptionPlan = async (
  id: number
): Promise<ApiResponse<null>> => {
  return await api.delete(`/subscription-plans/${id}`);
};

// Gym Subscriptions API

/**
 * Get gym's active subscription
 */
export const getGymSubscription = async (
  gymId: number
): Promise<ApiResponse<GymSubscription>> => {
  return await api.get(`/gyms/${gymId}/subscription`);
};

/**
 * Subscribe gym to a platform plan
 */
export const subscribeGym = async (
  gymId: number,
  data: SubscribeGymRequest
): Promise<ApiResponse<GymSubscription>> => {
  return await api.post(`/gyms/${gymId}/subscribe`, data);
};

/**
 * Update gym's subscription
 */
export const updateGymSubscription = async (
  gymId: number,
  data: UpdateGymSubscriptionRequest
): Promise<ApiResponse<GymSubscription>> => {
  return await api.put(`/gyms/${gymId}/subscription`, data);
};

/**
 * Cancel gym's subscription
 */
export const cancelGymSubscription = async (
  gymId: number,
  data: CancelGymSubscriptionRequest
): Promise<ApiResponse<GymSubscription>> => {
  return await api.post(`/gyms/${gymId}/subscription/cancel`, data);
};

// Gym Subscription Plans API (for clients)

/**
 * Get all gym subscription plans
 */
export const getGymSubscriptionPlans = async (
  gymId: number,
  active?: boolean
): Promise<GymSubscriptionPlanListResponse> => {
  const params = active !== undefined ? `?active=${active}` : '';
  return await api.get(`/gyms/${gymId}/subscription-plans${params}`);
};

/**
 * Get public gym subscription plans
 */
export const getPublicGymSubscriptionPlans = async (
  gymId: number
): Promise<GymSubscriptionPlanListResponse> => {
  return await api.get(`/gyms/${gymId}/public-subscription-plans`);
};

/**
 * Create a new gym subscription plan
 */
export const createGymSubscriptionPlan = async (
  gymId: number,
  data: CreateGymSubscriptionPlanRequest
): Promise<ApiResponse<GymSubscriptionPlan>> => {
  return await api.post(`/gyms/${gymId}/subscription-plans`, data);
};

/**
 * Get a gym subscription plan by ID
 */
export const getGymSubscriptionPlan = async (
  gymId: number,
  planId: number
): Promise<ApiResponse<GymSubscriptionPlan>> => {
  return await api.get(`/gyms/${gymId}/subscription-plans/${planId}`);
};

/**
 * Update a gym subscription plan
 */
export const updateGymSubscriptionPlan = async (
  gymId: number,
  planId: number,
  data: UpdateGymSubscriptionPlanRequest
): Promise<ApiResponse<GymSubscriptionPlan>> => {
  return await api.put(`/gyms/${gymId}/subscription-plans/${planId}`, data);
};

/**
 * Delete a gym subscription plan
 */
export const deleteGymSubscriptionPlan = async (
  gymId: number,
  planId: number
): Promise<ApiResponse<null>> => {
  return await api.delete(`/gyms/${gymId}/subscription-plans/${planId}`);
};

// Client Subscriptions API

/**
 * Get all client subscriptions
 */
export const getClientSubscriptions = async (
  gymId?: number,
  status?: string
): Promise<ClientSubscriptionListResponse> => {
  let params = '';
  if (gymId || status) {
    params = '?';
    if (gymId) {
      params += `gym_id=${gymId}`;
    }
    if (status) {
      params += gymId ? `&status=${status}` : `status=${status}`;
    }
  }
  return await api.get(`/client-subscriptions${params}`);
};

/**
 * Create a new client subscription
 */
export const createClientSubscription = async (
  data: CreateClientSubscriptionRequest
): Promise<ApiResponse<ClientSubscription>> => {
  return await api.post('/client-subscriptions', data);
};

/**
 * Get a client subscription by ID
 */
export const getClientSubscription = async (
  id: number
): Promise<ApiResponse<ClientSubscription>> => {
  return await api.get(`/client-subscriptions/${id}`);
};

/**
 * Update a client subscription
 */
export const updateClientSubscription = async (
  id: number,
  data: UpdateClientSubscriptionRequest
): Promise<ApiResponse<ClientSubscription>> => {
  return await api.put(`/client-subscriptions/${id}`, data);
};

/**
 * Delete a client subscription
 */
export const deleteClientSubscription = async (
  id: number
): Promise<ApiResponse<null>> => {
  return await api.delete(`/client-subscriptions/${id}`);
};

/**
 * Subscribe a user to a gym plan
 */
export const subscribeUser = async (
  userId: number,
  data: SubscribeUserRequest
): Promise<ApiResponse<ClientSubscription>> => {
  return await api.post(`/users/${userId}/subscribe`, data);
};

/**
 * Generate meals for a meal plan using AI (subscription required)
 */
export const generateAIMeals = async (
  dietPlanId: number,
  mealPlanId: number
): Promise<ApiResponse<any>> => {
  return await api.post(`/diet-plans/${dietPlanId}/meal-plans/${mealPlanId}/generate-ai`, {});
};
