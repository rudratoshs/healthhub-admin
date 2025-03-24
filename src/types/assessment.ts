
import { DietPlan } from './dietPlan';

export type AssessmentType = 'diet' | 'fitness' | 'health';
export type AssessmentStatus = 'in_progress' | 'completed' | 'abandoned';

export interface Assessment {
  id: number;
  user_id: number;
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  current_phase: number;
  current_question: string;
  responses: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: number;
  assessment_id: number;
  diet_plan_id: number | null;
  workout_plan_id: number | null;
  summary: string;
  recommendations: string[];
  diet_plan?: DietPlan;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse {
  data: Assessment;
}

export interface AssessmentResultResponse {
  data: AssessmentResult;
}

export interface AssessmentListResponse {
  data: Assessment[];
}

// Request types
export interface StartAssessmentRequest {
  assessment_type: AssessmentType;
}

export interface UpdateAssessmentRequest {
  current_phase?: number;
  current_question?: string;
  responses?: Record<string, any>;
}

export interface CompleteAssessmentRequest {
  final_responses: Record<string, any>;
}

// For the multi-step form
export interface AssessmentFormData extends Record<string, any> {
  age?: number;
  gender?: string;
  height?: number;
  current_weight?: number;
  target_weight?: number;
  activity_level?: string;
  health_conditions?: string[];
  allergies?: string[];
  diet_type?: string;
  plan_type?: string;
  [key: string]: any;
}

// Assessment form phases configuration
export interface AssessmentPhase {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'radio' | 'checkbox';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  helpText?: string;
}

// Assessment phases configuration
export const ASSESSMENT_PHASES: AssessmentPhase[] = [
  {
    title: "Basic Information",
    description: "Let's start with some basic information about you",
    questions: [
      {
        id: "age",
        label: "How old are you?",
        type: "number",
        required: true,
        placeholder: "Enter your age",
        helpText: "Your age helps us determine appropriate calorie intake"
      },
      {
        id: "gender",
        label: "What is your gender?",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" }
        ],
        required: true
      },
      {
        id: "height",
        label: "What is your height (in cm)?",
        type: "number",
        required: true,
        placeholder: "Enter your height"
      },
      {
        id: "current_weight",
        label: "What is your current weight (in kg)?",
        type: "number",
        required: true,
        placeholder: "Enter your current weight"
      },
      {
        id: "target_weight",
        label: "What is your target weight (in kg)?",
        type: "number",
        required: true,
        placeholder: "Enter your target weight"
      }
    ]
  },
  {
    title: "Activity & Diet",
    description: "Tell us about your current activity level and diet preferences",
    questions: [
      {
        id: "activity_level",
        label: "What is your activity level?",
        type: "select",
        options: [
          { value: "sedentary", label: "Sedentary (little or no exercise)" },
          { value: "lightly_active", label: "Lightly active (light exercise/sports 1-3 days/week)" },
          { value: "moderately_active", label: "Moderately active (moderate exercise/sports 3-5 days/week)" },
          { value: "very_active", label: "Very active (hard exercise/sports 6-7 days a week)" },
          { value: "extra_active", label: "Extra active (very hard exercise & physical job or 2x training)" }
        ],
        required: true
      },
      {
        id: "diet_type",
        label: "Do you follow any specific diet?",
        type: "select",
        options: [
          { value: "no_restriction", label: "No specific diet" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "keto", label: "Ketogenic" },
          { value: "paleo", label: "Paleo" },
          { value: "mediterranean", label: "Mediterranean" }
        ],
        required: true
      }
    ]
  },
  {
    title: "Health & Preferences",
    description: "Help us understand any health concerns or dietary restrictions",
    questions: [
      {
        id: "health_conditions",
        label: "Do you have any health conditions?",
        type: "multiselect",
        options: [
          { value: "none", label: "None" },
          { value: "diabetes", label: "Diabetes" },
          { value: "hypertension", label: "Hypertension" },
          { value: "heart_disease", label: "Heart Disease" },
          { value: "thyroid_issues", label: "Thyroid Issues" }
        ],
        required: true
      },
      {
        id: "allergies",
        label: "Do you have any food allergies?",
        type: "multiselect",
        options: [
          { value: "none", label: "None" },
          { value: "gluten", label: "Gluten" },
          { value: "dairy", label: "Dairy" },
          { value: "nuts", label: "Nuts" },
          { value: "shellfish", label: "Shellfish" },
          { value: "eggs", label: "Eggs" }
        ],
        required: true
      }
    ]
  },
  {
    title: "Plan Preferences",
    description: "Tell us what kind of plan you're looking for",
    questions: [
      {
        id: "plan_type",
        label: "What type of diet plan would you prefer?",
        type: "select",
        options: [
          { value: "weight_loss", label: "Weight Loss" },
          { value: "maintenance", label: "Weight Maintenance" },
          { value: "muscle_gain", label: "Muscle Gain" },
          { value: "complete", label: "Complete Nutrition Plan" }
        ],
        required: true
      }
    ]
  }
];
