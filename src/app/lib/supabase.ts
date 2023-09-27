import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export const client: SupabaseClient<Database> = createClient(
  'https://sysebcpqnqjthlfowqtl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5c2ViY3BxbnFqdGhsZm93cXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg5OTY2NTMsImV4cCI6MjAwNDU3MjY1M30.VwBNb31UtzlWXnuRf5cYbCYd67Rrqz4X28toUH-MeAs',
);
