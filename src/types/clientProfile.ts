
export interface ClientProfile {
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

export interface ClientProfileResponse {
  data: ClientProfile;
}

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

export interface UpdateClientProfileRequest extends CreateClientProfileRequest {}
