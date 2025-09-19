import { apiSlice } from "./apiSlice";

export interface IProgramOutComes {
  id: number;
  program_id: number;
  code: string;
  description: string;
}
export interface ICourse {
  id: number;
  courseId: number;
  program_id: number;
  organization_id: string;
  name: string;
  code: string;
  description: string | null;
  credits: number;
  semesters: string | null;
  course_type: string;
  syllabus_file_url: string;
  created_at: string; // or Date if you parse it
  updated_at: string; // or Date if you parse it
}
export type ICourseOutComes = {
  id: number;
  program_id: number;
  organization_id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  chapterName: string;
  course_type: "core" | "elective" | "lab"; // enum from your Prisma model
  syllabus_file_url: string;
  created_at: string; // or Date if you parse it
  updated_at: string; // or Date if you parse it,
  topicNames: string;
  subjectName: string;
};
export interface ICoPoMapping {
  id: number;
  course_id: number;
  co_label: string;
  po_label: string;
  value: number;
  justification: string | null;
  program_outcome_description: string;
  course_outcome_content: string;
}
export interface SyllabusExtractedData {
  processing_results: ProcessingResults;
}

export interface IExtractedPdf {
  id: number;
  program_id: number;
  content: string;
  clean_content: string;
}

export interface ProcessingResults {
  note: string;
  year: number;
  units: Unit[];
  course: Course;
  program: string;
  semester: number;
  textbooks: Book[];
  university: string;
  courseTitle: string;
  total_hours: number;
  prerequisites: string[];
  web_resources: string[];
  course_outcomes: Outcome[];
  reference_books: Book[];
  subject_details: SubjectDetails;
  learning_objectives: Outcome[];
  syllabus_effective_from: string;
  theory_vs_problems_ratio: Ratio;
  mapping_with_programme_outcomes: MappingWithProgramOutcomes;
}

export interface Unit {
  title: string;
  content: string;
  unit_number: number;
  hours_allocated: number;
}

export interface Course {
  type: string;
  title: string;
  common_to: string;
}

export interface Book {
  title: string;
  author: string;
  publisher: string;
  volume?: string;
}

export interface Outcome {
  LO?: string;
  CO?: string;
  description: string;
}

export interface SubjectDetails {
  L: number;
  P: number;
  S: number;
  T: number;
  marks: {
    CIA: number;
    external: number;
    total: number;
  };
  credits: number;
  subject_code: string;
  instruction_hours: number;
}

export interface Ratio {
  theory: string;
  problems: string;
}

export interface MappingWithProgramOutcomes {
  [CO: string]: {
    [key: string]: number;
  };
}
// Inject endpoints into the base API slice
export const programManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProgramsList: builder.query<IProgramOutComes[], void>({
      query: () => "/programs",
    }),

    getProgramOutComesById: builder.query<IProgramOutComes[], string>({
      query: (programId) => `/program-outcomes/program/${programId}`,
      providesTags: (result, error, id) => [{ type: "Program", id }],
    }),
    createProgramOutcome: builder.mutation<
      IProgramOutComes,
      { program_id: number; code: string; description: string }
    >({
      query: (newOutcome) => ({
        url: "/program-outcomes",
        method: "POST",
        body: newOutcome,
      }),
      invalidatesTags: [{ type: "Program", id: "LIST" }],
    }),
    // getCoursesByProgramId: builder.query<ICourse[], string>({
    //   query: (programId) => `/syllabus/course/${programId}`,
    //   providesTags: (result, error, id) => [{ type: "Course", id }],
    // }),
    getCoursesByProgramId: builder.query<ICourse[], { programId: string; subjectIds?: string }>({
      query: ({ programId, subjectIds }) => {
        let url = `/syllabus/course/${programId}`;
        if (subjectIds) {
          url += `?subjectIds=${subjectIds}`;
        }
        return url;
      },
      providesTags: (result, error, { programId }) => [{ type: "Course", id: programId }],
    }),
    getOutComesbyCourseId: builder.query<ICourseOutComes[], string>({
      query: (courseId) => `/syllabus/course-outcomes/${courseId}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    getCopoMappingbyCourseId: builder.query<ICoPoMapping[], string>({
      query: (courseId) => `/syllabus/co-po-mappings/${courseId}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    getSyllabusExtractedDataByProgramId: builder.query<SyllabusExtractedData, string>({
      query: (fileId) => `/syllabus/processing-results/${fileId}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    getPdfExtractedDataByProgramId: builder.query<IExtractedPdf, string>({
      query: (programId) => `/program-outcomes/extracted-pdf/${programId}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgramsListQuery,
  useGetProgramOutComesByIdQuery,
  useCreateProgramOutcomeMutation,
  useGetCoursesByProgramIdQuery,
  useGetOutComesbyCourseIdQuery,
  useGetCopoMappingbyCourseIdQuery,
  useGetSyllabusExtractedDataByProgramIdQuery,
  useGetPdfExtractedDataByProgramIdQuery,
} = programManagementApi;
