
import { z } from 'zod';

// Organization schemas
export const organizationCreateSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(255),
  code: z.string().min(2, 'Code must be at least 2 characters').max(10),
  type: z.enum(['college', 'university', 'institute', 'school']),
  official_email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional()
  }).optional()
});

// Course schemas
export const courseCreateSchema = z.object({
  name: z.string().min(1, 'Course name is required').max(255),
  code: z.string().min(3, 'Course code must be at least 3 characters').max(20),
  description: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10),
  theory_hours: z.number().min(0).max(100).optional(),
  practical_hours: z.number().min(0).max(100).optional(),
  course_type: z.enum(['core', 'elective', 'audit', 'project']),
  prerequisites: z.array(z.string()).optional(),
  learning_outcomes: z.array(z.string()).optional(),
  semester_id: z.string().uuid('Invalid semester ID')
});

// Assessment schemas
export const assessmentUploadSchema = z.object({
  assessment_type: z.enum(['quiz', 'assignment', 'mid_term', 'final_exam', 'project', 'lab', 'presentation']),
  course_id: z.string().uuid('Invalid course ID'),
  assessment_name: z.string().min(1, 'Assessment name is required'),
  total_marks: z.number().min(1, 'Total marks must be at least 1'),
  conducted_date: z.date(),
  marks_data: z.array(z.object({
    student_id: z.string().min(1, 'Student ID is required'),
    marks_obtained: z.number().min(0),
    co_wise_marks: z.record(z.string(), z.number()).optional()
  })).min(1, 'At least one student record is required')
});

// Question bank schemas
export const questionCreateSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
  question_text: z.string().min(1, 'Question text is required'),
  question_type: z.enum(['mcq', 'short_answer', 'long_answer', 'numerical', 'true_false']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  blooms_level: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']),
  co_mapping: z.number().min(1, 'CO mapping is required'),
  unit_mapping: z.number().optional(),
  marks: z.number().min(1, 'Marks must be at least 1'),
  options: z.array(z.object({
    text: z.string(),
    is_correct: z.boolean()
  })).optional(),
  answer_key: z.string().min(1, 'Answer key is required'),
  hints: z.string().optional(),
  explanation: z.string().optional()
});

// User invitation schemas
export const userInvitationSchema = z.object({
  email: z.string().email('Invalid email format'),
  role: z.enum(['admin', 'faculty', 'hod', 'iqac', 'coordinator']),
  department: z.string().optional(),
  designation: z.string().optional(),
  permissions: z.array(z.string()).optional()
});

// CO-PO mapping schemas
export const copoMappingSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
  mapping_data: z.record(z.string(), z.record(z.string(), z.number().min(0).max(3)))
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  upload_type: z.enum(['syllabus', 'assessment', 'evidence', 'template']),
  organization_id: z.string().uuid('Invalid organization ID'),
  course_id: z.string().uuid().optional(),
  program_id: z.string().uuid().optional()
});

// System configuration schemas
export const systemConfigSchema = z.object({
  ai_model_preference: z.enum(['openai', 'gemini', 'auto']),
  max_file_size_mb: z.number().min(1).max(100),
  allowed_file_types: z.array(z.string()),
  default_co_threshold: z.number().min(0).max(100),
  default_po_target: z.number().min(0).max(3),
  email_notifications_enabled: z.boolean(),
  auto_backup_enabled: z.boolean(),
  retention_period_days: z.number().min(30).max(3650)
});

// Report generation schemas
export const reportGenerationSchema = z.object({
  report_type: z.enum(['naac', 'nba', 'custom', 'academic']),
  template_id: z.string().uuid().optional(),
  organization_id: z.string().uuid('Invalid organization ID'),
  program_ids: z.array(z.string().uuid()).optional(),
  academic_years: z.array(z.string()).optional(),
  include_evidence: z.boolean().optional(),
  custom_sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    order: z.number()
  })).optional()
});

// Analytics filter schemas
export const analyticsFilterSchema = z.object({
  date_range: z.object({
    start_date: z.date(),
    end_date: z.date()
  }),
  organization_ids: z.array(z.string().uuid()).optional(),
  program_ids: z.array(z.string().uuid()).optional(),
  course_ids: z.array(z.string().uuid()).optional(),
  metrics: z.array(z.string()).optional(),
  aggregation: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional()
});

// Export all schemas
export const validationSchemas = {
  organizationCreate: organizationCreateSchema,
  courseCreate: courseCreateSchema,
  assessmentUpload: assessmentUploadSchema,
  questionCreate: questionCreateSchema,
  userInvitation: userInvitationSchema,
  copoMapping: copoMappingSchema,
  fileUpload: fileUploadSchema,
  systemConfig: systemConfigSchema,
  reportGeneration: reportGenerationSchema,
  analyticsFilter: analyticsFilterSchema
};

// Helper function to validate data against schema
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
};
