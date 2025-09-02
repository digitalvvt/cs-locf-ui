
import { supabase } from '@/integrations/supabase/client';

export interface TestDataCleanup {
  organizations: string[];
  users: string[];
  courses: string[];
  assessments: string[];
}

export class TestDataFactory {
  private createdData: TestDataCleanup = {
    organizations: [],
    users: [],
    courses: [],
    assessments: []
  };

  // Organization factory
  async createTestOrganization(overrides?: Partial<any>) {
    const orgData = {
      name: `Test Org ${Date.now()}`,
      code: `TEST${Date.now().toString().slice(-4)}`,
      type: 'college' as const,
      official_email: `test-${Date.now()}@example.com`,
      subscription_tier: 'trial' as const,
      status: 'active' as const,
      max_users: 50,
      max_courses: 100,
      ...overrides
    };

    const { data, error } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create test organization: ${error.message}`);
    
    this.createdData.organizations.push(data.id);
    return data;
  }

  // User factory
  async createTestUser(organizationId: string, overrides?: Partial<any>) {
    const userData = {
      email: `test-user-${Date.now()}@example.com`,
      full_name: `Test User ${Date.now()}`,
      role: 'faculty',
      organization_id: organizationId,
      is_active: true,
      ...overrides
    };

    // Create auth user first (mock)
    const authUserId = `test-user-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: authUserId,
        ...userData
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create test user: ${error.message}`);
    
    this.createdData.users.push(data.id);
    return data;
  }

  // Program and Course factory
  async createTestCourse(organizationId: string, overrides?: Partial<any>) {
    // Create program first
    const { data: program, error: programError } = await supabase
      .from('programs')
      .insert({
        name: `Test Program ${Date.now()}`,
        code: `TP${Date.now().toString().slice(-4)}`,
        organization_id: organizationId,
        programType: 'undergraduate' as const,
        duration_years: 4,
        total_semesters: 8
      })
      .select()
      .single();

    if (programError) throw new Error(`Failed to create test program: ${programError.message}`);

    // Create academic year
    const { data: academicYear, error: yearError } = await supabase
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

    if (yearError) throw new Error(`Failed to create academic year: ${yearError.message}`);

    // Create semester
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

    if (semesterError) throw new Error(`Failed to create semester: ${semesterError.message}`);

    // Create course
    const courseData = {
      name: `Test Course ${Date.now()}`,
      code: `TC${Date.now().toString().slice(-4)}`,
      semester_id: semester.id,
      credits: 3,
      course_type: 'core' as const,
      description: 'Test course for automated testing',
      theory_hours: 3,
      practical_hours: 1,
      is_active: true,
      ...overrides
    };

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (courseError) throw new Error(`Failed to create test course: ${courseError.message}`);
    
    this.createdData.courses.push(course.id);
    return course;
  }

  // Assessment factory
  async createTestAssessment(courseId: string, overrides?: Partial<any>) {
    const assessmentData = {
      course_id: courseId,
      student_roll_number: `STU${Date.now().toString().slice(-4)}`,
      student_name: `Test Student ${Date.now()}`,
      assessment_type: 'IA1',
      assessment_name: `Test Assessment ${Date.now()}`,
      question_scores: {
        Q1: Math.floor(Math.random() * 10) + 1,
        Q2: Math.floor(Math.random() * 10) + 1,
        Q3: Math.floor(Math.random() * 10) + 1
      },
      co_scores: {
        CO1: Math.floor(Math.random() * 20) + 1,
        CO2: Math.floor(Math.random() * 20) + 1
      },
      total_score: Math.floor(Math.random() * 50) + 25,
      max_marks: 50,
      assessment_date: new Date().toISOString().split('T')[0],
      ...overrides
    };

    const { data, error } = await supabase
      .from('student_assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create test assessment: ${error.message}`);
    
    this.createdData.assessments.push(data.id);
    return data;
  }

  // CO-PO Mapping factory
  async createTestCOPOMapping(courseId: string) {
    const mappingData = {
      course_id: courseId,
      co_number: 1,
      po_mappings: {
        PO1: 3,
        PO2: 2,
        PO3: 1,
        PO4: 0,
        PO5: 2
      },
      mapping_strength: 'strong',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('co_po_mappings')
      .insert(mappingData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create CO-PO mapping: ${error.message}`);
    return data;
  }

  // Question Bank factory
  async createTestQuestion(courseId: string, overrides?: Partial<any>) {
    const questionData = {
      course_id: courseId,
      question_text: `Test question ${Date.now()}?`,
      question_type: 'mcq',
      difficulty: 'medium',
      blooms_level: 'understand',
      co_mapping: Math.floor(Math.random() * 5) + 1,
      marks: Math.floor(Math.random() * 5) + 1,
      options: [
        { text: 'Option A', is_correct: true },
        { text: 'Option B', is_correct: false },
        { text: 'Option C', is_correct: false },
        { text: 'Option D', is_correct: false }
      ],
      answer_key: 'Option A is correct',
      usage_count: 0,
      tags: ['test', 'automated'],
      ...overrides
    };

    const { data, error } = await supabase
      .from('question_bank')
      .insert(questionData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create test question: ${error.message}`);
    return data;
  }

  // Complete test scenario factory
  async createCompleteTestScenario() {
    const organization = await this.createTestOrganization();
    const user = await this.createTestUser(organization.id, { role: 'admin' });
    const course = await this.createTestCourse(organization.id);
    const assessment = await this.createTestAssessment(course.id);
    const mapping = await this.createTestCOPOMapping(course.id);
    const question = await this.createTestQuestion(course.id);

    return {
      organization,
      user,
      course,
      assessment,
      mapping,
      question
    };
  }

  // Bulk data creation
  async createBulkAssessments(courseId: string, count: number = 30) {
    const assessments = [];
    
    for (let i = 0; i < count; i++) {
      const assessment = await this.createTestAssessment(courseId, {
        student_roll_number: `STU${(i + 1).toString().padStart(3, '0')}`,
        student_name: `Student ${i + 1}`
      });
      assessments.push(assessment);
    }

    return assessments;
  }

  async createBulkQuestions(courseId: string, count: number = 50) {
    const questions = [];
    const questionTypes = ['mcq', 'short_answer', 'long_answer', 'numerical'];
    const difficulties = ['easy', 'medium', 'hard'];
    const bloomsLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

    for (let i = 0; i < count; i++) {
      const question = await this.createTestQuestion(courseId, {
        question_text: `Generated test question ${i + 1}?`,
        question_type: questionTypes[Math.floor(Math.random() * questionTypes.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        blooms_level: bloomsLevels[Math.floor(Math.random() * bloomsLevels.length)],
        co_mapping: Math.floor(Math.random() * 5) + 1,
        marks: Math.floor(Math.random() * 5) + 1
      });
      questions.push(question);
    }

    return questions;
  }

  // Cleanup methods
  async cleanup() {
    try {
      // Clean up in reverse order to handle foreign key constraints
      
      // Clean up assessments
      if (this.createdData.assessments.length > 0) {
        await supabase
          .from('student_assessments')
          .delete()
          .in('id', this.createdData.assessments);
      }

      // Clean up courses (will cascade to related data)
      if (this.createdData.courses.length > 0) {
        await supabase
          .from('courses')
          .delete()
          .in('id', this.createdData.courses);
      }

      // Clean up users
      if (this.createdData.users.length > 0) {
        await supabase
          .from('user_profiles')
          .delete()
          .in('id', this.createdData.users);
      }

      // Clean up organizations (will cascade to related data)
      if (this.createdData.organizations.length > 0) {
        await supabase
          .from('organizations')
          .delete()
          .in('id', this.createdData.organizations);
      }

      // Reset tracking
      this.createdData = {
        organizations: [],
        users: [],
        courses: [],
        assessments: []
      };

    } catch (error) {
      console.error('❌ Test data cleanup failed:', error);
      throw error;
    }
  }

  async cleanupAll() {
    try {
      // Delete all test data (use with caution!)
      await supabase
        .from('organizations')
        .delete()
        .like('name', 'Test Org%');

      await supabase
        .from('user_profiles')
        .delete()
        .like('email', 'test-%@example.com');

    } catch (error) {
      console.error('❌ Complete cleanup failed:', error);
      throw error;
    }
  }

  getCreatedData(): TestDataCleanup {
    return { ...this.createdData };
  }
}

export const useTestDataFactory = () => {
  return new TestDataFactory();
};
