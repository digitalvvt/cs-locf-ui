
export interface UserInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'faculty' | 'iqac' | 'hod' | 'coordinator';
  invited_by: string | null;
  invitation_token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitation_message: string | null;
}

export interface UserRoleHistory {
  id: string;
  user_id: string;
  organization_id: string;
  old_role: string | null;
  new_role: string;
  changed_by: string | null;
  changed_at: string;
  reason: string | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  organization_id: string | null;
  session_start: string;
  session_end: string | null;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
}

export interface EnhancedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization_id: string | null;
  organization_name?: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role_history?: UserRoleHistory[];
  active_sessions?: UserSession[];
}
