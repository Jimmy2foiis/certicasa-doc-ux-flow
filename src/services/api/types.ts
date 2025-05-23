
// Import existing types to maintain compatibility
import { Client } from '../supabase/types';

export type { Client };

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
