// src/app/questions/index.tsx
import { useMemo, useState } from "react";
import QuestionList from "./QuestionList";
import {
  useGetAllQuestionsQuery,
  useGetQuestionFilterDataQuery,
  type GetQuestionsParams,
} from "@/api/api/question-bank-api";

const Questions = () => {
  const subjectIdsString =
    typeof window !== "undefined" ? localStorage.getItem("subjectIds") : null;

  const userDetailsString =
    typeof window !== "undefined" ? localStorage.getItem("userDetails") : null;

  const userId = userDetailsString ? JSON.parse(userDetailsString)?.id : undefined;

  // pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // last applied filters (undefined initially => skip query)
  const [appliedParams, setAppliedParams] = useState<GetQuestionsParams | undefined>(undefined);

  // fetch filters data (courses/chapters/types/etc.)
  const { data: questionFilter } = useGetQuestionFilterDataQuery();

  // server-side questions
  const { data, isFetching, isLoading, error, refetch } = useGetAllQuestionsQuery(
    appliedParams ?? ({} as GetQuestionsParams),
    { skip: !appliedParams }
  );

  const totalItems = data?.total ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit ?? limit))),
    [data?.total, data?.limit, limit]
  );

  // Apply callback from child (builds and locks params + resets page)
  const handleApply = (filters: Partial<GetQuestionsParams>) => {
    const base: GetQuestionsParams = {
      subjectIds: subjectIdsString || undefined,
      userId,
      page: 1,
      limit,
      ...filters,
    };

    setPage(1);
    setAppliedParams(base);
  };

  const handlePageChange = (newPage: number) => {
    if (!appliedParams) return;
    setPage(newPage);
    setAppliedParams({ ...appliedParams, page: newPage });
  };

  const handlePerPageChange = (newLimit: number) => {
    if (!appliedParams) return;
    setLimit(newLimit);
    setPage(1);
    setAppliedParams({ ...appliedParams, page: 1, limit: newLimit });
  };

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Failed to load questions. Please try again.
      </div>
    );
  }

  return (
    <div>
      <QuestionList
        // mode defaults to "server"
        questionsData={data?.data ?? []}
        totalItems={totalItems}
        page={appliedParams ? page : 1}
        limit={appliedParams ? data?.limit ?? limit : limit}
        totalPages={appliedParams ? totalPages : 1}
        // loading flags
        isLoading={isLoading}
        isFetching={isFetching}
        // filters data
        filterData={questionFilter}
        // actions
        onApply={handleApply}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        // whether query is "armed"
        hasApplied={!!appliedParams}
        refetch={refetch}
      />
    </div>
  );
};

export default Questions;
