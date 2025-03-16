import { toast } from "@/hooks/use-toast";
import { LoginRequest, RegisterRequest, AuthResponse, ApiError, User } from "@/types/auth";

const API_URL = "https://phpstack-1335001-5338259.cloudwaysapps.com"; // Updated API URL

// Helper to handle API errors
const handleApiError = (error: any): never => {
  console.error("API Error:", error);
  
  if (error.errors) {
    // Handle validation errors
    Object.values(error.errors).forEach((messages: any) => {
      if (Array.isArray(messages)) {
        messages.forEach(message => toast({ title: "Error", description: message, variant: "destructive" }));
      }
    });
  } else if (error.message) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } else {
    toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
  }
  
  throw error;
};

// API request wrapper with authentication
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = localStorage.getItem("auth_token");
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return handleApiError(data as ApiError);
    }
    
    return data as T;
  } catch (error) {
    return handleApiError(error as ApiError);
  }
};

// Login function
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  
  // Store token
  localStorage.setItem("auth_token", data.token);
  
  return data;
};

// Register function
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  
  // Store token
  localStorage.setItem("auth_token", data.token);
  
  return data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>("/api/auth/me");
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await apiRequest("/api/auth/logout", {
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
