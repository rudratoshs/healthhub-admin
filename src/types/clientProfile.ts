// Define the field structure used in the categories
export interface FieldDefinition {
  type: string;
  options: string[] | null;
}

// Define the structure for a category
export interface Category {
  name: string;
  description: string;
  data: Record<string, any>;
  fields: Record<string, FieldDefinition>;
}

// Updated ClientProfile interface to use the categorized structure
export interface ClientProfile {
  id: number;
  user_id: number;
  categories: Record<string, Category>;
  created_at: string;
  updated_at: string;
}

export interface ClientProfileResponse {
  data: ClientProfile;
}

// Helper function to get a value from the categorized structure
export function getProfileValue<T>(profile: ClientProfile, fieldName: string): T | null {
  for (const categoryKey in profile.categories) {
    const category = profile.categories[categoryKey];
    if (fieldName in category.data) {
      return category.data[fieldName] as T;
    }
  }
  return null;
}

// Helper function to find the category containing a field
export function findCategoryForField(profile: ClientProfile, fieldName: string): Category | null {
  for (const categoryKey in profile.categories) {
    const category = profile.categories[categoryKey];
    if (fieldName in category.data || fieldName in category.fields) {
      return category;
    }
  }
  return null;
}

// These request interfaces remain unchanged for API compatibility
export interface CreateClientProfileRequest {
  age?: number;
  gender?: string;
  height?: number;
  current_weight?: number;
  target_weight?: number;
  country?: string;
  state?: string;
  city?: string;
  activity_level?: string;
  diet_type?: string;
  health_conditions?: string[];
  health_details?: string;
  allergies?: string[];
  recovery_needs?: string[];
  organ_recovery_details?: string;
  medications?: string;
  medication_details?: string;
  cuisine_preferences?: string[];
  meal_timing?: string;
  food_restrictions?: string[];
  meal_preferences?: string[];
  meal_variety?: string;
  daily_schedule?: string;
  cooking_capability?: string;
  exercise_routine?: string;
  stress_sleep?: string;
  primary_goal?: string;
  goal_timeline?: string;
  commitment_level?: string;
  additional_requests?: string;
  measurement_preference?: string;
  plan_type?: string;
}

export interface UpdateClientProfileRequest extends CreateClientProfileRequest { }

// For backward compatibility, we can define a type that flattens the categorized structure
export type FlatClientProfile = {
  id: number;
  user_id: number;
  age: number;
  gender: string;
  height: string;
  current_weight: string;
  target_weight: string;
  country: string | null;
  state: string | null;
  city: string | null;
  activity_level: string;
  diet_type: string;
  health_conditions: string[];
  health_details: string | null;
  allergies: string[];
  recovery_needs: string[];
  organ_recovery_details: string | null;
  medications: string | null;
  medication_details: string | null;
  cuisine_preferences: string | null;
  meal_timing: string | null;
  food_restrictions: string | null;
  meal_preferences: string[];
  meal_variety: string | null;
  daily_schedule: string | null;
  cooking_capability: string | null;
  exercise_routine: string | null;
  stress_sleep: string | null;
  primary_goal: string;
  goal_timeline: string | null;
  commitment_level: string | null;
  additional_requests: string | null;
  measurement_preference: string | null;
  plan_type: string;
  bmi: number;
  bmr: number;
  daily_calories: number;
  weight_goal_type: string;
  weight_difference: number;
  activity_level_display: string;
  diet_type_display: string;
  meal_timing_display: string;
  stress_sleep_display: string;
  primary_goal_display: string;
  plan_type_display: string;
  created_at: string;
  updated_at: string;
}

// Helper function to convert categorized structure to flat format
export function flattenClientProfile(profile: ClientProfile): FlatClientProfile {
  const flat: any = {
    id: profile.id,
    user_id: profile.user_id,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };

  // Extract all fields from all categories into the flat structure
  for (const categoryKey in profile.categories) {
    const category = profile.categories[categoryKey];
    for (const fieldKey in category.data) {
      flat[fieldKey] = category.data[fieldKey];
    }
  }

  return flat as FlatClientProfile;
}