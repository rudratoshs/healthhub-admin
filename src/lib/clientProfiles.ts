
import { api } from '@/lib/api';
import {
  ClientProfile,
  ClientProfileResponse,
  CreateClientProfileRequest,
  UpdateClientProfileRequest,
} from '@/types/clientProfile';
import { ApiResponseList } from '@/types/api';

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

export const getClientProfiles = async (): Promise<ApiResponseList<ClientProfile>> => {
  return await api.get('/client-profiles');
};

export const getClientProfile = async (id: number): Promise<{ data: ClientProfile }> => {
  return await api.get(`/client-profiles/${id}`);
};

export const createClientProfile = async (
  data: CreateClientProfileRequest
): Promise<{ data: ClientProfile }> => {
  return await api.post('/client-profiles', data);
};

export const updateClientProfile = async (
  id: number,
  data: UpdateClientProfileRequest
): Promise<{ data: ClientProfile }> => {
  return await api.put(`/client-profiles/${id}`, data);
};

export const deleteClientProfile = async (id: number): Promise<void> => {
  return await api.delete(`/client-profiles/${id}`);
};
