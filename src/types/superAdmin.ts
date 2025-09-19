export interface DashboardStats {
  totalInstitutions: number;
  totalUsers: number;
  totalCourses: number;
  totalQuestions: number;
  activeUsersToday: number;
  systemUptime: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'university' | 'college' | 'institute' | 'school' | 'training_center';
  subdomain?: string;
  official_email: string;
  phone?: string;
  address?: any;
  website?: string;
  established_year?: number;
  affiliation?: any;
  accreditation?: any;
  subscription_tier: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'suspended' | 'cancelled' | 'expired' | 'pending';
  subscription_start_date?: string;
  subscription_end_date?: string;
  max_users: number;
  max_courses: number;
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval' | 'onboarding';
  onboarding_completed: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  user_count?: number;
  // Phase 2 additions
  features?: any;
  custom_branding?: any;
  integration_settings?: any;
  data_retention_days?: number;
  privacy_settings?: any;
  security_settings?: any;
  compliance_flags?: any;
  onboarding_step?: number;
}

export interface SuperAdminUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'support' | 'analyst' | 'billing_admin';
  permissions: any;
  avatar_url?: string;
  last_login?: string;
  timezone: string;
  mfa_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization_name?: string;
  status: string;
}

export interface OrganizationOnboarding {
  id: string;
  organization_id: string;
  current_step: number;
  total_steps: number;
  steps_completed: any;
  step_data?: any;
  started_at: string;
  completed_at?: string;
  completion_percentage: number;
  assigned_support_agent?: string;
  support_notes?: string;
  programs_configured: boolean;
  users_imported: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'university_autonomous' | 'affiliated_college' | 'technical_institute' | 'management_school' | 'arts_science' | 'engineering' | 'medical';
  config_data: any;
  default_pos?: any;
  default_psos?: any;
  is_active: boolean;
  is_system_template: boolean;
  applicable_for?: ('university' | 'college' | 'institute' | 'school' | 'training_center')[];
  version?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Phase 3 additions - Billing & Subscription Management
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  monthly_price?: number;
  annual_price?: number;
  currency: string;
  max_users: number;
  max_courses: number;
  max_storage_gb?: number;
  features: any;
  ai_questions_per_month?: number;
  ai_mappings_per_month?: number;
  ai_extractions_per_month?: number;
  support_level: 'email' | 'chat' | 'phone' | 'dedicated';
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface BillingHistory {
  id: string;
  organization_id: string;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  subtotal: number;
  tax_amount?: number;
  total_amount: number;
  currency: string;
  usage_details?: any;
  overage_charges?: any;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_paid';
  payment_method?: string;
  transaction_id?: string;
  payment_date?: string;
  notes?: string;
  generated_by?: string;
  created_at: string;
  updated_at: string;
  organization_name?: string;
}

// Phase 4 additions - System Monitoring & Analytics
export interface OrganizationUsageStats {
  id: string;
  organization_id: string;
  stats_date: string;
  stats_type: 'daily' | 'weekly' | 'monthly';
  active_users: number;
  total_logins: number;
  courses_created: number;
  syllabi_processed: number;
  ai_suggestions_used: number;
  storage_used_gb: number;
  created_at: string;
  organization_name?: string;
}

export interface SystemHealthLog {
  id: string;
  service_name: string;
  component?: string;
  status: 'healthy' | 'warning' | 'critical' | 'down';
  response_time_ms?: number;
  error_message?: string;
  server_location?: string;
  additional_data?: any;
  created_at: string;
}

// Phase 5 additions - Feature Usage & AI Performance Analytics
export interface FeatureUsageAnalytics {
  id: string;
  organization_id: string;
  feature_name: string;
  feature_category?: string;
  usage_count: number;
  first_used_at: string;
  last_used_at: string;
  stats_date: string;
  created_at: string;
  updated_at: string;
  organization_name?: string;
}

export interface AIPerformanceMetrics {
  id: string;
  organization_id?: string;
  operation_type: 'syllabus_extraction' | 'co_po_mapping' | 'question_generation' | 'blooms_classification' | 'content_analysis';
  model_used?: string;
  processing_time_ms: number;
  confidence_score?: number;
  accuracy_score?: number;
  tokens_consumed?: number;
  cost_incurred?: number;
  user_accepted?: boolean;
  created_at: string;
  organization_name?: string;
}

export interface CreateOrganizationData {
  name: string;
  code: string;
  type: 'university' | 'college' | 'institute' | 'school' | 'training_center';
  official_email: string;
  phone?: string;
  website?: string;
  established_year?: number;
  subscription_tier: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  max_users?: number;
  max_courses?: number;
  admin_name: string;
  admin_email: string;
  template_id?: string; // For using organization templates
}

// Phase 6 additions - Support System
export interface SupportTicket {
  id: string;
  ticket_number: string;
  organization_id?: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'training' | 'onboarding';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  created_by_email: string;
  assigned_to?: string;
  resolved_at?: string;
  customer_satisfaction_rating?: number;
  tags?: string[];
  attachments?: any;
  created_at: string;
  updated_at: string;
  organization_name?: string;
  assigned_agent_name?: string;
}

export interface SupportCommunication {
  id: string;
  ticket_id: string;
  message: string;
  sender_type: 'admin' | 'customer' | 'system';
  sender_id?: string;
  is_internal: boolean;
  created_at: string;
  sender_name?: string;
}

export interface CreateSupportTicketData {
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'training' | 'onboarding';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  created_by_email: string;
  organization_id?: string;
  tags?: string[];
}

export interface CreateSupportCommunicationData {
  ticket_id: string;
  message: string;
  sender_type: 'admin' | 'customer' | 'system';
  sender_id?: string;
  is_internal?: boolean;
}
