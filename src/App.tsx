import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider
import AppLayout from "@/components/Layout/AppLayout";
import Index from "./pages/index.tsx";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/auth/AuthProvider.tsx";
import Login from "./pages/Login.tsx";
import { UnifiedProgramManagement } from "./components/features/ProgramManagement/UnifiedProgramManagement.tsx";
import ProgramOutComes from "./components/features/programOutcomes/ProgramOutComes.tsx";
import CourseDetails from "./components/features/CourseDetails/CourseDetails.tsx";
import Dashboard from "./pages/index.tsx";
import MetaTags from "./components/MetaTags.tsx";
import QuestionBankPage from "./pages/QuestionBank.tsx";
import SyllabusReview from "./components/features/syllabus-extraction/SyllabusReview.tsx";
import AIQuestionGeneratorPage from "./pages/AIQuestionGenerator.tsx";
import QuestionHistoryPage from "./pages/QuestionHistory.tsx";
import Questions from "./components/features/generatedQuestions/page.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import QuestionBatchDetails from "./components/features/generatedQuestions/QuestionBatchDetails.tsx";
import FacultyExamsPage from "./pages/FacultyExams.tsx";
import StudentExam from "./pages/StudentExam.tsx";
import ExamPage from "./components/student/exam/index.tsx";
import ExamResult from "./components/student/exam/exam-result/index.tsx";
import FacultyExamAnalyticsPage from "./pages/FacultyExamAnalytics.tsx";
import Profile from "./pages/Profile.tsx";
import ClassWiseAnalysis from "./pages/ClassWiseAnalysis.tsx";
import DashboardPage from "./components/features/Dashboard/index.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  const userDetails =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails") || "{}") : {};
  const isAdmin = userDetails.role === "admin";

  return (
    <HelmetProvider>
      {" "}
      {/* Ensure this wraps your entire app */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MetaTags
          title="LOCF VVT SOLUTIONS"
          description="LOCF"
          ogTitle="LOCF VVT SOLUTIONS"
          ogDescription="Computer Science Learning Outcome and Curriculum Framework"
        />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<h1>world</h1>} />

              {/* Protected Routes */}
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={isAdmin ? <DashboardPage /> : <Dashboard />} />
                        <Route path="*" element={<ComingSoon />} />
                        {/* <Route path="*" element={<NotFound />} /> */}
                        {/* {isAdmin && <Route path="/dashboard" element={<DashboardPage />} />} */}
                        <Route path="/q-bank" element={<Questions />} />
                        <Route path="/q-bank/:uuid" element={<QuestionBatchDetails />} />
                        <Route path="/question-generator" element={<AIQuestionGeneratorPage />} />
                        <Route path="/question-history" element={<QuestionHistoryPage />} />
                        <Route path="admin/exams" element={<FacultyExamsPage />} />
                        <Route path="admin/class-analysis" element={<ClassWiseAnalysis />} />
                        <Route
                          path="admin/exams/analytics/:examId"
                          element={<FacultyExamAnalyticsPage />}
                        />

                        {/* student section */}
                        <Route path="/exams" element={<StudentExam />} />
                        <Route path="/exams/:id" element={<ExamPage />} />
                        <Route
                          path="/program-management"
                          element={<UnifiedProgramManagement organizationId="1" />}
                        />
                        <Route path="/exam/result/:uuid/:userId" element={<ExamResult />} />
                        <Route path="/program-outcomes/:programId" element={<ProgramOutComes />} />
                        <Route
                          path="program-outcomes/:programId/courses/:courseId"
                          element={<CourseDetails />}
                        />
                        <Route
                          path="/program-outcomes/extracted-syllabus/:fileId"
                          element={<SyllabusReview />}
                        />
                        {/* <Route path="/generated-questions" element={<Questions />} /> */}
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </AppLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
