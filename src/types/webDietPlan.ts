
import { DietPlan } from "./dietPlan";
import { MealPlan } from "./mealPlan";

export interface WebDietPlan extends DietPlan {
  meal_plans?: WebMealPlan[];
}

export interface WebMealPlan extends MealPlan {
  meals?: WebMeal[];
}

export interface WebMeal {
  id: number;
  meal_plan_id: number;
  name: string;
  description: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  time_of_day: string;
  recipes: WebRecipe[];
  created_at: string;
  updated_at: string;
}

export interface WebRecipe {
  id: number;
  meal_id: number;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition_info: {
    calories: number;
    protein_grams: number;
    carbs_grams: number;
    fats_grams: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ArchiveDietPlanRequest {
  plan_id: number;
}
