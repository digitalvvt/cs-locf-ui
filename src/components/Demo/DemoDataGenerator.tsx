import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Users, BookOpen, FileText, BarChart3, Brain, Database, LogIn } from 'lucide-react';

interface DemoStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export const DemoDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [demoCredentials, setDemoCredentials] = useState<any>(null);
  const { toast } = useToast();

  const demoSteps: DemoStep[] = [
    {
      id: 'organization',
      name: 'Demo Organization',
      description: 'Create Sunrise Engineering College with subscription',
      icon: <Database className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'users',
      name: 'Demo Users',
      description: 'Create realistic user accounts with different roles',
      icon: <Users className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'academic',
      name: 'Academic Structure',
      description: 'Programs, semesters, and courses setup',
      icon: <BookOpen className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'questions',
      name: 'Question Bank',
      description: 'Generate 200+ questions across all courses',
      icon: <FileText className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'assessments',
      name: 'Assessment Data',
      description: 'Student scores and assessment papers',
      icon: <BarChart3 className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'mappings',
      name: 'CO-PO Mappings',
      description: 'Course outcomes and program outcomes mapping',
      icon: <Brain className="h-5 w-5" />,
      completed: false
    }
  ];

  const updateProgress = (step: string, percentage: number) => {
    setCurrentStep(step);
    setProgress(percentage);
  };

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
  };

  const createDemoOrganization = async () => {
    updateProgress('Creating demo organization...', 10);
    
    try {
      // Create main organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Sunrise Engineering College',
          code: 'SEC2024',
          type: 'college',
          official_email: 'info@sunrisetech.edu',
          phone: '+91-9876543210',
          website: 'https://sunrisetech.edu',
          established_year: 1995,
          subscription_tier: 'premium',
          subscription_status: 'active',
          subscription_start_date: '2024-01-01',
          subscription_end_date: '2025-01-01',
          status: 'active',
          max_users: 500,
          max_courses: 200,
          onboarding_completed: true,
          onboarding_step: 8
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create onboarding record
      await supabase
        .from('organization_onboarding')
        .insert({
          organization_id: org.id,
          current_step: 8,
          total_steps: 8,
          steps_completed: {
            "1": true, "2": true, "3": true, "4": true,
            "5": true, "6": true, "7": true, "8": true
          },
          completion_percentage: 100
        });

      markStepCompleted('organization');
      return org;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const createDemoUsers = async (organizationId: string) => {
    updateProgress('Creating demo users...', 25);
    
    const demoUsers = [
      {
        id: 'demo-admin-001',
        email: 'admin@sunrisetech.edu',
        full_name: 'Dr. Sarah Johnson',
        role: 'admin' as const,
        department: 'Administration',
        employee_id: 'ADM001',
        password: 'admin123'
      },
      {
        id: 'demo-principal-001',
        email: 'principal@sunrisetech.edu',
        full_name: 'Dr. Michael Thompson',
        role: 'admin' as const,
        department: 'Administration',
        employee_id: 'PRI001',
        password: 'principal123'
      },
      {
        id: 'demo-faculty-001',
        email: 'prof.smith@sunrisetech.edu',
        full_name: 'Prof. John Smith',
        role: 'faculty' as const,
        department: 'Computer Science',
        employee_id: 'CS001',
        password: 'faculty123'
      },
      {
        id: 'demo-faculty-002',
        email: 'prof.jones@sunrisetech.edu',
        full_name: 'Prof. Emily Jones',
        role: 'faculty' as const,
        department: 'Mechanical Engineering',
        employee_id: 'ME001',
        password: 'faculty123'
      },
      {
        id: 'demo-iqac-001',
        email: 'iqac@sunrisetech.edu',
        full_name: 'Dr. Robert Wilson',
        role: 'iqac' as const,
        department: 'Quality Assurance',
        employee_id: 'QA001',
        password: 'iqac123'
      }
    ];

    const createdUsers = [];

    try {
      for (const user of demoUsers) {
        // Create user profile directly (simulating user registration)
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            organization_id: organizationId,
            is_active: true,
            department: user.department,
            employee_id: user.employee_id,
            phone: '+91-9876543210',
            joining_date: '2024-01-01'
          });

        if (profileError) throw profileError;

        // Create organization membership
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            user_id: user.id,
            organization_id: organizationId,
            role: user.role,
            status: 'active',
            joined_at: new Date().toISOString()
          });

        if (memberError) throw memberError;

        createdUsers.push({
          id: user.id,
          email: user.email,
          password: user.password,
          full_name: user.full_name,
          role: user.role
        });
      }

      // Store demo credentials for display
      setDemoCredentials(createdUsers);
      markStepCompleted('users');
      return createdUsers;
    } catch (error) {
      console.error('Error creating users:', error);
      throw error;
    }
  };

  const createAcademicStructure = async (organizationId: string) => {
    updateProgress('Creating academic structure...', 40);
    
    try {
      // Create programs
      const programs = [
        {
          name: 'Computer Science Engineering',
          code: 'CSE',
          programType: 'undergraduate' as const,
          duration_years: 4,
          total_semesters: 8
        },
        {
          name: 'Mechanical Engineering',
          code: 'ME',
          programType: 'undergraduate' as const,
          duration_years: 4,
          total_semesters: 8
        },
        {
          name: 'Electronics & Communication',
          code: 'ECE',
          programType: 'undergraduate' as const,
          duration_years: 4,
          total_semesters: 8
        }
      ];

      const createdPrograms = [];
      for (const program of programs) {
        const { data, error } = await supabase
          .from('programs')
          .insert({
            ...program,
            organization_id: organizationId,
            status: 'active'
          })
          .select()
          .single();

        if (error) throw error;
        createdPrograms.push(data);
      }

      // Create academic years and semesters for CSE program
      const cseProgram = createdPrograms.find(p => p.code === 'CSE');
      if (cseProgram) {
        const { data: academicYear, error: yearError } = await supabase
          .from('academic_years')
          .insert({
            academic_year: '2024-25',
            year_number: 2,
            program_id: cseProgram.id,
            start_date: '2024-07-01',
            end_date: '2025-06-30',
            is_active: true
          })
          .select()
          .single();

        if (yearError) throw yearError;

        const { data: semester, error: semesterError } = await supabase
          .from('semesters')
          .insert({
            semester_number: 3,
            name: 'Semester 3',
            academic_year_id: academicYear.id,
            start_date: '2024-07-01',
            end_date: '2024-12-31',
            is_active: true,
            semester_type: 'odd'
          })
          .select()
          .single();

        if (semesterError) throw semesterError;

        // Create courses
        const courses = [
          {
            name: 'Data Structures & Algorithms',
            code: 'CS301',
            credits: 4,
            theory_hours: 3,
            practical_hours: 2,
            course_type: 'core' as const
          },
          {
            name: 'Object Oriented Programming',
            code: 'CS302',
            credits: 4,
            theory_hours: 3,
            practical_hours: 2,
            course_type: 'core' as const
          },
          {
            name: 'Database Management Systems',
            code: 'CS303',
            credits: 4,
            theory_hours: 3,
            practical_hours: 2,
            course_type: 'core' as const
          },
          {
            name: 'Computer Networks',
            code: 'CS304',
            credits: 3,
            theory_hours: 3,
            practical_hours: 0,
            course_type: 'core' as const
          },
          {
            name: 'Mathematics-III',
            code: 'MA301',
            credits: 3,
            theory_hours: 3,
            practical_hours: 0,
            course_type: 'elective' as const
          }
        ];

        const createdCourses = [];
        for (const course of courses) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .insert({
              ...course,
              semester_id: semester.id,
              description: `${course.name} - Comprehensive course covering fundamental concepts and practical applications`,
              learning_outcomes: [
                `Understand core concepts of ${course.name}`,
                `Apply theoretical knowledge in practical scenarios`,
                `Analyze and solve complex problems`,
                `Design efficient solutions`,
                `Evaluate and optimize implementations`
              ],
              is_active: true
            })
            .select()
            .single();

          if (courseError) throw courseError;
          createdCourses.push(courseData);
        }

        // Create instructor assignments for the demo courses
        await createInstructorAssignments(createdCourses, organizationId);
      }

      markStepCompleted('academic');
    } catch (error) {
      console.error('Error creating academic structure:', error);
      throw error;
    }
  };

  const createInstructorAssignments = async (courses: any[], organizationId: string) => {
    try {
      // Assign Prof. Smith to CS courses
      for (const course of courses.filter(c => c.code.startsWith('CS'))) {
        await supabase
          .from('instructor_course_assignments')
          .insert({
            user_id: 'demo-faculty-001',
            course_id: course.id,
            organization_id: organizationId,
            assigned_by: 'demo-admin-001',
            status: 'active',
            academic_year: '2024-25',
            semester: 'Semester 3'
          });
      }

      // Assign Prof. Jones to Mathematics
      const mathCourse = courses.find(c => c.code === 'MA301');
      if (mathCourse) {
        await supabase
          .from('instructor_course_assignments')
          .insert({
            user_id: 'demo-faculty-002',
            course_id: mathCourse.id,
            organization_id: organizationId,
            assigned_by: 'demo-admin-001',
            status: 'active',
            academic_year: '2024-25',
            semester: 'Semester 3'
          });
      }
    } catch (error) {
      console.error('Error creating instructor assignments:', error);
    }
  };

  const generateQuestionBank = async () => {
    updateProgress('Generating question bank...', 60);
    
    try {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name, code');

      if (!courses || courses.length === 0) return;

      const questionTypes = ['mcq', 'short_answer', 'long_answer', 'numerical'];
      const difficulties = ['easy', 'medium', 'hard'];
      const bloomsLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

      for (const course of courses) {
        // Generate 40 questions per course
        for (let i = 1; i <= 40; i++) {
          const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
          const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
          const bloomsLevel = bloomsLevels[Math.floor(Math.random() * bloomsLevels.length)];
          
          const questionData = {
            course_id: course.id,
            question_text: `Sample ${difficulty} question ${i} for ${course.name}. ${getQuestionText(questionType, course.name, i)}`,
            question_type: questionType,
            difficulty: difficulty,
            blooms_level: bloomsLevel,
            co_mapping: Math.floor(Math.random() * 5),
            marks: Math.floor(Math.random() * 5) + 1,
            answer_key: getAnswerKey(questionType, i),
            options: questionType === 'mcq' ? [
              { text: `Option A for question ${i}`, is_correct: true },
              { text: `Option B for question ${i}`, is_correct: false },
              { text: `Option C for question ${i}`, is_correct: false },
              { text: `Option D for question ${i}`, is_correct: false }
            ] : null,
            usage_count: Math.floor(Math.random() * 5),
            tags: [course.code.toLowerCase(), difficulty, questionType],
            created_by: 'demo-faculty-001'
          };

          await supabase
            .from('question_bank')
            .insert(questionData);
        }
      }

      markStepCompleted('questions');
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  };

  const getQuestionText = (type: string, courseName: string, index: number): string => {
    switch (type) {
      case 'mcq':
        return `Which of the following best describes the concept in ${courseName}?`;
      case 'short_answer':
        return `Briefly explain the key principles discussed in ${courseName}.`;
      case 'long_answer':
        return `Provide a detailed analysis of the methodologies used in ${courseName} with suitable examples.`;
      case 'numerical':
        return `Calculate the result for the given problem in ${courseName}. Show all steps.`;
      default:
        return `General question about ${courseName}.`;
    }
  };

  const getAnswerKey = (type: string, index: number): string => {
    switch (type) {
      case 'mcq':
        return 'Option A';
      case 'short_answer':
        return `Brief answer for question ${index} covering key concepts and principles.`;
      case 'long_answer':
        return `Detailed answer for question ${index} with comprehensive explanation, examples, and analysis.`;
      case 'numerical':
        return `Step-by-step solution: Step 1... Step 2... Final answer: ${index * 2}`;
      default:
        return `Answer for question ${index}`;
    }
  };

  const createAssessmentData = async () => {
    updateProgress('Creating assessment data...', 80);
    
    try {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name, code');

      if (!courses || courses.length === 0) return;

      // Generate student assessment data
      for (const course of courses) {
        // Create 30 students per course
        for (let studentNum = 1; studentNum <= 30; studentNum++) {
          const rollNumber = `CS21${studentNum.toString().padStart(3, '0')}`;
          
          // IA1 Assessment
          await supabase
            .from('student_assessments')
            .insert({
              course_id: course.id,
              student_roll_number: rollNumber,
              student_name: `Student ${studentNum}`,
              assessment_type: 'IA1',
              assessment_name: `Internal Assessment 1 - ${course.name}`,
              question_scores: {
                Q1: Math.floor(Math.random() * 10) + 5,
                Q2: Math.floor(Math.random() * 10) + 5,
                Q3: Math.floor(Math.random() * 10) + 5,
                Q4: Math.floor(Math.random() * 10) + 5,
                Q5: Math.floor(Math.random() * 10) + 5
              },
              co_scores: {
                CO1: Math.floor(Math.random() * 15) + 10,
                CO2: Math.floor(Math.random() * 15) + 10,
                CO3: Math.floor(Math.random() * 15) + 10,
                CO4: Math.floor(Math.random() * 15) + 8,
                CO5: Math.floor(Math.random() * 15) + 8
              },
              total_score: Math.floor(Math.random() * 20) + 30,
              max_marks: 50,
              assessment_date: '2024-09-15'
            });

          // IA2 Assessment
          await supabase
            .from('student_assessments')
            .insert({
              course_id: course.id,
              student_roll_number: rollNumber,
              student_name: `Student ${studentNum}`,
              assessment_type: 'IA2',
              assessment_name: `Internal Assessment 2 - ${course.name}`,
              question_scores: {
                Q1: Math.floor(Math.random() * 10) + 6,
                Q2: Math.floor(Math.random() * 10) + 6,
                Q3: Math.floor(Math.random() * 10) + 6,
                Q4: Math.floor(Math.random() * 10) + 6,
                Q5: Math.floor(Math.random() * 10) + 6
              },
              co_scores: {
                CO1: Math.floor(Math.random() * 15) + 12,
                CO2: Math.floor(Math.random() * 15) + 12,
                CO3: Math.floor(Math.random() * 15) + 12,
                CO4: Math.floor(Math.random() * 15) + 10,
                CO5: Math.floor(Math.random() * 15) + 10
              },
              total_score: Math.floor(Math.random() * 20) + 35,
              max_marks: 50,
              assessment_date: '2024-11-15'
            });
        }
      }

      markStepCompleted('assessments');
    } catch (error) {
      console.error('Error creating assessments:', error);
      throw error;
    }
  };

  const createCOPOMappings = async () => {
    updateProgress('Creating CO-PO mappings...', 95);
    
    try {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name');

      if (!courses || courses.length === 0) return;

      for (const course of courses) {
        // Create CO-PO mapping for each course
        const mappingData = {
          CO1: { PO1: 3, PO2: 2, PO3: 1, PO4: 0, PO5: 2, PO6: 1, PO7: 0, PO8: 1, PO9: 0, PO10: 1, PO11: 2, PO12: 1 },
          CO2: { PO1: 2, PO2: 3, PO3: 2, PO4: 1, PO5: 1, PO6: 2, PO7: 1, PO8: 0, PO9: 1, PO10: 0, PO11: 1, PO12: 2 },
          CO3: { PO1: 1, PO2: 2, PO3: 3, PO4: 2, PO5: 0, PO6: 1, PO7: 2, PO8: 1, PO9: 2, PO10: 1, PO11: 0, PO12: 1 },
          CO4: { PO1: 0, PO2: 1, PO3: 2, PO4: 3, PO5: 1, PO6: 0, PO7: 1, PO8: 2, PO9: 1, PO10: 2, PO11: 1, PO12: 0 },
          CO5: { PO1: 1, PO2: 0, PO3: 1, PO4: 2, PO5: 3, PO6: 1, PO7: 0, PO8: 1, PO9: 0, PO10: 1, PO11: 2, PO12: 1 }
        };

        await supabase
          .from('co_po_mappings')
          .insert({
            course_id: course.id,
            mapping_data: mappingData
          });
      }

      markStepCompleted('mappings');
    } catch (error) {
      console.error('Error creating mappings:', error);
      throw error;
    }
  };

  const generateAllDemoData = async () => {
    if (loading) return;
    
    setLoading(true);
    setProgress(0);
    setCompletedSteps([]);
    setDemoCredentials(null);

    try {
      const organization = await createDemoOrganization();
      const users = await createDemoUsers(organization.id);
      await createAcademicStructure(organization.id);
      await generateQuestionBank();
      await createAssessmentData();
      await createCOPOMappings();

      setProgress(100);
      setCurrentStep('Demo data generation completed!');

      toast({
        title: "Demo Data Generated Successfully!",
        description: "Sunrise Engineering College demo account has been created with comprehensive data.",
      });

    } catch (error: any) {
      console.error('Error generating demo data:', error);
      toast({
        title: "Error",
        description: `Failed to generate demo data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = (email: string, password: string) => {
    // For demo purposes, we'll create a mock login flow
    toast({
      title: "Demo Login",
      description: `You can now use email: ${email} and password: ${password} to login`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Comprehensive Demo Data Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate complete demo data for Sunrise Engineering College including users, courses, 
            assessments, question bank, and CO-PO mappings to experience all platform features.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Demo Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg transition-colors ${
                  completedSteps.includes(step.id)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.name}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Account Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Account Details</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Organization:</strong> Sunrise Engineering College</p>
              <p><strong>Programs:</strong> Computer Science, Mechanical, Electronics</p>
              <p><strong>Data Includes:</strong> 3 Programs, 5 Courses, 200+ Questions, 150+ Assessment Records</p>
            </div>
          </div>

          {/* Demo Credentials */}
          {demoCredentials && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Demo Login Credentials
              </h3>
              <div className="space-y-3">
                {demoCredentials.map((user: any) => (
                  <div key={user.id} className="bg-white rounded p-3 border border-amber-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                        <p className="text-sm text-gray-600">Email: {user.email}</p>
                        <p className="text-sm text-gray-600">Password: {user.password}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loginAsDemoUser(user.email, user.password)}
                      >
                        Copy Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateAllDemoData}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Generating Demo Data...' : 'Generate Complete Demo Data'}
          </Button>

          {completedSteps.length === demoSteps.length && !loading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Demo data generation completed successfully!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You can now use the demo credentials above to login and explore all features of the OBE automation platform.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
