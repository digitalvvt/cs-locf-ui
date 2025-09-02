
/**
 * Core analytics types for standard analytics (complement to advanced analytics)
 */

export interface ActivityMetrics {
  activeUsers: number;
  totalUsers: number;
  totalSessions: number;
  averageSessionDuration: number;  // in minutes
  invitationSuccessRate: number;   // percentage
  healthScore: number;             // 0-100 scale
  engagementScore: number;         // 0-100 scale
  timeRange: string;
}

export interface OrganizationAnalyticsSummary {
  id: string;
  organization_id: string;
  summary_date: string;
  summary_type: 'daily' | 'weekly' | 'monthly';
  total_active_users: number;
  total_sessions: number;
  avg_session_duration_minutes: number;
  total_invitations_sent: number;
  total_invitations_accepted: number;
  total_events: number;
  health_score: number;
  engagement_score: number;
  additional_metrics: Record<string, any>;
  created_at: string;
}

export interface OrganizationPerformanceMetrics {
  organization_id: string;
  organization_name: string;
  active_users: number;
  total_sessions: number;
  health_score: number;
  engagement_score: number;
  course_count: number;
  assessment_count: number;
  ai_usage: number;
  usage_trend: 'increasing' | 'stable' | 'decreasing';
  last_active_date: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: 'performance' | 'engagement' | 'usage' | 'custom';
  parameters: Record<string, any>;
  file_url?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface AnalyticsFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'between';
  value: any;
  conjunction?: 'and' | 'or';
}

export interface AnalyticsQueryParams {
  timeRange: string;  // '7d', '30d', '90d', 'custom'
  startDate?: string;
  endDate?: string;
  filters?: AnalyticsFilter[];
  groupBy?: string[];
  limit?: number;
  offset?: number;
}
