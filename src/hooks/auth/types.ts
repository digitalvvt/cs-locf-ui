
import { User } from '@supabase/supabase-js';
import { SuperAdminUser } from '@/types/superAdmin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  organization_id: string | null;
  role: 'super_admin' | 'admin' | 'faculty' | 'iqac' | 'hod' | 'coordinator';
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  superAdminProfile: SuperAdminUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isSuperAdmin: boolean;
}

export interface AuthMethods {
  retryAuth: () => Promise<void>;
  forceSignOut: () => Promise<void>;
}

export type SimplifiedAuthState = AuthState & AuthMethods;
