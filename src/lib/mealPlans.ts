import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { MealPlan, CreateMealPlanRequest } from '@/types/mealPlan';

/**
 * Get a single meal plan by ID
 */
export const getMealPlan = async (dietPlanId: number, mealPlanId: number): Promise<ApiResponse<MealPlan>> => {
  return await api.get(`/diet-plans/${dietPlanId}/meal-plans/${mealPlanId}`);
};

/**
 * Create a new meal plan
 */
export const createMealPlan = async (
  dietPlanId: number,
  data: CreateMealPlanRequest
): Promise<ApiResponse<MealPlan>> => {
  return await api.post(`/diet-plans/${dietPlanId}/meal-plans`, data);
};

/**
 * Delete a meal plan
 */
export const deleteMealPlan = async (
  dietPlanId: number,
  mealPlanId: number
): Promise<ApiResponse<null>> => {
  return await api.delete(`/diet-plans/${dietPlanId}/meal-plans/${mealPlanId}`);
};
