import { apiSlice } from "./apiSlice";

export interface Program {
  id?: string;
  code: string;
  name: string;
  description: string;
  duration_years: number;
  total_semesters: number;
  program_type: string;
  status: string;
  organization_id: string;
}

type GetProgramsParams = { subjectIds?: string; programIds?: string } | void;

// Inject endpoints into the base API slice
export const programManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<Program[], { subjectIds?: string; programIds?: string } | void>({
      query: (params) => {
        if (!params) return "/programs";

        const queryParams = new URLSearchParams();
        if (params.subjectIds) queryParams.append("subjectIds", params.subjectIds);
        if (params.programIds) queryParams.append("programIds", params.programIds);

        return `/programs?${queryParams.toString()}`;
      },
    }),
    // getPrograms: builder.query<Program[], string | void>({
    //   query: (subjectIds) => (subjectIds ? `/programs?subjectIds=${subjectIds}` : "/programs"),
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ id }) => ({ type: "Program" as const, id })),
    //           { type: "Program", id: "LIST" },
    //         ]
    //       : [{ type: "Program", id: "LIST" }],
    // }),

    // Get single program by ID
    getProgram: builder.query<Program, string>({
      query: (id) => `/programs/${id}`,
      providesTags: (result, error, id) => [{ type: "Program", id }],
    }),

    // Create new program
    createCompleteProgram: builder.mutation<
      Program,
      {
        organizationId: string;
        code: string;
        name: string;
        description: string;
        durationYears: number;
        totalSemesters: number;
        programType: string;
        status: string;
        academic_year_id?: number;
      }
    >({
      query: ({
        organizationId,
        code,
        name,
        description,
        durationYears,
        totalSemesters,
        programType,
        status,
        academic_year_id,
      }) => {
        const programWithOrg = {
          organization_id: organizationId,
          code,
          name,
          description,
          duration_years: durationYears,
          total_semesters: totalSemesters,
          program_type: programType,
          status,
          academic_year_id,
        };

        return {
          url: "/programs",
          method: "POST",
          body: programWithOrg,
        };
      },
      invalidatesTags: [{ type: "Program", id: "LIST" }],
    }),

    // Update existing program
    updateProgram: builder.mutation<Program, { id: string; changes: Partial<Program> }>({
      query: ({ id, changes }) => ({
        url: `/programs/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Program", id }],
    }),

    // Delete program
    deleteProgram: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Program", id }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetProgramsQuery,
  useGetProgramQuery,
  useCreateCompleteProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programManagementApi;
