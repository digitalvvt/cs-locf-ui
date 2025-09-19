import { ExamReponse } from "@/types/admin/exams";
import { apiSlice } from "../apiSlice";

export type ExamSummaryPayload = {
  page: number;
  limit: number;
  filter: number;
  search: string;
};

export type AnalyticResponse = {
  totalStudents: number;
  totalExams: number;
  totalFaculty: number;
  totalCompletedStudents: number;
  programsCount: number;
  subjectsCount: number;
  chaptersCount: number;
  topicsCount: number;
  totalQuestions: number;
};

export type ExamSummaryResponse = {
  items: any[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages?: number;
};

const adminDashboardAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticResponse, void>({
      query: () => "/admin/dashboard/analytics",
    }),
    getExamSummary: builder.mutation<ExamSummaryResponse, ExamSummaryPayload>({
      query: (payload) => ({
        url: "/admin/dashboard/exam-summary",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetExamSummaryMutation } = adminDashboardAPI;
