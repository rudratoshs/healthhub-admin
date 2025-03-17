
import { toast } from "@/hooks/use-toast";
import { CreateUserRequest, UpdateUserRequest, User, UserListParams, UserListResponse, RoleResponse } from "@/types/user";
import { apiRequest } from "@/lib/api";

// Get users with optional filters
export const getUsers = async (params: UserListParams = {}): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.role && params.role !== "all") queryParams.append("role", params.role); // ✅ Omit "all"
  if (params.status && params.status !== "all") queryParams.append("status", params.status); // ✅ Omit "all"
  if (params.search) queryParams.append("search", params.search);
  if (params.page) queryParams.append("page", params.page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/users${queryString ? `?${queryString}` : ""}`;

  return apiRequest<UserListResponse>(endpoint);
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  return apiRequest<User>(`/users/${id}`);
};

// Create new user
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  try {
    const user = await apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    toast({
      title: "User created",
      description: `${userData.name} has been added successfully.`,
      variant: "default",
    });

    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: number, userData: UpdateUserRequest): Promise<User> => {
  try {
    const user = await apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    toast({
      title: "User updated",
      description: `User has been updated successfully.`,
      variant: "default",
    });

    return user;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });

    toast({
      title: "User deleted",
      description: "User has been deleted successfully.",
      variant: "default",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// Get available roles
export const getRoles = async (): Promise<string[]> => {
  const response = await apiRequest<RoleResponse>('/roles');
  return response.roles;
};
