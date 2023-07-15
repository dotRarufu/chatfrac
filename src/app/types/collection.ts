import { Database } from './supabase';

export type ResultRow = Database['public']['Tables']['result']['Row'];
export type CategoryRow = Database['public']['Tables']['category']['Row'];
