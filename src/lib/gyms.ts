
import { apiRequest } from "@/lib/api";
import { Gym, GymListResponse, CreateGymRequest, UpdateGymRequest, GymUserRequest } from "@/types/gym";
import { User, UserListResponse } from "@/types/user";

// Gyms API
export const getGyms = async (): Promise<GymListResponse> => {
  return apiRequest<GymListResponse>("/gyms");
};

export const getGym = async (id: number): Promise<Gym> => {
  return apiRequest<Gym>(`/gyms/${id}`);
};

export const createGym = async (data: CreateGymRequest): Promise<Gym> => {
  return apiRequest<Gym>("/gyms", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateGym = async (id: number, data: UpdateGymRequest): Promise<Gym> => {
  return apiRequest<Gym>(`/gyms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteGym = async (id: number): Promise<void> => {
  return apiRequest<void>(`/gyms/${id}`, {
    method: "DELETE",
  });
};

// Gym Users API
export const getGymUsers = async (
  gymId: number,
  params: { role?: string; status?: string; page?: number } = {}
): Promise<UserListResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.role && params.role !== 'all') {
    searchParams.append('role', params.role);
  }
  
  if (params.status && params.status !== 'all') {
    searchParams.append('status', params.status);
  }
  
  if (params.page) {
    searchParams.append('page', params.page.toString());
  }
  
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
  
  return apiRequest<UserListResponse>(`/gyms/${gymId}/users${queryString}`);
};

export const addUserToGym = async (gymId: number, data: GymUserRequest): Promise<User> => {
  return apiRequest<User>(`/gyms/${gymId}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const removeUserFromGym = async (gymId: number, userId: number): Promise<void> => {
  return apiRequest<void>(`/gyms/${gymId}/users/${userId}`, {
    method: "DELETE",
  });
};
