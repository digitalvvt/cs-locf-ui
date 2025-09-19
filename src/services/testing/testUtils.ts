
import { supabase } from '@/integrations/supabase/client';

export interface TestUser {
  id: string;
  email: string;
  role: string;
  organization_id: string;
}

export interface TestOrganization {
  id: string;
  name: string;
  code: string;
  type: 'university' | 'college' | 'institute' | 'school' | 'training_center';
  official_email: string;
}

export interface TestCourse {
  id: string;
  name: string;
  code: string;
  semester_id: string;
}

// Test data factory functions
export const createTestUser = async (overrides?: Partial<TestUser>): Promise<TestUser> => {
  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    role: 'faculty',
    organization_id: 'test-org-id'
  };

  const userData = { ...defaultUser, ...overrides };
  
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: 'testpassword123'
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  return {
    id: data.user.id,
    ...userData
  };
};

export const createTestOrganization = async (overrides?: Partial<TestOrganization>): Promise<TestOrganization> => {
  const defaultOrg = {
    name: `Test Organization ${Date.now()}`,
    code: `TEST${Date.now().toString().slice(-4)}`,
    type: 'college' as const,
    official_email: `test-${Date.now()}@example.com`
  };

  const orgData = { ...defaultOrg, ...overrides };

  const { data, error } = await supabase
    .from('organizations')
    .insert(orgData)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test organization: ${error?.message}`);
  }

  return data;
};

export const createTestCourse = async (organization_id: string, overrides?: Partial<TestCourse>): Promise<TestCourse> => {
  // First create a test program
  const { data: program, error: programError } = await supabase
    .from('programs')
    .insert({
      name: `Test Program ${Date.now()}`,
      code: `TP${Date.now().toString().slice(-4)}`,
      organization_id,
      programType: 'undergraduate',
      duration_years: 4,
      total_semesters: 8
    })
    .select()
    .single();

  if (programError || !program) {
    throw new Error(`Failed to create test program: ${programError?.message}`);
  }

  // Create academic year
  const { data: academicYear, error: academicYearError } = await supabase
    .from('academic_years')
    .insert({
      academic_year: '2024-25',
      year_number: 1,
      program_id: program.id,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      is_active: true
    })
    .select()
    .single();

  if (academicYearError || !academicYear) {
    throw new Error(`Failed to create test academic year: ${academicYearError?.message}`);
  }

  // Create semester using correct schema
  const { data: semester, error: semesterError } = await supabase
    .from('semesters')
    .insert({
      semester_number: 1,
      name: 'Semester 1',
      academic_year_id: academicYear.id,
      start_date: '2024-07-01',
      end_date: '2024-12-31',
      is_active: true,
      semester_type: 'odd'
    })
    .select()
    .single();

  if (semesterError || !semester) {
    throw new Error(`Failed to create test semester: ${semesterError?.message}`);
  }

  const defaultCourse = {
    name: `Test Course ${Date.now()}`,
    code: `TC${Date.now().toString().slice(-4)}`,
    semester_id: semester.id
  };

  const courseData = { ...defaultCourse, ...overrides };

  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      credits: 3,
      course_type: 'core',
      description: 'Test course description'
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test course: ${error?.message}`);
  }

  return data;
};

// Cleanup functions
export const cleanupTestData = async () => {
  try {
    // Delete test organizations (cascade will handle related data)
    await supabase
      .from('organizations')
      .delete()
      .like('name', 'Test Organization%');

    // Delete test users from user_profiles table instead of profiles
    await supabase
      .from('user_profiles')
      .delete()
      .like('email', 'test-%@example.com');

  } catch (error) {
    console.error('Failed to cleanup test data:', error);
  }
};

// Mock data generators
export const generateMockCOPOMapping = () => {
  const coCount = 5;
  const poCount = 12;
  const mapping: Record<string, Record<string, number>> = {};

  for (let co = 1; co <= coCount; co++) {
    mapping[`CO${co}`] = {};
    for (let po = 1; po <= poCount; po++) {
      // Random mapping value (0, 1, 2, or 3)
      mapping[`CO${co}`][`PO${po}`] = Math.floor(Math.random() * 4);
    }
  }

  return mapping;
};

export const generateMockAssessmentData = (studentCount: number = 30) => {
  const students = [];
  
  for (let i = 1; i <= studentCount; i++) {
    students.push({
      student_id: `STU${i.toString().padStart(3, '0')}`,
      marks_obtained: Math.floor(Math.random() * 100),
      co_wise_marks: {
        CO1: Math.floor(Math.random() * 20),
        CO2: Math.floor(Math.random() * 20),
        CO3: Math.floor(Math.random() * 20),
        CO4: Math.floor(Math.random() * 20),
        CO5: Math.floor(Math.random() * 20)
      }
    });
  }

  return students;
};

export const generateMockQuestionBank = (courseId: string, questionCount: number = 50) => {
  const questions = [];
  const questionTypes = ['mcq', 'short_answer', 'long_answer', 'numerical'];
  const difficulties = ['easy', 'medium', 'hard'];
  const bloomsLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

  for (let i = 1; i <= questionCount; i++) {
    questions.push({
      course_id: courseId,
      question_text: `Sample question ${i} for testing purposes`,
      question_type: questionTypes[Math.floor(Math.random() * questionTypes.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      blooms_level: bloomsLevels[Math.floor(Math.random() * bloomsLevels.length)],
      co_mapping: Math.floor(Math.random() * 5) + 1,
      marks: Math.floor(Math.random() * 5) + 1,
      answer_key: `Answer for question ${i}`,
      options: Math.random() > 0.5 ? [
        { text: 'Option A', is_correct: true },
        { text: 'Option B', is_correct: false },
        { text: 'Option C', is_correct: false },
        { text: 'Option D', is_correct: false }
      ] : null
    });
  }

  return questions;
};

// Test assertion helpers
export const assertValidResponse = (response: any) => {
  if (!response || response.error) {
    throw new Error(`Invalid response: ${response?.error?.message || 'Unknown error'}`);
  }
  return response;
};

export const assertArrayLength = (array: any[], expectedLength: number, message?: string) => {
  if (!Array.isArray(array) || array.length !== expectedLength) {
    throw new Error(message || `Expected array length ${expectedLength}, got ${array?.length || 'not an array'}`);
  }
};

export const assertObjectHasProperties = (obj: any, properties: string[], message?: string) => {
  const missingProps = properties.filter(prop => !(prop in obj));
  if (missingProps.length > 0) {
    throw new Error(message || `Missing properties: ${missingProps.join(', ')}`);
  }
};

// Performance testing helpers
export const measureExecutionTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
};

export const loadTest = async (fn: () => Promise<any>, concurrentRequests: number = 10, iterations: number = 5) => {
  const results: { success: boolean; duration: number; error?: string }[] = [];

  for (let i = 0; i < iterations; i++) {
    const promises = Array(concurrentRequests).fill(null).map(async () => {
      try {
        const { duration } = await measureExecutionTime(fn);
        return { success: true, duration };
      } catch (error) {
        return { success: false, duration: 0, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  const successCount = results.filter(r => r.success).length;
  const avgDuration = results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successCount;

  return {
    totalRequests: results.length,
    successCount,
    failureCount: results.length - successCount,
    successRate: (successCount / results.length) * 100,
    averageDuration: avgDuration,
    results
  };
};
