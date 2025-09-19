import { ExamPayload, ExamReponse } from "@/types/admin/exams";
import { apiSlice } from "../apiSlice";

// --- Added types for student filtering and payloads ---
// (Removed standalone fetch helpers; using RTK Query getTargetedStudents endpoint)

export interface CreateExamPayload extends ExamPayload {
  studentsIds: number[];
  yearId: number;
  semId: number;
  programId: number;
  section: string;
  shiftId: number;
}

export type UpdateExamPayload = Partial<CreateExamPayload>;

// Minimal payload for targeted students API
export interface TargetStudentsParams {
  year: number;
  semester: number;
  programId: number;
  shiftId: number;
  section: string;
}

export const adminExamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/admin/exams
    createAdminExam: builder.mutation<void, CreateExamPayload>({
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
    updateAdminExam: builder.mutation<void, { id: number; data: UpdateExamPayload }>({
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
    getAvailableQuestions: builder.query<{ count: number }, ExamPayload>({
      query: (payload) => ({
        url: `/admin/exams/available`,
        method: "POST",
        body: payload,
      }),
    }),

    getTargetedStudents: builder.query<any, TargetStudentsParams>({
      query: (payload) => ({
        url: `/admin/exams/targeted-students`,
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

  /** hooks for targeted students */
  useGetTargetedStudentsQuery,
  useLazyGetTargetedStudentsQuery,
} = adminExamsApi;
