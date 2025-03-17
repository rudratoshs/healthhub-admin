
export interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGymRequest {
  name: string;
  address: string;
  phone: string;
}

export interface UpdateGymRequest {
  name?: string;
  address?: string;
  phone?: string;
}

export interface GymListResponse {
  data: Gym[];
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

export interface GymUserRequest {
  user_id: number;
  role: string;
  status: 'active' | 'inactive';
}

export interface GymUsersParams {
  role?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
}
