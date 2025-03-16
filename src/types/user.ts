
export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  whatsapp_phone?: string | null;
  status: 'active' | 'inactive' | 'pending';
  role?: 'admin' | 'gym_admin' | 'trainer' | 'dietitian' | 'client'; // For backward compatibility
  roles?: string[]; // New field from API response
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
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface RoleResponse {
  roles: string[];
}
