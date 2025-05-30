// src/types/dietPlan.ts
export type DietPlanStatus = 'active' | 'inactive' | 'completed';

export interface DietPlan {
  id: number;
  client_id: number;
  client_name?: string;
  title: string;
  description: string;
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  status: DietPlanStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface DietPlanListResponse {
  data: DietPlan[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface DietPlanResponse {
  data: DietPlan;
}

export interface CreateDietPlanRequest {
  client_id: number;
  title: string;
  description: string;
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  status: DietPlanStatus;
  start_date: string;
  end_date: string;
}

export interface UpdateDietPlanRequest {
  title?: string;
  description?: string;
  daily_calories?: number;
  protein_grams?: number;
  carbs_grams?: number;
  fats_grams?: number;
  status?: DietPlanStatus;
  start_date?: string;
  end_date?: string;
}

export interface DuplicateDietPlanRequest {
  new_title: string;
  client_id: number;
  start_date: string;
  end_date: string;
}

export interface DietPlanFilters {
  client_id?: string;
  status?: DietPlanStatus;
}

// Meal Plan types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface MealPlan {
  id: number;
  diet_plan_id: number;
  day: number;
  date: string;
  day_of_week?: DayOfWeek;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: number;
  meal_plan_id: number;
  meal_type: string;
  meal_type_display: string;
  title: string;
  description: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  time_of_day: string;
  recipes: {
    ingredients: string[];
    instructions: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: number;
  meal_id: number;
  name: string;
  quantity: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  created_at: string;
  updated_at: string;
}

export interface MealPlanListResponse {
  data: MealPlan[];
}

export interface MealPlanResponse {
  data: MealPlan;
}

export interface CreateMealPlanRequest {
  day_of_week: DayOfWeek;
  date?: string;
}
