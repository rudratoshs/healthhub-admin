import { api } from "./api";
import { toast } from "@/hooks/use-toast";
import { WebDietPlan, WebMealPlan, WebMeal, ArchiveDietPlanRequest } from "@/types/webDietPlan";
import { ApiResponse, ApiResponseList } from "@/types/api";

/**
 * Get the active diet plan for the authenticated user
 */
export const getActiveDietPlan = async (): Promise<WebDietPlan> => {
  try {
    const response = await api.get<ApiResponse<WebDietPlan>>("/web-diet-plan/active");
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to retrieve active diet plan.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Get meal plan for a specific day
 */
export const getDayPlan = async (planId: number, day: string): Promise<WebMealPlan> => {
  try {
    const response = await api.get<ApiResponse<WebMealPlan>>(`/web-diet-plan/day?plan_id=${planId}&day=${day}`);
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to retrieve day plan.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Get detailed meal information
 */
export const getMealDetails = async (mealId: number): Promise<WebMeal> => {
  try {
    const response = await api.get<ApiResponse<WebMeal>>(`/web-diet-plan/meal?meal_id=${mealId}`);
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to retrieve meal details.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * List all diet plans for the authenticated user
 */
export const listDietPlans = async (): Promise<ApiResponseList<WebDietPlan>> => {
  try {
    const response = await api.get<ApiResponseList<WebDietPlan>>("/web-diet-plan/list");
    return response;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to retrieve diet plans.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Archive an existing diet plan
 */
export const archiveDietPlan = async (data: ArchiveDietPlanRequest): Promise<void> => {
  try {
    await api.post("/web-diet-plan/archive", data);
    toast({
      title: "Diet Plan Archived",
      description: "Your diet plan has been archived successfully."
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to archive diet plan.",
      variant: "destructive"
    });
    throw error;
  }
};