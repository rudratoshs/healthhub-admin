
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp_phone?: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'gym_admin' | 'trainer' | 'dietitian' | 'client';
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  whatsapp_phone?: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'gym_admin' | 'trainer' | 'dietitian' | 'client';
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  whatsapp_phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  role?: 'admin' | 'gym_admin' | 'trainer' | 'dietitian' | 'client';
}

export interface UserListParams {
  role?: 'admin' | 'gym_admin' | 'trainer' | 'dietitian' | 'client';
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
  page?: number;
}

export interface UserListResponse {
  data: User[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface RoleResponse {
  roles: string[];
}
