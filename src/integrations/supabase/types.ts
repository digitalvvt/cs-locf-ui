export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_years: {
        Row: {
          academic_year: string
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          program_id: string
          start_date: string | null
          updated_at: string | null
          year_number: number
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          program_id: string
          start_date?: string | null
          updated_at?: string | null
          year_number: number
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          program_id?: string
          start_date?: string | null
          updated_at?: string | null
          year_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "academic_years_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_generated_reports: {
        Row: {
          created_at: string | null
          download_count: number | null
          expires_at: string | null
          file_urls: Json | null
          generated_at: string | null
          generated_by: string | null
          generation_status: string | null
          id: string
          organization_id: string | null
          parameters: Json | null
          report_data: Json
          report_name: string
          report_type: string
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_urls?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          generation_status?: string | null
          id?: string
          organization_id?: string | null
          parameters?: Json | null
          report_data?: Json
          report_name: string
          report_type: string
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_urls?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          generation_status?: string | null
          id?: string
          organization_id?: string | null
          parameters?: Json | null
          report_data?: Json
          report_name?: string
          report_type?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advanced_generated_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advanced_generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "advanced_report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_report_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_sources: Json | null
          description: string | null
          export_formats: string[] | null
          filters_config: Json | null
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          organization_id: string | null
          schedule_config: Json | null
          template_config: Json
          template_name: string
          template_type: string
          updated_at: string | null
          visualization_config: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_sources?: Json | null
          description?: string | null
          export_formats?: string[] | null
          filters_config?: Json | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          organization_id?: string | null
          schedule_config?: Json | null
          template_config?: Json
          template_name: string
          template_type: string
          updated_at?: string | null
          visualization_config?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_sources?: Json | null
          description?: string | null
          export_formats?: string[] | null
          filters_config?: Json | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          organization_id?: string | null
          schedule_config?: Json | null
          template_config?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
          visualization_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "advanced_report_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_configs: {
        Row: {
          agent_type: string
          config_data: Json
          created_at: string | null
          created_by: string | null
          id: string
          is_enabled: boolean | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_type: string
          config_data?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_type?: string
          config_data?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_configs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_metrics: {
        Row: {
          agent_type: string
          id: string
          metric_data: Json | null
          metric_type: string
          metric_value: number
          organization_id: string | null
          period_end: string | null
          period_start: string | null
          recorded_at: string | null
        }
        Insert: {
          agent_type: string
          id?: string
          metric_data?: Json | null
          metric_type: string
          metric_value: number
          organization_id?: string | null
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
        }
        Update: {
          agent_type?: string
          id?: string
          metric_data?: Json | null
          metric_type?: string
          metric_value?: number
          organization_id?: string | null
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_tasks: {
        Row: {
          agent_type: string
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          created_by: string | null
          error_details: string | null
          id: string
          input_data: Json
          organization_id: string | null
          output_data: Json | null
          priority: number | null
          scheduled_for: string | null
          started_at: string | null
          task_status: string | null
          task_type: string
          updated_at: string | null
        }
        Insert: {
          agent_type: string
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          input_data?: Json
          organization_id?: string | null
          output_data?: Json | null
          priority?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          task_status?: string | null
          task_type: string
          updated_at?: string | null
        }
        Update: {
          agent_type?: string
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          input_data?: Json
          organization_id?: string | null
          output_data?: Json | null
          priority?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          task_status?: string | null
          task_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_tasks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_agent_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_feedback: {
        Row: {
          ai_task_id: string | null
          course_id: string | null
          created_at: string | null
          faculty_correction: Json | null
          feedback_comments: string | null
          feedback_score: number | null
          feedback_type: string
          id: string
          is_useful: boolean | null
          organization_id: string | null
          original_suggestion: Json
          provided_by: string | null
        }
        Insert: {
          ai_task_id?: string | null
          course_id?: string | null
          created_at?: string | null
          faculty_correction?: Json | null
          feedback_comments?: string | null
          feedback_score?: number | null
          feedback_type: string
          id?: string
          is_useful?: boolean | null
          organization_id?: string | null
          original_suggestion: Json
          provided_by?: string | null
        }
        Update: {
          ai_task_id?: string | null
          course_id?: string | null
          created_at?: string | null
          faculty_correction?: Json | null
          feedback_comments?: string | null
          feedback_score?: number | null
          feedback_type?: string
          id?: string
          is_useful?: boolean | null
          organization_id?: string | null
          original_suggestion?: Json
          provided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_ai_task_id_fkey"
            columns: ["ai_task_id"]
            isOneToOne: false
            referencedRelation: "ai_processing_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_feedback_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_feedback_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_interactions: {
        Row: {
          ai_model: string | null
          confidence_score: number | null
          cost_estimate: number | null
          created_at: string
          error_message: string | null
          input_data: Json
          interaction_id: string
          interaction_type: string
          metadata: Json | null
          organization_id: string | null
          output_data: Json | null
          processing_time_ms: number | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          success: boolean | null
          tokens_used: number | null
          user_feedback: Json | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          confidence_score?: number | null
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          input_data: Json
          interaction_id?: string
          interaction_type: string
          metadata?: Json | null
          organization_id?: string | null
          output_data?: Json | null
          processing_time_ms?: number | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_feedback?: Json | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          confidence_score?: number | null
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          input_data?: Json
          interaction_id?: string
          interaction_type?: string
          metadata?: Json | null
          organization_id?: string | null
          output_data?: Json | null
          processing_time_ms?: number | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_feedback?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_performance_metrics: {
        Row: {
          accuracy_score: number | null
          confidence_score: number | null
          cost_incurred: number | null
          created_at: string | null
          id: string
          model_used: string | null
          operation_type: Database["public"]["Enums"]["ai_operation_type"]
          organization_id: string | null
          processing_time_ms: number
          tokens_consumed: number | null
          user_accepted: boolean | null
        }
        Insert: {
          accuracy_score?: number | null
          confidence_score?: number | null
          cost_incurred?: number | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          operation_type: Database["public"]["Enums"]["ai_operation_type"]
          organization_id?: string | null
          processing_time_ms: number
          tokens_consumed?: number | null
          user_accepted?: boolean | null
        }
        Update: {
          accuracy_score?: number | null
          confidence_score?: number | null
          cost_incurred?: number | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          operation_type?: Database["public"]["Enums"]["ai_operation_type"]
          organization_id?: string | null
          processing_time_ms?: number
          tokens_consumed?: number | null
          user_accepted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_performance_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_processing_queue: {
        Row: {
          completed_at: string | null
          confidence_scores: Json | null
          created_at: string | null
          error_details: Json | null
          id: string
          input_data: Json
          max_retries: number | null
          organization_id: string | null
          output_data: Json | null
          priority: number | null
          processing_metadata: Json | null
          requested_by: string | null
          retry_count: number | null
          started_at: string | null
          status: string | null
          task_type: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          input_data: Json
          max_retries?: number | null
          organization_id?: string | null
          output_data?: Json | null
          priority?: number | null
          processing_metadata?: Json | null
          requested_by?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          task_type: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          error_details?: Json | null
          id?: string
          input_data?: Json
          max_retries?: number | null
          organization_id?: string | null
          output_data?: Json | null
          priority?: number | null
          processing_metadata?: Json | null
          requested_by?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          task_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_processing_queue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          action_taken: Json | null
          agent_type: string
          confidence_score: number | null
          course_id: string | null
          created_at: string | null
          created_by_agent: boolean | null
          description: string
          expires_at: string | null
          id: string
          organization_id: string | null
          priority: string | null
          recommendation_data: Json | null
          recommendation_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          target_entity_id: string | null
          target_entity_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_taken?: Json | null
          agent_type: string
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          created_by_agent?: boolean | null
          description: string
          expires_at?: string | null
          id?: string
          organization_id?: string | null
          priority?: string | null
          recommendation_data?: Json | null
          recommendation_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_taken?: Json | null
          agent_type?: string
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          created_by_agent?: boolean | null
          description?: string
          expires_at?: string | null
          id?: string
          organization_id?: string | null
          priority?: string | null
          recommendation_data?: Json | null
          recommendation_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_category: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          organization_id: string | null
          page_path: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_category: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          page_path?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_category?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          page_path?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_report_templates: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          recipients: Json | null
          report_scope: string
          schedule_config: Json | null
          template_config: Json
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          recipients?: Json | null
          report_scope?: string
          schedule_config?: Json | null
          template_config?: Json
          template_name: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          recipients?: Json | null
          report_scope?: string
          schedule_config?: Json | null
          template_config?: Json
          template_name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_reports: {
        Row: {
          created_at: string
          file_url: string | null
          generated_at: string | null
          generated_by: string | null
          generation_status: string | null
          id: string
          organization_id: string | null
          report_data: Json
          report_name: string
          report_period_end: string
          report_period_start: string
          report_type: string
          template_id: string | null
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generation_status?: string | null
          id?: string
          organization_id?: string | null
          report_data?: Json
          report_name: string
          report_period_end: string
          report_period_start: string
          report_type: string
          template_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string | null
          generated_at?: string | null
          generated_by?: string | null
          generation_status?: string | null
          id?: string
          organization_id?: string | null
          report_data?: Json
          report_name?: string
          report_period_end?: string
          report_period_start?: string
          report_type?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "analytics_report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      api_integrations: {
        Row: {
          api_key_encrypted: string | null
          configuration: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          name: string
          service_type: Database["public"]["Enums"]["integration_service"]
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          service_type: Database["public"]["Enums"]["integration_service"]
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          service_type?: Database["public"]["Enums"]["integration_service"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_integrations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_batches: {
        Row: {
          assessment_date: string
          assessment_name: string
          assessment_type: string
          batch_name: string
          course_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          processed_students: number
          processing_errors: Json | null
          status: string
          total_students: number
          updated_at: string | null
          validation_errors: Json | null
        }
        Insert: {
          assessment_date: string
          assessment_name: string
          assessment_type: string
          batch_name: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          processed_students?: number
          processing_errors?: Json | null
          status?: string
          total_students?: number
          updated_at?: string | null
          validation_errors?: Json | null
        }
        Update: {
          assessment_date?: string
          assessment_name?: string
          assessment_type?: string
          batch_name?: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          processed_students?: number
          processing_errors?: Json | null
          status?: string
          total_students?: number
          updated_at?: string | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_papers: {
        Row: {
          assessment_type: string
          blooms_distribution: Json
          co_distribution: Json
          course_id: string
          created_at: string
          created_by: string | null
          difficulty_distribution: Json
          duration_minutes: number
          generated_from_mapping: boolean | null
          id: string
          instructions: string | null
          mapping_quality_score: number | null
          paper_name: string
          questions: Json
          total_marks: number
          updated_at: string
        }
        Insert: {
          assessment_type: string
          blooms_distribution?: Json
          co_distribution?: Json
          course_id: string
          created_at?: string
          created_by?: string | null
          difficulty_distribution?: Json
          duration_minutes: number
          generated_from_mapping?: boolean | null
          id?: string
          instructions?: string | null
          mapping_quality_score?: number | null
          paper_name: string
          questions?: Json
          total_marks: number
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          blooms_distribution?: Json
          co_distribution?: Json
          course_id?: string
          created_at?: string
          created_by?: string | null
          difficulty_distribution?: Json
          duration_minutes?: number
          generated_from_mapping?: boolean | null
          id?: string
          instructions?: string | null
          mapping_quality_score?: number | null
          paper_name?: string
          questions?: Json
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_papers_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_paper_id: string | null
          co_mapping: number
          created_at: string | null
          id: string
          is_compulsory: boolean | null
          marks_allocated: number
          question_id: string | null
          question_number: number
        }
        Insert: {
          assessment_paper_id?: string | null
          co_mapping: number
          created_at?: string | null
          id?: string
          is_compulsory?: boolean | null
          marks_allocated: number
          question_id?: string | null
          question_number: number
        }
        Update: {
          assessment_paper_id?: string | null
          co_mapping?: number
          created_at?: string | null
          id?: string
          is_compulsory?: boolean | null
          marks_allocated?: number
          question_id?: string | null
          question_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_paper_id_fkey"
            columns: ["assessment_paper_id"]
            isOneToOne: false
            referencedRelation: "assessment_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_templates: {
        Row: {
          assessment_type: string
          course_id: string
          created_at: string | null
          created_by: string | null
          file_url: string | null
          id: string
          template_name: string
          template_structure: Json
          updated_at: string | null
        }
        Insert: {
          assessment_type: string
          course_id: string
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          id?: string
          template_name: string
          template_structure?: Json
          updated_at?: string | null
        }
        Update: {
          assessment_type?: string
          course_id?: string
          created_at?: string | null
          created_by?: string | null
          file_url?: string | null
          id?: string
          template_name?: string
          template_structure?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_templates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_templates_enhanced: {
        Row: {
          assessment_type: string
          blooms_distribution: Json | null
          co_coverage_requirements: Json | null
          created_at: string | null
          created_by: string | null
          difficulty_distribution: Json | null
          duration_minutes: number | null
          id: string
          instructions_template: string | null
          is_system_template: boolean | null
          marking_scheme: Json | null
          organization_id: string | null
          program_id: string | null
          question_distribution: Json | null
          template_name: string
          template_structure: Json
          total_marks: number | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          assessment_type: string
          blooms_distribution?: Json | null
          co_coverage_requirements?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty_distribution?: Json | null
          duration_minutes?: number | null
          id?: string
          instructions_template?: string | null
          is_system_template?: boolean | null
          marking_scheme?: Json | null
          organization_id?: string | null
          program_id?: string | null
          question_distribution?: Json | null
          template_name: string
          template_structure?: Json
          total_marks?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          assessment_type?: string
          blooms_distribution?: Json | null
          co_coverage_requirements?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty_distribution?: Json | null
          duration_minutes?: number | null
          id?: string
          instructions_template?: string | null
          is_system_template?: boolean | null
          marking_scheme?: Json | null
          organization_id?: string | null
          program_id?: string | null
          question_distribution?: Json | null
          template_name?: string
          template_structure?: Json
          total_marks?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_templates_enhanced_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_templates_enhanced_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      attainment_report_templates: {
        Row: {
          auto_generate: boolean | null
          created_at: string | null
          description: string | null
          format_options: Json
          id: string
          is_active: boolean | null
          name: string
          organization_id: string | null
          schedule_config: Json | null
          sections: Json
          stakeholders: Json
          template_type: string
          updated_at: string | null
        }
        Insert: {
          auto_generate?: boolean | null
          created_at?: string | null
          description?: string | null
          format_options?: Json
          id?: string
          is_active?: boolean | null
          name: string
          organization_id?: string | null
          schedule_config?: Json | null
          sections?: Json
          stakeholders?: Json
          template_type: string
          updated_at?: string | null
        }
        Update: {
          auto_generate?: boolean | null
          created_at?: string | null
          description?: string | null
          format_options?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string | null
          schedule_config?: Json | null
          sections?: Json
          stakeholders?: Json
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attainment_report_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attainment_workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_step_index: number | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
          steps: Json
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_step_index?: number | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          steps?: Json
          trigger_config?: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_step_index?: number | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          steps?: Json
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attainment_workflows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          audit_id: string
          changed_fields: Json | null
          created_at: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          record_id: string
          risk_level: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          audit_id?: string
          changed_fields?: Json | null
          created_at?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          record_id: string
          risk_level?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          audit_id?: string
          changed_fields?: Json | null
          created_at?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          record_id?: string
          risk_level?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          changes_summary: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          risk_level: Database["public"]["Enums"]["audit_risk"] | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          changes_summary?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          risk_level?: Database["public"]["Enums"]["audit_risk"] | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          changes_summary?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          risk_level?: Database["public"]["Enums"]["audit_risk"] | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_jobs: {
        Row: {
          backup_location: string | null
          backup_type: Database["public"]["Enums"]["backup_type"]
          created_at: string | null
          id: string
          job_name: string
          last_run_at: string | null
          schedule_cron: string | null
          status: Database["public"]["Enums"]["backup_job_status"] | null
        }
        Insert: {
          backup_location?: string | null
          backup_type: Database["public"]["Enums"]["backup_type"]
          created_at?: string | null
          id?: string
          job_name: string
          last_run_at?: string | null
          schedule_cron?: string | null
          status?: Database["public"]["Enums"]["backup_job_status"] | null
        }
        Update: {
          backup_location?: string | null
          backup_type?: Database["public"]["Enums"]["backup_type"]
          created_at?: string | null
          id?: string
          job_name?: string
          last_run_at?: string | null
          schedule_cron?: string | null
          status?: Database["public"]["Enums"]["backup_job_status"] | null
        }
        Relationships: []
      }
      billing_history: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          created_at: string | null
          currency: string | null
          generated_by: string | null
          id: string
          invoice_number: string
          notes: string | null
          organization_id: string
          overage_charges: Json | null
          payment_date: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          transaction_id: string | null
          updated_at: string | null
          usage_details: Json | null
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          created_at?: string | null
          currency?: string | null
          generated_by?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          organization_id: string
          overage_charges?: Json | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          transaction_id?: string | null
          updated_at?: string | null
          usage_details?: Json | null
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string | null
          currency?: string | null
          generated_by?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          organization_id?: string
          overage_charges?: Json | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
          usage_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_import_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          import_type: string | null
          imported_courses: number | null
          organization_id: string | null
          session_data: Json | null
          session_name: string
          status: string | null
          total_courses: number | null
          updated_at: string | null
          validation_issues: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          import_type?: string | null
          imported_courses?: number | null
          organization_id?: string | null
          session_data?: Json | null
          session_name: string
          status?: string | null
          total_courses?: number | null
          updated_at?: string | null
          validation_issues?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          import_type?: string | null
          imported_courses?: number | null
          organization_id?: string | null
          session_data?: Json | null
          session_name?: string
          status?: string | null
          total_courses?: number | null
          updated_at?: string | null
          validation_issues?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_import_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      co_attainments: {
        Row: {
          achieved_percentage: number
          assessment_breakdown: Json | null
          assessment_cycle: string
          attainment_level: string | null
          calculated_at: string | null
          calculation_method: string | null
          co_number: number
          course_id: string
          created_at: string | null
          id: string
          improvement_suggestions: Json | null
          students_evaluated: number
          students_passed: number
          target_percentage: number
          threshold_marks: number | null
          trend_analysis: Json | null
          updated_at: string | null
        }
        Insert: {
          achieved_percentage?: number
          assessment_breakdown?: Json | null
          assessment_cycle: string
          attainment_level?: string | null
          calculated_at?: string | null
          calculation_method?: string | null
          co_number: number
          course_id: string
          created_at?: string | null
          id?: string
          improvement_suggestions?: Json | null
          students_evaluated?: number
          students_passed?: number
          target_percentage?: number
          threshold_marks?: number | null
          trend_analysis?: Json | null
          updated_at?: string | null
        }
        Update: {
          achieved_percentage?: number
          assessment_breakdown?: Json | null
          assessment_cycle?: string
          attainment_level?: string | null
          calculated_at?: string | null
          calculation_method?: string | null
          co_number?: number
          course_id?: string
          created_at?: string | null
          id?: string
          improvement_suggestions?: Json | null
          students_evaluated?: number
          students_passed?: number
          target_percentage?: number
          threshold_marks?: number | null
          trend_analysis?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "co_attainments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      co_po_mappings: {
        Row: {
          course_id: string
          created_at: string
          id: string
          mapping_data: Json
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          mapping_data?: Json
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          mapping_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "co_po_mappings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          compliance_framework: string
          compliance_score: number | null
          created_at: string
          findings: Json | null
          generated_by: string | null
          id: string
          organization_id: string | null
          recommendations: Json | null
          report_data: Json
          report_period_end: string
          report_period_start: string
          report_type: string
        }
        Insert: {
          compliance_framework: string
          compliance_score?: number | null
          created_at?: string
          findings?: Json | null
          generated_by?: string | null
          id?: string
          organization_id?: string | null
          recommendations?: Json | null
          report_data?: Json
          report_period_end: string
          report_period_start: string
          report_type: string
        }
        Update: {
          compliance_framework?: string
          compliance_score?: number | null
          created_at?: string
          findings?: Json | null
          generated_by?: string | null
          id?: string
          organization_id?: string | null
          recommendations?: Json | null
          report_data?: Json
          report_period_end?: string
          report_period_start?: string
          report_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_import_queue: {
        Row: {
          course_data: Json
          course_id: string | null
          created_at: string | null
          id: string
          import_status: string | null
          session_id: string | null
          updated_at: string | null
          validation_errors: Json | null
        }
        Insert: {
          course_data: Json
          course_id?: string | null
          created_at?: string | null
          id?: string
          import_status?: string | null
          session_id?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
        }
        Update: {
          course_data?: Json
          course_id?: string | null
          created_at?: string | null
          id?: string
          import_status?: string | null
          session_id?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "course_import_queue_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_import_queue_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "bulk_import_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      course_templates: {
        Row: {
          course_count: number | null
          created_at: string | null
          created_by: string | null
          credits_total: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          name: string
          organization_id: string | null
          programType: string
          template_data: Json
          template_type: string | null
          updated_at: string | null
        }
        Insert: {
          course_count?: number | null
          created_at?: string | null
          created_by?: string | null
          credits_total?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name: string
          organization_id?: string | null
          programType: string
          template_data?: Json
          template_type?: string | null
          updated_at?: string | null
        }
        Update: {
          course_count?: number | null
          created_at?: string | null
          created_by?: string | null
          credits_total?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name?: string
          organization_id?: string | null
          programType?: string
          template_data?: Json
          template_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_units: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          hours_allocated: number | null
          id: string
          title: string
          unit_number: number
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          hours_allocated?: number | null
          id?: string
          title: string
          unit_number: number
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          hours_allocated?: number | null
          id?: string
          title?: string
          unit_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          co_mapping: Json | null
          code: string
          course_type: Database["public"]["Enums"]["course_type"] | null
          created_at: string | null
          credits: number
          description: string | null
          extracted_data: Json | null
          extraction_confidence: number | null
          extraction_status: string | null
          file_upload_id: string | null
          id: string
          instructor_details: Json | null
          is_active: boolean | null
          learning_outcomes: string[] | null
          name: string
          po_mapping: Json | null
          practical_hours: number | null
          prerequisites: string[] | null
          semester_id: string
          syllabus_file_url: string | null
          syllabus_metadata: Json | null
          theory_hours: number | null
          updated_at: string | null
        }
        Insert: {
          co_mapping?: Json | null
          code: string
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string | null
          credits?: number
          description?: string | null
          extracted_data?: Json | null
          extraction_confidence?: number | null
          extraction_status?: string | null
          file_upload_id?: string | null
          id?: string
          instructor_details?: Json | null
          is_active?: boolean | null
          learning_outcomes?: string[] | null
          name: string
          po_mapping?: Json | null
          practical_hours?: number | null
          prerequisites?: string[] | null
          semester_id: string
          syllabus_file_url?: string | null
          syllabus_metadata?: Json | null
          theory_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          co_mapping?: Json | null
          code?: string
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string | null
          credits?: number
          description?: string | null
          extracted_data?: Json | null
          extraction_confidence?: number | null
          extraction_status?: string | null
          file_upload_id?: string | null
          id?: string
          instructor_details?: Json | null
          is_active?: boolean | null
          learning_outcomes?: string[] | null
          name?: string
          po_mapping?: Json | null
          practical_hours?: number | null
          prerequisites?: string[] | null
          semester_id?: string
          syllabus_file_url?: string | null
          syllabus_metadata?: Json | null
          theory_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_file_upload_id_fkey"
            columns: ["file_upload_id"]
            isOneToOne: false
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_rubrics: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria: Json
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          organization_id: string | null
          rubric_type: string
          scoring_levels: Json
          updated_at: string | null
          weightage_distribution: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          organization_id?: string | null
          rubric_type: string
          scoring_levels?: Json
          updated_at?: string | null
          weightage_distribution?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          organization_id?: string | null
          rubric_type?: string
          scoring_levels?: Json
          updated_at?: string | null
          weightage_distribution?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_rubrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_quality_issues: {
        Row: {
          created_at: string | null
          description: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          issue_type: string
          organization_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          issue_type: string
          organization_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          issue_type?: string
          organization_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_quality_issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_retention_policies: {
        Row: {
          compliance_framework: string | null
          created_at: string | null
          data_type: string
          id: string
          is_active: boolean | null
          organization_id: string | null
          policy_name: string
          retention_period_days: number
          updated_at: string | null
        }
        Insert: {
          compliance_framework?: string | null
          created_at?: string | null
          data_type: string
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          policy_name: string
          retention_period_days: number
          updated_at?: string | null
        }
        Update: {
          compliance_framework?: string | null
          created_at?: string | null
          data_type?: string
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          policy_name?: string
          retention_period_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_retention_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_repository: {
        Row: {
          access_level: string | null
          category: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          evidence_type: string
          file_hash: string | null
          file_size: number | null
          file_url: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          mime_type: string | null
          organization_id: string | null
          parent_evidence_id: string | null
          program_id: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          version_number: number | null
        }
        Insert: {
          access_level?: string | null
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          evidence_type: string
          file_hash?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string | null
          parent_evidence_id?: string | null
          program_id?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          version_number?: number | null
        }
        Update: {
          access_level?: string | null
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          evidence_type?: string
          file_hash?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string | null
          parent_evidence_id?: string | null
          program_id?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_repository_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_repository_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_repository_parent_evidence_id_fkey"
            columns: ["parent_evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence_repository"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_repository_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage_analytics: {
        Row: {
          created_at: string | null
          feature_category: string | null
          feature_name: string
          first_used_at: string | null
          id: string
          last_used_at: string | null
          organization_id: string
          stats_date: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          feature_category?: string | null
          feature_name: string
          first_used_at?: string | null
          id?: string
          last_used_at?: string | null
          organization_id: string
          stats_date?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          feature_category?: string | null
          feature_name?: string
          first_used_at?: string | null
          id?: string
          last_used_at?: string | null
          organization_id?: string
          stats_date?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number
          id: string
          mime_type: string
          organization_id: string | null
          original_filename: string
          processing_results: Json | null
          processing_status: string | null
          stored_filename: string
          updated_at: string | null
          uploader_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          organization_id?: string | null
          original_filename: string
          processing_results?: Json | null
          processing_status?: string | null
          stored_filename: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          organization_id?: string | null
          original_filename?: string
          processing_results?: Json | null
          processing_status?: string | null
          stored_filename?: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          academic_years: Json | null
          approved_by: string | null
          assessment_cycles: Json | null
          compliance_score: number | null
          created_at: string | null
          evidence_attachments: Json | null
          file_urls: Json | null
          gap_analysis: Json | null
          generated_by: string | null
          generated_data: Json
          id: string
          manual_content: Json | null
          organization_id: string | null
          parent_report_id: string | null
          program_ids: Json | null
          recommendations: Json | null
          report_name: string
          report_scope: Json
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          template_id: string | null
          updated_at: string | null
          version_number: number | null
        }
        Insert: {
          academic_years?: Json | null
          approved_by?: string | null
          assessment_cycles?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          evidence_attachments?: Json | null
          file_urls?: Json | null
          gap_analysis?: Json | null
          generated_by?: string | null
          generated_data?: Json
          id?: string
          manual_content?: Json | null
          organization_id?: string | null
          parent_report_id?: string | null
          program_ids?: Json | null
          recommendations?: Json | null
          report_name: string
          report_scope?: Json
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
          updated_at?: string | null
          version_number?: number | null
        }
        Update: {
          academic_years?: Json | null
          approved_by?: string | null
          assessment_cycles?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          evidence_attachments?: Json | null
          file_urls?: Json | null
          gap_analysis?: Json | null
          generated_by?: string | null
          generated_data?: Json
          id?: string
          manual_content?: Json | null
          organization_id?: string | null
          parent_report_id?: string | null
          program_ids?: Json | null
          recommendations?: Json | null
          report_name?: string
          report_scope?: Json
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
          updated_at?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_parent_report_id_fkey"
            columns: ["parent_report_id"]
            isOneToOne: false
            referencedRelation: "generated_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_course_assignments: {
        Row: {
          academic_year: string | null
          assigned_at: string
          assigned_by: string | null
          assignment_id: string
          course_id: string
          created_at: string
          organization_id: string
          semester: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          assigned_at?: string
          assigned_by?: string | null
          assignment_id?: string
          course_id: string
          created_at?: string
          organization_id: string
          semester?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_year?: string | null
          assigned_at?: string
          assigned_by?: string | null
          assignment_id?: string
          course_id?: string
          created_at?: string
          organization_id?: string
          semester?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_course_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_course_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_definitions: {
        Row: {
          calculation_formula: string
          created_at: string | null
          created_by: string | null
          critical_threshold: number | null
          data_sources: Json | null
          description: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          kpi_category: string
          kpi_name: string
          organization_id: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          warning_threshold: number | null
        }
        Insert: {
          calculation_formula: string
          created_at?: string | null
          created_by?: string | null
          critical_threshold?: number | null
          data_sources?: Json | null
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          kpi_category: string
          kpi_name: string
          organization_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Update: {
          calculation_formula?: string
          created_at?: string | null
          created_by?: string | null
          critical_threshold?: number | null
          data_sources?: Json | null
          description?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          kpi_category?: string
          kpi_name?: string
          organization_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_definitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_values: {
        Row: {
          calculated_at: string | null
          calculated_value: number
          calculation_metadata: Json | null
          id: string
          kpi_id: string | null
          organization_id: string | null
          period_end: string
          period_start: string
          status: string | null
          target_value: number | null
          variance_percentage: number | null
        }
        Insert: {
          calculated_at?: string | null
          calculated_value: number
          calculation_metadata?: Json | null
          id?: string
          kpi_id?: string | null
          organization_id?: string | null
          period_end: string
          period_start: string
          status?: string | null
          target_value?: number | null
          variance_percentage?: number | null
        }
        Update: {
          calculated_at?: string | null
          calculated_value?: number
          calculation_metadata?: Json | null
          id?: string
          kpi_id?: string | null
          organization_id?: string | null
          period_end?: string
          period_start?: string
          status?: string | null
          target_value?: number | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_objectives: {
        Row: {
          confidence_score: number | null
          course_id: string | null
          created_at: string | null
          description: string
          id: string
          lo_number: number
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          lo_number: number
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          lo_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_objectives_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          attempts: number | null
          body: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_channel:
            | Database["public"]["Enums"]["notification_channel"]
            | null
          error_message: string | null
          id: string
          last_attempt_at: string | null
          max_attempts: number | null
          organization_id: string | null
          priority: Database["public"]["Enums"]["notification_priority"] | null
          recipient_email: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["notification_status"] | null
          subject: string | null
          template_key: string | null
          template_variables: Json | null
        }
        Insert: {
          attempts?: number | null
          body?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_channel?:
            | Database["public"]["Enums"]["notification_channel"]
            | null
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          organization_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          recipient_email?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          template_key?: string | null
          template_variables?: Json | null
        }
        Update: {
          attempts?: number | null
          body?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_channel?:
            | Database["public"]["Enums"]["notification_channel"]
            | null
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          organization_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          recipient_email?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          template_key?: string | null
          template_variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_template: string
          created_at: string | null
          delivery_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          frequency_limit: unknown | null
          id: string
          is_active: boolean | null
          priority: Database["public"]["Enums"]["notification_priority"] | null
          subject_template: string
          template_key: string
          template_name: string
          trigger_conditions: Json | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_template: string
          created_at?: string | null
          delivery_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          frequency_limit?: unknown | null
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          subject_template: string
          template_key: string
          template_name: string
          trigger_conditions?: Json | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_template?: string
          created_at?: string | null
          delivery_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          frequency_limit?: unknown | null
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          subject_template?: string
          template_key?: string
          template_name?: string
          trigger_conditions?: Json | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      organization_analytics_summary: {
        Row: {
          avg_session_duration_minutes: number | null
          created_at: string
          engagement_score: number | null
          feature_usage_summary: Json | null
          health_score: number | null
          id: string
          organization_id: string
          summary_date: string
          summary_type: string
          total_active_users: number | null
          total_invitations_accepted: number | null
          total_invitations_sent: number | null
          total_role_changes: number | null
          total_sessions: number | null
        }
        Insert: {
          avg_session_duration_minutes?: number | null
          created_at?: string
          engagement_score?: number | null
          feature_usage_summary?: Json | null
          health_score?: number | null
          id?: string
          organization_id: string
          summary_date?: string
          summary_type?: string
          total_active_users?: number | null
          total_invitations_accepted?: number | null
          total_invitations_sent?: number | null
          total_role_changes?: number | null
          total_sessions?: number | null
        }
        Update: {
          avg_session_duration_minutes?: number | null
          created_at?: string
          engagement_score?: number | null
          feature_usage_summary?: Json | null
          health_score?: number | null
          id?: string
          organization_id?: string
          summary_date?: string
          summary_type?: string
          total_active_users?: number | null
          total_invitations_accepted?: number | null
          total_invitations_sent?: number | null
          total_role_changes?: number | null
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_analytics_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          membership_id: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          membership_id?: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          membership_id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_onboarding: {
        Row: {
          assigned_support_agent: string | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          current_step: number | null
          id: string
          organization_id: string
          programs_configured: boolean | null
          started_at: string | null
          step_data: Json | null
          steps_completed: Json | null
          support_notes: string | null
          total_steps: number | null
          updated_at: string | null
          users_imported: boolean | null
        }
        Insert: {
          assigned_support_agent?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          organization_id: string
          programs_configured?: boolean | null
          started_at?: string | null
          step_data?: Json | null
          steps_completed?: Json | null
          support_notes?: string | null
          total_steps?: number | null
          updated_at?: string | null
          users_imported?: boolean | null
        }
        Update: {
          assigned_support_agent?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          organization_id?: string
          programs_configured?: boolean | null
          started_at?: string | null
          step_data?: Json | null
          steps_completed?: Json | null
          support_notes?: string | null
          total_steps?: number | null
          updated_at?: string | null
          users_imported?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_onboarding_assigned_support_agent_fkey"
            columns: ["assigned_support_agent"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_onboarding_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_summary_cache: {
        Row: {
          active_users: number | null
          code: string | null
          name: string | null
          organization_id: string
          status: Database["public"]["Enums"]["organization_status"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_users: number | null
          type: Database["public"]["Enums"]["organization_type"] | null
          updated_at: string | null
        }
        Insert: {
          active_users?: number | null
          code?: string | null
          name?: string | null
          organization_id: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_users?: number | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string | null
        }
        Update: {
          active_users?: number | null
          code?: string | null
          name?: string | null
          organization_id?: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_users?: number | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_summary_cache_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_templates: {
        Row: {
          applicable_for:
            | Database["public"]["Enums"]["organization_type"][]
            | null
          config_data: Json
          created_at: string | null
          created_by: string | null
          default_pos: Json | null
          default_psos: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          name: string
          template_type: Database["public"]["Enums"]["template_type"]
          updated_at: string | null
          version: string | null
        }
        Insert: {
          applicable_for?:
            | Database["public"]["Enums"]["organization_type"][]
            | null
          config_data: Json
          created_at?: string | null
          created_by?: string | null
          default_pos?: Json | null
          default_psos?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name: string
          template_type: Database["public"]["Enums"]["template_type"]
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          applicable_for?:
            | Database["public"]["Enums"]["organization_type"][]
            | null
          config_data?: Json
          created_at?: string | null
          created_by?: string | null
          default_pos?: Json | null
          default_psos?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name?: string
          template_type?: Database["public"]["Enums"]["template_type"]
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_usage_stats: {
        Row: {
          active_users: number | null
          ai_suggestions_used: number | null
          courses_created: number | null
          created_at: string | null
          id: string
          organization_id: string
          stats_date: string
          stats_type: Database["public"]["Enums"]["stats_type"] | null
          storage_used_gb: number | null
          syllabi_processed: number | null
          total_logins: number | null
        }
        Insert: {
          active_users?: number | null
          ai_suggestions_used?: number | null
          courses_created?: number | null
          created_at?: string | null
          id?: string
          organization_id: string
          stats_date: string
          stats_type?: Database["public"]["Enums"]["stats_type"] | null
          storage_used_gb?: number | null
          syllabi_processed?: number | null
          total_logins?: number | null
        }
        Update: {
          active_users?: number | null
          ai_suggestions_used?: number | null
          courses_created?: number | null
          created_at?: string | null
          id?: string
          organization_id?: string
          stats_date?: string
          stats_type?: Database["public"]["Enums"]["stats_type"] | null
          storage_used_gb?: number | null
          syllabi_processed?: number | null
          total_logins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_usage_stats_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          accreditation: Json | null
          address: Json | null
          affiliation: Json | null
          code: string
          compliance_flags: Json | null
          created_at: string | null
          created_by: string | null
          custom_branding: Json | null
          data_retention_days: number | null
          deleted_at: string | null
          established_year: number | null
          features: Json | null
          id: string
          integration_settings: Json | null
          max_courses: number | null
          max_users: number | null
          name: string
          notes: string | null
          official_email: string
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          privacy_settings: Json | null
          security_settings: Json | null
          status: Database["public"]["Enums"]["organization_status"] | null
          subdomain: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accreditation?: Json | null
          address?: Json | null
          affiliation?: Json | null
          code: string
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          custom_branding?: Json | null
          data_retention_days?: number | null
          deleted_at?: string | null
          established_year?: number | null
          features?: Json | null
          id?: string
          integration_settings?: Json | null
          max_courses?: number | null
          max_users?: number | null
          name: string
          notes?: string | null
          official_email: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          status?: Database["public"]["Enums"]["organization_status"] | null
          subdomain?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accreditation?: Json | null
          address?: Json | null
          affiliation?: Json | null
          code?: string
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          custom_branding?: Json | null
          data_retention_days?: number | null
          deleted_at?: string | null
          established_year?: number | null
          features?: Json | null
          id?: string
          integration_settings?: Json | null
          max_courses?: number | null
          max_users?: number | null
          name?: string
          notes?: string | null
          official_email?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          status?: Database["public"]["Enums"]["organization_status"] | null
          subdomain?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      performance_alerts: {
        Row: {
          alert_name: string
          check_interval_minutes: number | null
          comparison_operator:
            | Database["public"]["Enums"]["comparison_op"]
            | null
          cooldown_minutes: number | null
          created_at: string | null
          critical_threshold: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          metric_name: string
          notification_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          notification_recipients: string[] | null
          warning_threshold: number | null
        }
        Insert: {
          alert_name: string
          check_interval_minutes?: number | null
          comparison_operator?:
            | Database["public"]["Enums"]["comparison_op"]
            | null
          cooldown_minutes?: number | null
          created_at?: string | null
          critical_threshold?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metric_name: string
          notification_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          notification_recipients?: string[] | null
          warning_threshold?: number | null
        }
        Update: {
          alert_name?: string
          check_interval_minutes?: number | null
          comparison_operator?:
            | Database["public"]["Enums"]["comparison_op"]
            | null
          cooldown_minutes?: number | null
          created_at?: string | null
          critical_threshold?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metric_name?: string
          notification_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          notification_recipients?: string[] | null
          warning_threshold?: number | null
        }
        Relationships: []
      }
      po_attainments: {
        Row: {
          action_plan: Json | null
          assessment_cycle: string
          attainment_percentage: number
          attainment_value: number
          calculated_at: string | null
          contributing_courses: Json | null
          created_at: string | null
          external_validation: Json | null
          id: string
          industry_feedback: Json | null
          po_number: number
          program_id: string
          status: string | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          action_plan?: Json | null
          assessment_cycle: string
          attainment_percentage?: number
          attainment_value?: number
          calculated_at?: string | null
          contributing_courses?: Json | null
          created_at?: string | null
          external_validation?: Json | null
          id?: string
          industry_feedback?: Json | null
          po_number: number
          program_id: string
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          action_plan?: Json | null
          assessment_cycle?: string
          attainment_percentage?: number
          attainment_value?: number
          calculated_at?: string | null
          contributing_courses?: Json | null
          created_at?: string | null
          external_validation?: Json | null
          id?: string
          industry_feedback?: Json | null
          po_number?: number
          program_id?: string
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_attainments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          feature_columns: Json | null
          id: string
          last_trained_at: string | null
          model_config: Json
          model_file_url: string | null
          model_metrics: Json | null
          model_name: string
          model_type: string
          organization_id: string | null
          status: string | null
          target_column: string | null
          training_data_sources: Json | null
          updated_at: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          feature_columns?: Json | null
          id?: string
          last_trained_at?: string | null
          model_config?: Json
          model_file_url?: string | null
          model_metrics?: Json | null
          model_name: string
          model_type: string
          organization_id?: string | null
          status?: string | null
          target_column?: string | null
          training_data_sources?: Json | null
          updated_at?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          feature_columns?: Json | null
          id?: string
          last_trained_at?: string | null
          model_config?: Json
          model_file_url?: string | null
          model_metrics?: Json | null
          model_name?: string
          model_type?: string
          organization_id?: string | null
          status?: string | null
          target_column?: string | null
          training_data_sources?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictive_models_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_predictions: {
        Row: {
          actual_value: number | null
          confidence_score: number | null
          created_at: string | null
          id: string
          input_data: Json
          model_id: string | null
          organization_id: string | null
          predicted_value: number | null
          prediction_metadata: Json | null
        }
        Insert: {
          actual_value?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data: Json
          model_id?: string | null
          organization_id?: string | null
          predicted_value?: number | null
          prediction_metadata?: Json | null
        }
        Update: {
          actual_value?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json
          model_id?: string | null
          organization_id?: string | null
          predicted_value?: number | null
          prediction_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "predictive_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "predictive_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictive_predictions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      program_coordinator_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assignment_id: string
          created_at: string
          organization_id: string
          program_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assignment_id?: string
          created_at?: string
          organization_id: string
          program_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assignment_id?: string
          created_at?: string
          organization_id?: string
          program_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_coordinator_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_coordinator_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          accreditation_details: Json | null
          admission_criteria: Json | null
          code: string
          created_at: string | null
          description: string | null
          duration_years: number
          id: string
          name: string
          organization_id: string
          programType: Database["public"]["Enums"]["programType"]
          status: Database["public"]["Enums"]["program_status"] | null
          total_semesters: number
          updated_at: string | null
        }
        Insert: {
          accreditation_details?: Json | null
          admission_criteria?: Json | null
          code: string
          created_at?: string | null
          description?: string | null
          duration_years?: number
          id?: string
          name: string
          organization_id: string
          programType: Database["public"]["Enums"]["programType"]
          status?: Database["public"]["Enums"]["program_status"] | null
          total_semesters?: number
          updated_at?: string | null
        }
        Update: {
          accreditation_details?: Json | null
          admission_criteria?: Json | null
          code?: string
          created_at?: string | null
          description?: string | null
          duration_years?: number
          id?: string
          name?: string
          organization_id?: string
          programType?: Database["public"]["Enums"]["programType"]
          status?: Database["public"]["Enums"]["program_status"] | null
          total_semesters?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          answer_key: string
          blooms_level: string
          co_mapping: number
          course_id: string
          created_at: string
          created_by: string | null
          difficulty: string
          id: string
          last_used_date: string | null
          marks: number
          options: Json | null
          performance_score: number | null
          question_text: string
          question_type: string
          unit_mapping: number | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          answer_key: string
          blooms_level: string
          co_mapping?: number
          course_id: string
          created_at?: string
          created_by?: string | null
          difficulty: string
          id?: string
          last_used_date?: string | null
          marks?: number
          options?: Json | null
          performance_score?: number | null
          question_text: string
          question_type: string
          unit_mapping?: number | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          answer_key?: string
          blooms_level?: string
          co_mapping?: number
          course_id?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          id?: string
          last_used_date?: string | null
          marks?: number
          options?: Json | null
          performance_score?: number | null
          question_text?: string
          question_type?: string
          unit_mapping?: number | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      real_time_metrics: {
        Row: {
          created_at: string | null
          dimensions: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          organization_id: string | null
          timestamp_hour: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          organization_id?: string | null
          timestamp_hour: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          organization_id?: string | null
          timestamp_hour?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_time_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      report_collaborators: {
        Row: {
          added_at: string | null
          added_by: string | null
          id: string
          permissions: Json | null
          report_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          permissions?: Json | null
          report_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          permissions?: Json | null
          report_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_collaborators_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "generated_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_evidence: {
        Row: {
          created_at: string | null
          criterion_id: string | null
          description: string | null
          evidence_type: string
          file_size: number | null
          file_url: string | null
          id: string
          metadata: Json | null
          mime_type: string | null
          report_id: string | null
          section_id: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          criterion_id?: string | null
          description?: string | null
          evidence_type: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          report_id?: string | null
          section_id: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          criterion_id?: string | null
          description?: string | null
          evidence_type?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          report_id?: string | null
          section_id?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_evidence_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "generated_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria: Json
          description: string | null
          evidence_requirements: Json | null
          framework: string
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          scoring_methodology: Json | null
          sections: Json
          template_name: string
          template_structure: Json
          template_type: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json
          description?: string | null
          evidence_requirements?: Json | null
          framework: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          scoring_methodology?: Json | null
          sections?: Json
          template_name: string
          template_structure?: Json
          template_type: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json
          description?: string | null
          evidence_requirements?: Json | null
          framework?: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          scoring_methodology?: Json | null
          sections?: Json
          template_name?: string
          template_structure?: Json
          template_type?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      semesters: {
        Row: {
          academic_year_id: string
          created_at: string | null
          end_date: string | null
          exam_end_date: string | null
          exam_start_date: string | null
          id: string
          is_active: boolean | null
          name: string
          semester_number: number
          semester_type: Database["public"]["Enums"]["semester_type"]
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year_id: string
          created_at?: string | null
          end_date?: string | null
          exam_end_date?: string | null
          exam_start_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          semester_number: number
          semester_type: Database["public"]["Enums"]["semester_type"]
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string
          created_at?: string | null
          end_date?: string | null
          exam_end_date?: string | null
          exam_start_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          semester_number?: number
          semester_type?: Database["public"]["Enums"]["semester_type"]
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semesters_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assessments: {
        Row: {
          assessment_date: string
          assessment_name: string
          assessment_type: string
          co_scores: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          max_marks: number | null
          question_scores: Json | null
          student_name: string
          student_roll_number: string
          total_score: number | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          assessment_date: string
          assessment_name: string
          assessment_type: string
          co_scores?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          max_marks?: number | null
          question_scores?: Json | null
          student_name: string
          student_roll_number: string
          total_score?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          assessment_date?: string
          assessment_name?: string
          assessment_type?: string
          co_scores?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          max_marks?: number | null
          question_scores?: Json | null
          student_name?: string
          student_roll_number?: string
          total_score?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_performance_analytics: {
        Row: {
          assessment_trend: Json | null
          co_wise_performance: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          improvement_areas: Json | null
          last_calculated: string | null
          overall_percentage: number | null
          po_wise_performance: Json | null
          program_id: string | null
          recommendations: Json | null
          semester_id: string | null
          strengths: Json | null
          student_name: string
          student_roll_number: string
          updated_at: string | null
        }
        Insert: {
          assessment_trend?: Json | null
          co_wise_performance?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          improvement_areas?: Json | null
          last_calculated?: string | null
          overall_percentage?: number | null
          po_wise_performance?: Json | null
          program_id?: string | null
          recommendations?: Json | null
          semester_id?: string | null
          strengths?: Json | null
          student_name: string
          student_roll_number: string
          updated_at?: string | null
        }
        Update: {
          assessment_trend?: Json | null
          co_wise_performance?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          improvement_areas?: Json | null
          last_calculated?: string | null
          overall_percentage?: number | null
          po_wise_performance?: Json | null
          program_id?: string | null
          recommendations?: Json | null
          semester_id?: string | null
          strengths?: Json | null
          student_name?: string
          student_roll_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_performance_analytics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_performance_analytics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_performance_analytics_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      student_question_result: {
        Row: {
          academic_year: string
          assessment_date: string
          assessment_id: string | null
          assessment_type: string
          co_number: number
          course_id: string
          created_at: string
          evaluated_at: string | null
          evaluated_by: string | null
          marks_obtained: number
          po_mapping: Json | null
          question_id: string | null
          question_number: number
          remarks: string | null
          result_id: string
          semester: string
          student_id: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          academic_year: string
          assessment_date: string
          assessment_id?: string | null
          assessment_type: string
          co_number: number
          course_id: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          marks_obtained?: number
          po_mapping?: Json | null
          question_id?: string | null
          question_number: number
          remarks?: string | null
          result_id?: string
          semester: string
          student_id: string
          total_marks: number
          updated_at?: string
        }
        Update: {
          academic_year?: string
          assessment_date?: string
          assessment_id?: string | null
          assessment_type?: string
          co_number?: number
          course_id?: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          marks_obtained?: number
          po_mapping?: Json | null
          question_id?: string | null
          question_number?: number
          remarks?: string | null
          result_id?: string
          semester?: string
          student_id?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_question_result_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_question_result_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_question_result_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          ai_extractions_per_month: number | null
          ai_mappings_per_month: number | null
          ai_questions_per_month: number | null
          annual_price: number | null
          created_at: string | null
          currency: string | null
          features: Json
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_courses: number
          max_storage_gb: number | null
          max_users: number
          monthly_price: number | null
          name: string
          support_level: Database["public"]["Enums"]["support_level"] | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
        }
        Insert: {
          ai_extractions_per_month?: number | null
          ai_mappings_per_month?: number | null
          ai_questions_per_month?: number | null
          annual_price?: number | null
          created_at?: string | null
          currency?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_courses: number
          max_storage_gb?: number | null
          max_users: number
          monthly_price?: number | null
          name: string
          support_level?: Database["public"]["Enums"]["support_level"] | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Update: {
          ai_extractions_per_month?: number | null
          ai_mappings_per_month?: number | null
          ai_questions_per_month?: number | null
          annual_price?: number | null
          created_at?: string | null
          currency?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_courses?: number
          max_storage_gb?: number | null
          max_users?: number
          monthly_price?: number | null
          name?: string
          support_level?: Database["public"]["Enums"]["support_level"] | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Relationships: []
      }
      super_admin_profiles: {
        Row: {
          access_level: number | null
          account_locked: boolean | null
          allowed_organizations: string[] | null
          avatar_url: string | null
          backup_codes: string[] | null
          created_at: string | null
          dashboard_preferences: Json | null
          email: string
          failed_login_attempts: number | null
          full_name: string
          id: string
          ip_whitelist: string[] | null
          is_active: boolean | null
          language: string | null
          last_login: string | null
          locked_until: string | null
          login_count: number | null
          mfa_enabled: boolean | null
          mfa_secret: string | null
          notification_preferences: Json | null
          password_changed_at: string | null
          permissions: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["super_admin_role"] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: number | null
          account_locked?: boolean | null
          allowed_organizations?: string[] | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          created_at?: string | null
          dashboard_preferences?: Json | null
          email: string
          failed_login_attempts?: number | null
          full_name: string
          id: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          language?: string | null
          last_login?: string | null
          locked_until?: string | null
          login_count?: number | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          notification_preferences?: Json | null
          password_changed_at?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["super_admin_role"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: number | null
          account_locked?: boolean | null
          allowed_organizations?: string[] | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          created_at?: string | null
          dashboard_preferences?: Json | null
          email?: string
          failed_login_attempts?: number | null
          full_name?: string
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          language?: string | null
          last_login?: string | null
          locked_until?: string | null
          login_count?: number | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          notification_preferences?: Json | null
          password_changed_at?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["super_admin_role"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_communications: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          sender_type: Database["public"]["Enums"]["sender_type"]
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          sender_type: Database["public"]["Enums"]["sender_type"]
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          sender_type?: Database["public"]["Enums"]["sender_type"]
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_communications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_metrics_cache: {
        Row: {
          id: string
          month: string
          resolved_tickets: number | null
          total_tickets: number | null
          updated_at: string | null
          urgent_tickets: number | null
        }
        Insert: {
          id?: string
          month: string
          resolved_tickets?: number | null
          total_tickets?: number | null
          updated_at?: string | null
          urgent_tickets?: number | null
        }
        Update: {
          id?: string
          month?: string
          resolved_tickets?: number | null
          total_tickets?: number | null
          updated_at?: string | null
          urgent_tickets?: number | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          category: Database["public"]["Enums"]["support_category"]
          created_at: string | null
          created_by_email: string
          customer_satisfaction_rating: number | null
          description: string
          id: string
          organization_id: string | null
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          tags: string[] | null
          ticket_number: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          category: Database["public"]["Enums"]["support_category"]
          created_at?: string | null
          created_by_email: string
          customer_satisfaction_rating?: number | null
          description: string
          id?: string
          organization_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          tags?: string[] | null
          ticket_number: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: Database["public"]["Enums"]["support_category"]
          created_at?: string | null
          created_by_email?: string
          customer_satisfaction_rating?: number | null
          description?: string
          id?: string
          organization_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          tags?: string[] | null
          ticket_number?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_logs: {
        Row: {
          additional_data: Json | null
          component: string | null
          created_at: string | null
          error_message: string | null
          id: string
          response_time_ms: number | null
          server_location: string | null
          service_name: string
          status: Database["public"]["Enums"]["health_status"]
        }
        Insert: {
          additional_data?: Json | null
          component?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          server_location?: string | null
          service_name: string
          status: Database["public"]["Enums"]["health_status"]
        }
        Update: {
          additional_data?: Json | null
          component?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          server_location?: string | null
          service_name?: string
          status?: Database["public"]["Enums"]["health_status"]
        }
        Relationships: []
      }
      system_performance_metrics: {
        Row: {
          ai_avg_processing_time_ms: number | null
          ai_cost_per_hour: number | null
          ai_requests_per_minute: number | null
          ai_success_rate: number | null
          api_avg_response_time_ms: number | null
          api_error_rate: number | null
          api_requests_per_minute: number | null
          backup_storage_used_gb: number | null
          concurrent_users: number | null
          cpu_usage_percentage: number | null
          db_connections_active: number | null
          db_connections_max: number | null
          db_query_avg_time_ms: number | null
          db_slow_queries_count: number | null
          disk_usage_percentage: number | null
          id: string
          memory_usage_percentage: number | null
          peak_concurrent_users: number | null
          recorded_at: string | null
          total_storage_used_gb: number | null
        }
        Insert: {
          ai_avg_processing_time_ms?: number | null
          ai_cost_per_hour?: number | null
          ai_requests_per_minute?: number | null
          ai_success_rate?: number | null
          api_avg_response_time_ms?: number | null
          api_error_rate?: number | null
          api_requests_per_minute?: number | null
          backup_storage_used_gb?: number | null
          concurrent_users?: number | null
          cpu_usage_percentage?: number | null
          db_connections_active?: number | null
          db_connections_max?: number | null
          db_query_avg_time_ms?: number | null
          db_slow_queries_count?: number | null
          disk_usage_percentage?: number | null
          id?: string
          memory_usage_percentage?: number | null
          peak_concurrent_users?: number | null
          recorded_at?: string | null
          total_storage_used_gb?: number | null
        }
        Update: {
          ai_avg_processing_time_ms?: number | null
          ai_cost_per_hour?: number | null
          ai_requests_per_minute?: number | null
          ai_success_rate?: number | null
          api_avg_response_time_ms?: number | null
          api_error_rate?: number | null
          api_requests_per_minute?: number | null
          backup_storage_used_gb?: number | null
          concurrent_users?: number | null
          cpu_usage_percentage?: number | null
          db_connections_active?: number | null
          db_connections_max?: number | null
          db_query_avg_time_ms?: number | null
          db_slow_queries_count?: number | null
          disk_usage_percentage?: number | null
          id?: string
          memory_usage_percentage?: number | null
          peak_concurrent_users?: number | null
          recorded_at?: string | null
          total_storage_used_gb?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          environment: Database["public"]["Enums"]["environment_type"] | null
          id: string
          is_sensitive: boolean | null
          setting_key: string
          setting_type: Database["public"]["Enums"]["setting_type"] | null
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          environment?: Database["public"]["Enums"]["environment_type"] | null
          id?: string
          is_sensitive?: boolean | null
          setting_key: string
          setting_type?: Database["public"]["Enums"]["setting_type"] | null
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          environment?: Database["public"]["Enums"]["environment_type"] | null
          id?: string
          is_sensitive?: boolean | null
          setting_key?: string
          setting_type?: Database["public"]["Enums"]["setting_type"] | null
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_analytics: {
        Row: {
          activity_data: Json | null
          activity_date: string
          activity_type: string
          created_at: string
          feature_interactions: Json | null
          id: string
          organization_id: string | null
          page_views: number | null
          session_duration_minutes: number | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_date?: string
          activity_type: string
          created_at?: string
          feature_interactions?: Json | null
          id?: string
          organization_id?: string | null
          page_views?: number | null
          session_duration_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_date?: string
          activity_type?: string
          created_at?: string
          feature_interactions?: Json | null
          id?: string
          organization_id?: string | null
          page_views?: number | null
          session_duration_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_message: string | null
          invitation_token: string
          invited_by: string | null
          organization_id: string
          role: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invitation_message?: string | null
          invitation_token: string
          invited_by?: string | null
          organization_id: string
          role: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_message?: string | null
          invitation_token?: string
          invited_by?: string | null
          organization_id?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          created_at: string
          id: string
          new_role: string
          old_role: string | null
          organization_id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role: string
          old_role?: string | null
          organization_id: string
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string
          old_role?: string | null
          organization_id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          organization_id: string | null
          session_end: string | null
          session_start: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          organization_id?: string | null
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          organization_id?: string | null
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          context: Json | null
          current_step: number | null
          id: string
          started_at: string | null
          status: string | null
          step_results: Json | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          context?: Json | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          step_results?: Json | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          context?: Json | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          step_results?: Json | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "attainment_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_real_time_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_confidence_score: {
        Args: { extraction_data: Json; validation_results: Json }
        Returns: number
      }
      calculate_kpi_values: {
        Args: {
          kpi_definition_id: string
          start_period: string
          end_period: string
        }
        Returns: number
      }
      calculate_org_health_score: {
        Args: { org_id: string }
        Returns: number
      }
      calculate_organization_health_score: {
        Args: { org_id: string; period_days?: number }
        Returns: number
      }
      can_manage_course_assessments: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      check_final_security_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: string
        }[]
      }
      check_rls_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rls_enabled: boolean
          policies_count: number
        }[]
      }
      cleanup_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_organization_with_setup: {
        Args: {
          org_name: string
          org_code: string
          org_type: Database["public"]["Enums"]["organization_type"]
          admin_email: string
          admin_name: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          template_id?: string
        }
        Returns: Json
      }
      final_comprehensive_security_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_category: string
          issue_count: number
          severity: string
          status: string
          recommendation: string
        }[]
      }
      generate_agent_recommendation: {
        Args: {
          p_agent_type: string
          p_recommendation_type: string
          p_title: string
          p_description: string
          p_organization_id: string
          p_course_id?: string
          p_confidence_score?: number
          p_priority?: string
        }
        Returns: string
      }
      generate_daily_analytics_summary: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_daily_usage_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_monthly_billing: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_org_insights: {
        Args: { org_id: string }
        Returns: Json
      }
      get_academic_hierarchy: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: string
          organization_name: string
          program_count: number
        }[]
      }
      get_billing_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: string
          total_invoices: number
          total_revenue: number
          paid_invoices: number
          pending_invoices: number
        }[]
      }
      get_organization_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          code: string
          type: string
          subscription_tier: string
          subscription_status: string
          status: string
          created_at: string
          max_users: number
          max_courses: number
        }[]
      }
      get_organization_summary_view: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          code: string
          type: string
          subscription_tier: string
          status: string
          created_at: string
        }[]
      }
      get_super_admin_dashboard: {
        Args: { admin_id: string }
        Returns: Json
      }
      get_support_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          total_tickets: number
          resolved_tickets: number
          urgent_tickets: number
        }[]
      }
      get_support_ticket_overview: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          priority: string
          category: string
          ticket_count: number
        }[]
      }
      get_system_health_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          hour: string
          avg_cpu_usage: number
          avg_memory_usage: number
          peak_concurrent_users: number
        }[]
      }
      get_user_organization_role: {
        Args: { p_user_id: string }
        Returns: string
      }
      has_organization_access: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      increment_question_usage: {
        Args: { question_id: string }
        Returns: undefined
      }
      is_coordinator_assigned_to_program: {
        Args: { p_program_id: string }
        Returns: boolean
      }
      is_instructor_assigned_to_course: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      is_staff_for_student: {
        Args: { p_student_user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_super_admin_enhanced: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin_user: {
        Args: { user_id?: string }
        Returns: boolean
      }
      process_ai_agent_task: {
        Args: { task_id: string }
        Returns: boolean
      }
      process_evidence_upload: {
        Args: { evidence_id: string; file_path: string; file_hash: string }
        Returns: undefined
      }
      refresh_organization_summary_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      refresh_support_metrics_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      security_audit_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          status: string
          details: string
          risk_level: string
        }[]
      }
      supabase_auth_security_guide: {
        Args: Record<PropertyKey, never>
        Returns: {
          setting_category: string
          setting_name: string
          current_status: string
          recommendation: string
          configuration_location: string
        }[]
      }
      update_ai_learning_metrics: {
        Args: {
          task_type_param: string
          organization_id_param: string
          feedback_score_param: number
        }
        Returns: undefined
      }
      update_daily_org_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_all_functions_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          function_name: string
          has_security_definer: boolean
          has_search_path: boolean
          status: string
        }[]
      }
      verify_no_security_definer_views: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_type: string
          count: number
          status: string
          details: string
        }[]
      }
      verify_security_fixes: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          issue_count: number
          status: string
        }[]
      }
      view_replacement_guide: {
        Args: Record<PropertyKey, never>
        Returns: {
          old_view_name: string
          new_function_name: string
          usage_example: string
        }[]
      }
    }
    Enums: {
      ai_operation_type:
        | "syllabus_extraction"
        | "co_po_mapping"
        | "question_generation"
        | "blooms_classification"
        | "content_analysis"
      audit_action:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "export"
        | "import"
        | "configure"
      audit_risk: "low" | "medium" | "high" | "critical"
      backup_job_status: "scheduled" | "running" | "completed" | "failed"
      backup_type: "full_database" | "incremental"
      communication_channel: "email" | "chat" | "system"
      communication_type: "initial" | "reply" | "note"
      comparison_op: "greater_than" | "less_than" | "equals" | "not_equals"
      course_type: "core" | "elective" | "practical" | "project" | "internship"
      disaster_scenario:
        | "database_failure"
        | "server_failure"
        | "network_outage"
        | "cyber_attack"
        | "data_corruption"
        | "natural_disaster"
        | "human_error"
      environment_type: "development" | "staging" | "production"
      health_status: "healthy" | "warning" | "critical" | "down"
      integration_service:
        | "openai_gpt"
        | "google_gemini"
        | "aws_textract"
        | "twilio_sms"
        | "sendgrid_email"
        | "stripe_billing"
        | "razorpay_billing"
      notification_channel: "email" | "sms" | "in_app"
      notification_priority: "low" | "medium" | "high" | "urgent"
      notification_status: "pending" | "sent" | "failed"
      organization_status:
        | "active"
        | "inactive"
        | "suspended"
        | "pending_approval"
        | "onboarding"
      organization_type:
        | "university"
        | "college"
        | "institute"
        | "school"
        | "training_center"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_paid"
      program_status: "active" | "inactive" | "discontinued"
      programType:
        | "undergraduate"
        | "postgraduate"
        | "diploma"
        | "certificate"
        | "doctoral"
      semester_type: "odd" | "even" | "summer" | "winter"
      sender_type: "admin" | "customer" | "system"
      setting_type:
        | "config"
        | "feature_flag"
        | "integration"
        | "security"
        | "ui_customization"
      stats_type: "daily" | "weekly" | "monthly"
      subscription_status:
        | "active"
        | "suspended"
        | "cancelled"
        | "expired"
        | "pending"
      subscription_tier:
        | "trial"
        | "basic"
        | "standard"
        | "premium"
        | "enterprise"
      super_admin_role:
        | "super_admin"
        | "admin"
        | "support"
        | "analyst"
        | "billing_admin"
      support_category:
        | "technical"
        | "billing"
        | "feature_request"
        | "bug_report"
        | "training"
        | "onboarding"
      support_level: "email" | "chat" | "phone" | "dedicated"
      template_type:
        | "university_autonomous"
        | "affiliated_college"
        | "technical_institute"
        | "management_school"
        | "arts_science"
        | "engineering"
        | "medical"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_customer"
        | "resolved"
        | "closed"
      user_role:
        | "super_admin"
        | "admin"
        | "faculty"
        | "iqac"
        | "hod"
        | "coordinator"
        | "student"
      verification_status: "pending" | "verified" | "failed" | "skipped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_operation_type: [
        "syllabus_extraction",
        "co_po_mapping",
        "question_generation",
        "blooms_classification",
        "content_analysis",
      ],
      audit_action: [
        "create",
        "read",
        "update",
        "delete",
        "login",
        "logout",
        "export",
        "import",
        "configure",
      ],
      audit_risk: ["low", "medium", "high", "critical"],
      backup_job_status: ["scheduled", "running", "completed", "failed"],
      backup_type: ["full_database", "incremental"],
      communication_channel: ["email", "chat", "system"],
      communication_type: ["initial", "reply", "note"],
      comparison_op: ["greater_than", "less_than", "equals", "not_equals"],
      course_type: ["core", "elective", "practical", "project", "internship"],
      disaster_scenario: [
        "database_failure",
        "server_failure",
        "network_outage",
        "cyber_attack",
        "data_corruption",
        "natural_disaster",
        "human_error",
      ],
      environment_type: ["development", "staging", "production"],
      health_status: ["healthy", "warning", "critical", "down"],
      integration_service: [
        "openai_gpt",
        "google_gemini",
        "aws_textract",
        "twilio_sms",
        "sendgrid_email",
        "stripe_billing",
        "razorpay_billing",
      ],
      notification_channel: ["email", "sms", "in_app"],
      notification_priority: ["low", "medium", "high", "urgent"],
      notification_status: ["pending", "sent", "failed"],
      organization_status: [
        "active",
        "inactive",
        "suspended",
        "pending_approval",
        "onboarding",
      ],
      organization_type: [
        "university",
        "college",
        "institute",
        "school",
        "training_center",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_paid",
      ],
      program_status: ["active", "inactive", "discontinued"],
      programType: [
        "undergraduate",
        "postgraduate",
        "diploma",
        "certificate",
        "doctoral",
      ],
      semester_type: ["odd", "even", "summer", "winter"],
      sender_type: ["admin", "customer", "system"],
      setting_type: [
        "config",
        "feature_flag",
        "integration",
        "security",
        "ui_customization",
      ],
      stats_type: ["daily", "weekly", "monthly"],
      subscription_status: [
        "active",
        "suspended",
        "cancelled",
        "expired",
        "pending",
      ],
      subscription_tier: [
        "trial",
        "basic",
        "standard",
        "premium",
        "enterprise",
      ],
      super_admin_role: [
        "super_admin",
        "admin",
        "support",
        "analyst",
        "billing_admin",
      ],
      support_category: [
        "technical",
        "billing",
        "feature_request",
        "bug_report",
        "training",
        "onboarding",
      ],
      support_level: ["email", "chat", "phone", "dedicated"],
      template_type: [
        "university_autonomous",
        "affiliated_college",
        "technical_institute",
        "management_school",
        "arts_science",
        "engineering",
        "medical",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_customer",
        "resolved",
        "closed",
      ],
      user_role: [
        "super_admin",
        "admin",
        "faculty",
        "iqac",
        "hod",
        "coordinator",
        "student",
      ],
      verification_status: ["pending", "verified", "failed", "skipped"],
    },
  },
} as const
