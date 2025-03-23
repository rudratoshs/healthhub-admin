
// src/lib/dietPlans.ts
import { apiRequest } from '@/lib/api';
import {
  DietPlanResponse,
  DietPlanListResponse,
  CreateDietPlanRequest,
  UpdateDietPlanRequest,
  DuplicateDietPlanRequest,
  DietPlanFilters,
  MealPlanListResponse
} from '@/types/dietPlan';

// Get all diet plans with optional filters
export const getDietPlans = async (filters?: DietPlanFilters): Promise<DietPlanListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters?.client_id) {
    queryParams.append('client_id', filters.client_id);
  }
  
  if (filters?.status) {
    queryParams.append('status', filters.status);
  }
  
  const endpoint = `/diet-plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiRequest<DietPlanListResponse>(endpoint);
};

// Get a single diet plan by ID
export const getDietPlan = async (id: number): Promise<DietPlanResponse> => {
  return apiRequest<DietPlanResponse>(`/diet-plans/${id}`);
};

// Create a new diet plan
export const createDietPlan = async (data: CreateDietPlanRequest): Promise<DietPlanResponse> => {
  return apiRequest<DietPlanResponse>('/diet-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update an existing diet plan
export const updateDietPlan = async (id: number, data: UpdateDietPlanRequest): Promise<DietPlanResponse> => {
  return apiRequest<DietPlanResponse>(`/diet-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete a diet plan
export const deleteDietPlan = async (id: number): Promise<void> => {
  return apiRequest<void>(`/diet-plans/${id}`, {
    method: 'DELETE',
  });
};

// Get meal plans for a diet plan
export const getDietPlanMealPlans = async (dietPlanId: number): Promise<MealPlanListResponse> => {
  return apiRequest<MealPlanListResponse>(`/diet-plans/${dietPlanId}/meal-plans`);
};

// Duplicate a diet plan
export const duplicateDietPlan = async (id: number, data: DuplicateDietPlanRequest): Promise<DietPlanResponse> => {
  return apiRequest<DietPlanResponse>(`/diet-plans/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
