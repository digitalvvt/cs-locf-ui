import { ExamReponse } from "@/types/admin/exams";
import { apiSlice } from "../apiSlice";

export interface Option {
  optionId: string;
  optionKey: string;
  option: string;
  optionImg: string;
}

export interface QuestionsResponse {
  s_no: number;
  user_id: number;
  uuid: string;
  stream: number;
  question: string;
  correct_opt: string;
  answer_desc: string;
  difficulty: number;
  question_type: number;
  t_id: number;
  s_id: number;
  c_id: number;
  p_id: number;
  course_id: number;
  co_id: number;
  cognitive_level: number;
  keywords: string;
  estimated_time: number;
  QC: string;
  reason: string | null;
  added_date: string; // or Date
  updated_date: string; // or Date
  model: string;
  model_id: number;
  options: Option[];
}

/** the envelope you’ll actually return */
export interface QuestionsPayload {
  exam_time: number;
  questions: QuestionsResponse[];
}

interface ApiResponse {
  uuid: string;
  lastQuestionId: number;
  answer?: string;
  mr?: string;
  remainingTime: number;
  correctAns: string;
  timeTaken?: number;
}

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentExamsList: builder.query<
      ExamReponse[],
      {
        org_id: number;
        p_id: number;
        semester: number;
        year: number;
        id: number;
        shiftId: number;
        section: string;
      }
    >({
      query: ({ org_id, p_id, semester, year, id, shiftId, section }) =>
        `/student/exams/by-student?org_id=${org_id}&p_id=${p_id}&semester=${semester}&year=${year}&userId=${id}&shiftId=${shiftId}&section=${section}`,
      providesTags: ["Exams"],
    }),

    getQuestionsByExamId: builder.query<
      QuestionsPayload, // replace with actual type
      { exam_id: number }
    >({
      query: ({ exam_id }) => `/student/questions?exam_id=${exam_id}`,
      providesTags: ["Questions"],
    }),
    saveStudentExamSession: builder.mutation<
      { success: boolean; message: string }, // ✅ adjust response type if needed
      { uuid: string; exam_id: number; student_id: number } // ✅ request body
    >({
      query: (body) => ({
        url: `/student/create-exam`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Exams"], // optional
    }),
    saveExamResponse: builder.mutation<
      { success: boolean; message: string }, // ✅ Response shape
      ApiResponse // ✅ Use your defined type here
    >({
      query: (body) => ({
        url: `/student/update-exam`,
        method: "POST",
        body,
      }),
    }),
    updateExamStatus: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/student/exam/update-status`,
        method: "POST",
        body: {
          uuid,
          status: "completed",
        },
      }),
    }),
    getExamResultByUUID: builder.query<
      { success: boolean; data: any }, // Replace `any` with your expected result structure
      { uuid: string; userId: number }
    >({
      query: ({ uuid, userId }) => `/student/exam-result?uuid=${uuid}&userId=${userId}`,
    }),
    clearExamSession: builder.mutation<{ success: boolean; message: string }, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/student/clear-session`,
        method: "POST",
        body: { uuid },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStudentExamsListQuery,
  useGetQuestionsByExamIdQuery,
  useSaveStudentExamSessionMutation,
  useSaveExamResponseMutation,
  useUpdateExamStatusMutation,
  useGetExamResultByUUIDQuery,
  useClearExamSessionMutation,
} = studentApi;
