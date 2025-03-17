
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/types/auth";

const API_URL = "http://localhost:8000/api";

// Helper to handle API errors
export const handleApiError = (error: any): never => {
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
export const apiRequest = async <T>(
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
