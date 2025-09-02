
export interface AnalyticsEvent {
  id: string;
  organization_id: string;
  user_id?: string;
  event_type: string;
  event_category: string;
  event_data: Record<string, any>;
  session_id?: string;
  page_path?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface RealTimeMetric {
  id: string;
  organization_id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  dimensions: Record<string, any>;
  timestamp_hour: string;
  created_at: string;
  updated_at: string;
}

export interface AdvancedReportTemplate {
  id: string;
  organization_id: string;
  template_name: string;
  template_type: string;
  description?: string;
  template_config: Record<string, any>;
  data_sources: string[];
  visualization_config: Record<string, any>;
  filters_config: Record<string, any>;
  schedule_config: Record<string, any>;
  export_formats: string[];
  is_system_template: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AdvancedGeneratedReport {
  id: string;
  template_id: string;
  organization_id: string;
  report_name: string;
  report_type: string;
  parameters: Record<string, any>;
  report_data: Record<string, any>;
  file_urls: Record<string, string>;
  generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  generated_by?: string;
  generated_at?: string;
  expires_at?: string;
  download_count: number;
  created_at: string;
}

export interface KPIDefinition {
  id: string;
  organization_id: string;
  kpi_name: string;
  kpi_category: string;
  description?: string;
  calculation_formula: string;
  data_sources: string[];
  target_value?: number;
  warning_threshold?: number;
  critical_threshold?: number;
  unit?: string;
  frequency: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface KPIValue {
  id: string;
  kpi_id: string;
  organization_id: string;
  calculated_value: number;
  target_value?: number;
  variance_percentage?: number;
  status: 'normal' | 'warning' | 'critical';
  calculation_metadata: Record<string, any>;
  period_start: string;
  period_end: string;
  calculated_at: string;
}

export interface PredictiveModel {
  id: string;
  organization_id: string;
  model_name: string;
  model_type: 'regression' | 'classification' | 'forecasting';
  description?: string;
  model_config: Record<string, any>;
  training_data_sources: string[];
  feature_columns: string[];
  target_column?: string;
  model_metrics: Record<string, any>;
  model_file_url?: string;
  status: string;
  accuracy_score?: number;
  last_trained_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PredictivePrediction {
  id: string;
  model_id: string;
  organization_id: string;
  input_data: Record<string, any>;
  predicted_value?: number;
  confidence_score?: number;
  prediction_metadata: Record<string, any>;
  actual_value?: number;
  created_at: string;
}

export interface DashboardMetrics {
  totalEvents: number;
  activeUsers: number;
  pageViews: number;
  engagementRate: number;
  systemHealth: number;
}

export interface VisualizationConfig {
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  xAxis: string;
  yAxis: string[];
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  animation: boolean;
}
