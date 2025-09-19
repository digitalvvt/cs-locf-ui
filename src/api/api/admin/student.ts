import { apiSlice } from "../apiSlice";

export const adminStudentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStudentsByExamId: builder.query({
      query: (id: string) => `/admin/exams/exam-status/${id}`,
      providesTags: ["Student"],
    }),
  }),
});

export const { useGetAllStudentsByExamIdQuery } = adminStudentApi;
