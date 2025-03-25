
import { api } from "./api";
import { toast } from "@/hooks/use-toast";
import {
  WebAssessmentStatus,
  WebAssessmentQuestion,
  WebAssessmentResponse,
  WebAssessmentResumeResponse,
  StartAssessmentRequest,
  SubmitResponseRequest,
  ResumeAssessmentRequest
} from "@/types/webAssessment";
import { ApiResponse } from "@/types/api";

/**
 * Get the assessment status for the authenticated user
 */
export const getWebAssessmentStatus = async (): Promise<WebAssessmentStatus> => {
  try {
    const response = await api.get<ApiResponse<WebAssessmentStatus>>("/web-assessment/status");
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve assessment status:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve assessment status.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Start a new assessment
 */
export const startWebAssessment = async (data: StartAssessmentRequest): Promise<WebAssessmentResponse> => {
  try {
    const response = await api.post<ApiResponse<WebAssessmentResponse>>("/web-assessment/start", data);
    if (!data.abandon_existing) {
      toast({
        title: "Assessment Started",
        description: "Your assessment has been started successfully."
      });
    } else {
      toast({
        title: "New Assessment Started",
        description: "Your previous assessment has been abandoned and a new one started."
      });
    }
    return response.data;
  } catch (error) {
    console.error("Failed to start assessment:", error);
    // We don't show toast here because we handle errors in the hook
    throw error;
  }
};

/**
 * Get the current question for an assessment session
 */
export const getWebAssessmentQuestion = async (sessionId: number): Promise<WebAssessmentQuestion> => {
  try {
    const response = await api.get<ApiResponse<WebAssessmentQuestion>>(`/web-assessment/question?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve assessment question:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve assessment question.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Submit a response to the current question
 */
export const submitWebAssessmentResponse = async (data: SubmitResponseRequest): Promise<WebAssessmentResponse> => {
  try {
    const response = await api.post<ApiResponse<WebAssessmentResponse>>("/web-assessment/respond", data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit response:", error);
    // We don't show toast here because we handle errors in the hook
    throw error;
  }
};

/**
 * Resume an existing assessment
 */
export const resumeWebAssessment = async (data: ResumeAssessmentRequest): Promise<WebAssessmentResumeResponse> => {
  try {
    const response = await api.post<ApiResponse<WebAssessmentResumeResponse>>("/web-assessment/resume", data);
    return response.data;
  } catch (error) {
    console.error("Failed to resume assessment:", error);
    // We don't show toast here because we handle errors in the hook
    throw error;
  }
};
