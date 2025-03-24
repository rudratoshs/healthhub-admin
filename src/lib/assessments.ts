
import { api } from './api';
import { toast } from '@/hooks/use-toast';
import {
  Assessment,
  AssessmentResult,
  AssessmentResponse,
  AssessmentResultResponse,
  AssessmentListResponse,
  StartAssessmentRequest,
  UpdateAssessmentRequest,
  CompleteAssessmentRequest
} from '@/types/assessment';

/**
 * Start a new assessment for a user
 */
export const startAssessment = async (userId: number, data: StartAssessmentRequest): Promise<Assessment> => {
  try {
    const response = await api.post<AssessmentResponse>(`/users/${userId}/assessments`, data);
    toast({
      title: 'Assessment Started',
      description: 'Your assessment has been started successfully.'
    });
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to start assessment.',
      variant: 'destructive'
    });
    throw error;
  }
};

/**
 * Get assessment by ID
 */
export const getAssessment = async (id: number): Promise<Assessment> => {
  try {
    const response = await api.get<AssessmentResponse>(`/assessments/${id}`);
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to retrieve assessment.',
      variant: 'destructive'
    });
    throw error;
  }
};

/**
 * Update assessment progress
 */
export const updateAssessment = async (id: number, data: UpdateAssessmentRequest): Promise<Assessment> => {
  try {
    const response = await api.put<AssessmentResponse>(`/assessments/${id}`, data);
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update assessment.',
      variant: 'destructive'
    });
    throw error;
  }
};

/**
 * Complete an assessment
 */
export const completeAssessment = async (id: number, data: CompleteAssessmentRequest): Promise<Assessment> => {
  try {
    const response = await api.post<AssessmentResponse>(`/assessments/${id}/complete`, data);
    toast({
      title: 'Assessment Completed',
      description: 'Your assessment has been completed successfully.'
    });
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to complete assessment.',
      variant: 'destructive'
    });
    throw error;
  }
};

/**
 * Get the result of a completed assessment
 */
export const getAssessmentResult = async (id: number): Promise<AssessmentResult> => {
  try {
    const response = await api.get<AssessmentResultResponse>(`/assessments/${id}/result`);
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to retrieve assessment result.',
      variant: 'destructive'
    });
    throw error;
  }
};

/**
 * Get all assessments for a user
 */
export const getUserAssessments = async (userId: number): Promise<Assessment[]> => {
  try {
    const response = await api.get<AssessmentListResponse>(`/users/${userId}/assessments`);
    return response.data;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to retrieve user assessments.',
      variant: 'destructive'
    });
    throw error;
  }
};
