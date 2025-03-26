import { api } from "@/lib/api";
import { 
  AIConfiguration, 
  CreateAIConfigurationRequest, 
  UpdateAIConfigurationRequest, 
  TestAIConfigurationRequest, 
  TestAIConfigurationResponse 
} from "@/types/aiConfiguration";
import { ApiResponseList } from "@/types/api";

// List AI configurations for a gym
export const getAIConfigurations = async (gymId: number): Promise<ApiResponseList<AIConfiguration>> => {
  return await api.get(`/gyms/${gymId}/ai-configurations`);
};

// Get a specific AI configuration
export const getAIConfiguration = async (gymId: number, configId: number): Promise<{ data: AIConfiguration }> => {
  return await api.get(`/gyms/${gymId}/ai-configurations/${configId}`);
};

// Create a new AI configuration
export const createAIConfiguration = async (
  gymId: number,
  data: CreateAIConfigurationRequest
): Promise<{ data: AIConfiguration }> => {
  return await api.post(`/gyms/${gymId}/ai-configurations`, data);
};

// Update an existing AI configuration
export const updateAIConfiguration = async (
  gymId: number,
  configId: number,
  data: UpdateAIConfigurationRequest
): Promise<{ data: AIConfiguration }> => {
  return await api.put(`/gyms/${gymId}/ai-configurations/${configId}`, data);
};

// Delete an AI configuration
export const deleteAIConfiguration = async (gymId: number, configId: number): Promise<void> => {
  return await api.delete(`/gyms/${gymId}/ai-configurations/${configId}`);
};

// Test an AI configuration
export const testAIConfiguration = async (
  gymId: number,
  configId: number,
  data: TestAIConfigurationRequest
): Promise<{ data: TestAIConfigurationResponse }> => {
  return await api.post(`/gyms/${gymId}/ai-configurations/${configId}/test`, data);
};