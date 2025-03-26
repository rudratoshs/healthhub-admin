/**
 * MealPlan Type Definition
 */
export interface MealPlan {
    id: number;
    diet_plan_id: number;
    day_of_week: string;
    meals: Meal[];
    created_at: string;
    updated_at: string;
  }
  
  /**
   * Meal Type Definition
   */
  export interface Meal {
    id: number;
    meal_plan_id: number;
    name: string;
    time: string;
    foods: Food[];
    created_at: string;
    updated_at: string;
  }
  
  /**
   * Food Type Definition
   */
  export interface Food {
    id: number;
    meal_id: number;
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }
  
  /**
   * Request type for creating a meal plan
   */
  export interface CreateMealPlanRequest {
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  }