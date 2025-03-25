
export interface WebAssessmentStatus {
  has_active_assessment: boolean;
  has_completed_assessment: boolean;
  session_id: number | null;
  assessment_type: "basic" | "moderate" | "comprehensive";
  current_phase: number;
  current_question: string;
  completion_percentage: number;
  last_updated: string;
}

export interface WebAssessmentQuestion {
  question_id: string;
  prompt: string;
  validation: string | null;
  options: WebAssessmentOption[] | null;
  multiple: boolean;
  phase: number;
  header: string | null;
  body: string | null;
}

export interface WebAssessmentOption {
  id: string;
  label: string;
  value: string;
}

export interface WebAssessmentResponse {
  message: string;
  session_id: number;
  is_complete: boolean;
  next_question?: WebAssessmentQuestion;
}

export interface WebAssessmentResumeResponse {
  message: string;
  session_id: number;
  current_question: WebAssessmentQuestion;
  previous_responses: Record<string, { question: string; response: any }>;
}

export interface StartAssessmentRequest {
  assessment_type: "basic" | "moderate" | "comprehensive";
  abandon_existing: boolean;
}

export interface SubmitResponseRequest {
  session_id: number;
  question_id: string;
  response: any;
}

export interface ResumeAssessmentRequest {
  session_id: number;
}

export interface DeleteAssessmentRequest {
  session_id: number;
}
