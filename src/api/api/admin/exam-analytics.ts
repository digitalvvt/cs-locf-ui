import { ExamPayload, ExamReponse } from "@/types/admin/exams";
import { apiSlice } from "../apiSlice";
import { SingleExamAnalysis } from "@/types/admin/exam-analytics";

export const adminExamsAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminExamsAnalytics: builder.query<SingleExamAnalysis, string>({
      query: (examId) => ({
        url: `/admin/exams/overall-result/${examId}`,
      }),
      providesTags: ["Exams"],
    }),
    getProgramAndSections: builder.query<any, { subjectIds?: string; programIds?: string } | void>({
      query: (args) => {
        if (!args) return { url: `/admin/exams/program-and-sections` };

        const { subjectIds, programIds } = args;
        const params: Record<string, string> = {};
        if (subjectIds) params.subjectIds = subjectIds;
        if (programIds) params.programIds = programIds;

        return {
          url: `/admin/exams/program-and-sections`,
          params,
        };
      },
      providesTags: ["Exams"],
    }),
    getOverallSectionWiseResult: builder.query<
      any,
      {
        programId: number;
        year: number;
        semester: number;
        section: number;
      }
    >({
      query: ({ programId, year, semester, section }) => ({
        url: `/admin/exams/overall-result/section-wise`,
        params: { programId, year, semester, section },
      }),
      providesTags: ["Exams"],
    }),
  }),
});

export const {
  useGetAdminExamsAnalyticsQuery,
  useGetProgramAndSectionsQuery,
  useGetOverallSectionWiseResultQuery, // regular
  useLazyGetOverallSectionWiseResultQuery, // ✅ ADD THIS FOR MANUAL CALL
} = adminExamsAnalyticsApi;
