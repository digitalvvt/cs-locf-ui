// src/features/questionBank/api.ts
import { Question } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** ========= Entity Types ========= */
export interface ISingleQuestion {
  s_no: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_opt: string; // keep as string if API returns like "3"
  answer_desc: string;
  difficulty: number;
  question_type: number;
  cognitive_level: number;
  estimated_time: number;
  co_id: number;
}

export type ReplaceQuestionRequest = {
  examId: number;
  currentQuestionSNo: number; // s_no of the question being replaced
  course_id?: number;
  question_typeId?: number;
  co_outcomeId?: number;
  programId?: number;
  chapterId?: number;
  topicId?: number;
};

export interface ReplaceQuestionResponse {
  success: boolean;
  message?: string;
  // // you can shape this to your API response
  // newQuestion?: Question;
}

export interface FilterData {
  programs: Program[];
  courses: Course[];
  questionTypes: QuestionType[];
  cognitiveLevel: CognitiveLevel[];
  courseOutCome: CourseOutcome[];
  chapters: Chapters[];
  topics: Topics[];
}

export interface Topics {
  id: number;
  t_name: string;
  c_id: number;
  p_id: number;
}
export interface Chapters {
  id: number;
  c_name: string;
  s_id: number;
}
export interface Program {
  id: number;
  code: string;
  name: string;
}

export interface Course {
  id: number;
  course_name_id: number;
  program_id: number;
  subjects: Subject;
}

export interface Subject {
  id: number;
  s_name: string;
  program_id: number;
}

export interface QuestionType {
  s_no: number;
  question_type: string;
}

export interface CognitiveLevel {
  s_no: number;
  title: string;
}

export interface CourseOutcome {
  id: number;
  course_id: number;
  co_number: string;
  courses: {
    course_name_id: number;
    program_id: number;
  };
}

/** ========= Server-side Pagination Types ========= */
export type GetQuestionsParams = {
  // base scoping
  subjectIds?: string; // e.g. "1,2,3"
  userId?: number;

  // filters (optional – include only those your backend supports)
  programId?: number;
  courseId?: number; // subject id in your UI mapping
  chapterId?: number;
  topicId?: number;
  coId?: number; // course outcome id
  questionTypeId?: number;
  cognitiveLevelId?: number;

  // pagination (required for server-side)
  page: number; // 1-based
  limit: number; // page size
};

export type PaginatedQuestionsResponse = {
  data: Question[]; // current page slice
  total: number; // total matching rows
  page: number; // echoed current page
  limit: number; // echoed page size
};

/** ========= API ========= */
export const questionBankApi = createApi({
  reducerPath: "questionBankApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:3004/api/",
    baseUrl: "https://locf.vvtsolutions.in/api/",
  }),
  tagTypes: ["QuestionBank"],
  endpoints: (builder) => ({
    /**
     * SERVER-SIDE PAGINATION:
     * GET /q-bank?subjectIds=...&userId=...&page=1&limit=10&...
     * Returns: { data: Question[], total: number, page: number, limit: number }
     */
    getAllQuestions: builder.query<PaginatedQuestionsResponse, GetQuestionsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        return `/q-bank?${queryParams.toString()}`;
      },
      providesTags: ["QuestionBank"],
    }),

    /** Single question by id (unchanged) */
    getQuestionById: builder.query<ISingleQuestion, number>({
      query: (id) => `q-bank/${id}`,
      providesTags: (result, error, id) => [{ type: "QuestionBank", id }],
    }),

    /**
     * Batch questions (unchanged). Keep as-is; this is separate from paginated flow.
     * If you later paginate this too, mirror the pattern above.
     */
    getAllBatchQuestions: builder.query<
      Question[],
      { subjectIds?: string; userId?: number } | void
    >({
      query: (params) => {
        const { subjectIds, userId } = params || {};
        if (subjectIds && userId !== undefined) {
          return `/q-bank/questions-batch?subjectIds=${subjectIds}&userId=${userId}`;
        }
        return "/q-bank/questions-batch";
      },
      providesTags: ["QuestionBank"],
    }),

    /** Filters (programs/courses/types/levels/CO/chapters/topics) */
    getQuestionFilterData: builder.query<FilterData, void>({
      query: () => `filter/get-all-filter-data`,
      providesTags: () => [{ type: "QuestionBank", id: "LIST" }],
    }),

    /** Batch by UUID (unchanged) */
    getQuestionsBatchByUUID: builder.query<any, string>({
      query: (uuid: string) => `/q-bank/questions-batch/details?uuid=${uuid}`,
    }),

    /** Questions by exam ids (unchanged) */
    getQuestionsById: builder.query<any, string>({
      query: (id: string) => `/q-bank/exams-questions?examIds=${id}`,
    }),
    replaceExamQuestion: builder.mutation<ReplaceQuestionResponse, ReplaceQuestionRequest>({
      query: (body) => ({
        url: `/q-bank/exams-questions/replace`,
        method: "POST",
        body,
      }),
      // re-fetch that exam’s questions after replacement
      invalidatesTags: (res, err, body) => [{ type: "QuestionBank", id: `EXAM_${body.examId}` }],
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionFilterDataQuery,
  useGetAllBatchQuestionsQuery,
  useGetQuestionByIdQuery,
  useLazyGetQuestionByIdQuery,
  useGetQuestionsBatchByUUIDQuery,
  useGetQuestionsByIdQuery,
  useReplaceExamQuestionMutation,
} = questionBankApi;

export type {
  PaginatedQuestionsResponse as QBankPaginatedResponse,
  GetQuestionsParams as QBankQueryParams,
};
