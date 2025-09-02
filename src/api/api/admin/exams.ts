import { ExamPayload, ExamReponse } from "@/types/admin/exams";
import { apiSlice } from "../apiSlice";

export const adminExamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/admin/exams
    createAdminExam: builder.mutation<void, ExamPayload>({
      query: (payload) => ({
        url: `/admin/exams`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Exams"],
    }),

    // GET /api/admin/exams
    getAdminExams: builder.query<ExamReponse[], { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `/admin/exams/${userId}?role=${role}`,
      }),
      providesTags: ["Exams"],
    }),

    // GET /api/admin/exams/:id
    getAdminExamById: builder.query<ExamPayload, number>({
      query: (id) => `/admin/exams/single-exam/${id}`,
      providesTags: (result, error, id) => [{ type: "Exams", id }],
    }),

    // PATCH /api/admin/exams/:id
    updateAdminExam: builder.mutation<void, { id: number; data: Partial<ExamPayload> }>({
      query: ({ id, data }) => ({
        url: `/admin/exams/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Exams", id }],
    }),

    // DELETE /api/admin/exams/:id
    deleteAdminExam: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Exams", id }],
    }),

    /** ✅ Available Questions (POST with full payload) */
    getAvailableQuestions: builder.query<number, ExamPayload>({
      query: (payload) => ({
        url: `/admin/exams/available`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAdminExamMutation,
  useGetAdminExamsQuery,
  useGetAdminExamByIdQuery,
  useUpdateAdminExamMutation,
  useDeleteAdminExamMutation,

  /** hooks for available questions */
  useGetAvailableQuestionsQuery,
  useLazyGetAvailableQuestionsQuery,
} = adminExamsApi;
