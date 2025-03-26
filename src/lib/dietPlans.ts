// src/lib/dietPlans.ts
import { apiRequest } from '@/lib/api';
import {
  DietPlanResponse,
  DietPlanListResponse,
  CreateDietPlanRequest,
  UpdateDietPlanRequest,
  DuplicateDietPlanRequest,
  DietPlanFilters,
  MealPlanListResponse,
  MealPlanResponse,
  CreateMealPlanRequest
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

// Duplicate a diet plan
export const duplicateDietPlan = async (id: number, data: DuplicateDietPlanRequest): Promise<DietPlanResponse> => {
  return apiRequest<DietPlanResponse>(`/diet-plans/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Get meal plans for a diet plan
export const getDietPlanMealPlans = async (dietPlanId: number): Promise<MealPlanListResponse> => {
  return apiRequest<MealPlanListResponse>(`/diet-plans/${dietPlanId}/meal-plans`);
};

// Get a specific meal plan by ID
export const getMealPlan = async (dietPlanId: number, mealPlanId: number): Promise<MealPlanResponse> => {
  return apiRequest<MealPlanResponse>(`/diet-plans/${dietPlanId}/meal-plans/${mealPlanId}`);
};

// Create a new meal plan
export const createMealPlan = async (dietPlanId: number, data: CreateMealPlanRequest): Promise<MealPlanResponse> => {
  return apiRequest<MealPlanResponse>(`/diet-plans/${dietPlanId}/meal-plans`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Delete a meal plan
export const deleteMealPlan = async (dietPlanId: number, mealPlanId: number): Promise<void> => {
  return apiRequest<void>(`/diet-plans/${dietPlanId}/meal-plans/${mealPlanId}`, {
    method: 'DELETE',
  });
};