
import { toast } from "@/hooks/use-toast";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";
import { apiRequest } from "@/lib/api";

// Login function
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  
  // Store token
  localStorage.setItem("auth_token", data.token);
  
  return data;
};

// Register function
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  
  // Store token
  localStorage.setItem("auth_token", data.token);
  
  return data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>("/auth/me");
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    // Always clear token even if API call fails
    localStorage.removeItem("auth_token");
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token");
};
