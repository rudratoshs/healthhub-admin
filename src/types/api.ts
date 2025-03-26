
export * from './auth';

/**
 * General API response type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponseList<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Add the export for subscription types
export * from './subscription';
