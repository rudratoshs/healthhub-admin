
// This file will contain general API types or can be used as a barrel file
// to re-export types from feature-specific type files

export * from './auth';

/**
 * General API response type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
