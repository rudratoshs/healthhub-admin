
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

/**
 * Get the assessment status for the authenticated user
 */
export const getWebAssessmentStatus = async (): Promise<WebAssessmentStatus> => {
  try {
    const response = await api.get<{ data: WebAssessmentStatus }>("/web-assessment/status");
    return response.data;
  } catch (error) {
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
    const response = await api.post<{ data: WebAssessmentResponse }>("/web-assessment/start", data);
    toast({
      title: "Assessment Started",
      description: "Your assessment has been started successfully."
    });
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to start assessment.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Get the current question for an assessment session
 */
export const getWebAssessmentQuestion = async (sessionId: number): Promise<WebAssessmentQuestion> => {
  try {
    const response = await api.get<{ data: WebAssessmentQuestion }>(`/web-assessment/question?session_id=${sessionId}`);
    return response.data;
  } catch (error) {
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
    const response = await api.post<{ data: WebAssessmentResponse }>("/web-assessment/respond", data);
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to submit response.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Resume an existing assessment
 */
export const resumeWebAssessment = async (data: ResumeAssessmentRequest): Promise<WebAssessmentResumeResponse> => {
  try {
    const response = await api.post<{ data: WebAssessmentResumeResponse }>("/web-assessment/resume", data);
    toast({
      title: "Assessment Resumed",
      description: "Your assessment has been resumed successfully."
    });
    return response.data;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to resume assessment.",
      variant: "destructive"
    });
    throw error;
  }
};
