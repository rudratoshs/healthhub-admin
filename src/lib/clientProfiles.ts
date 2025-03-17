
import { apiRequest } from "./api";
import { ClientProfileResponse, CreateClientProfileRequest, UpdateClientProfileRequest } from "@/types/clientProfile";

export const getClientProfile = async (userId: number): Promise<ClientProfileResponse> => {
  return apiRequest<ClientProfileResponse>(`/users/${userId}/profile`, {
    method: "GET",
  });
};

export const createClientProfile = async (
  userId: number,
  data: CreateClientProfileRequest
): Promise<ClientProfileResponse> => {
  return apiRequest<ClientProfileResponse>(`/users/${userId}/profile`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateClientProfile = async (
  userId: number,
  data: UpdateClientProfileRequest
): Promise<ClientProfileResponse> => {
  return apiRequest<ClientProfileResponse>(`/users/${userId}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
