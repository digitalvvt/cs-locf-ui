// src/app/questions/QuestionBatchDetails.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetQuestionsBatchByUUIDQuery,
  useGetQuestionFilterDataQuery,
  useGetAllQuestionsQuery,
  type GetQuestionsParams,
} from "@/api/api/question-bank-api";
import QuestionList from "./QuestionList";
import { Alert } from "@/components/ui/alert";

const QuestionBatchDetails = () => {
  const { uuid } = useParams<{ uuid: string }>();

  // 1) Load the generated batch (initial static view)
  const {
    data: batchQuestions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useGetQuestionsBatchByUUIDQuery(uuid!);

  // Filters data (used in both modes)
  const {
    data: filterData,
    isLoading: isFilterLoading,
    error: filterError,
  } = useGetQuestionFilterDataQuery();

  // 2) Server-view state (enabled after Apply from static)
  const [isServerView, setIsServerView] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [appliedParams, setAppliedParams] = useState<GetQuestionsParams | undefined>(undefined);

  // read subjectIds / user from localStorage like main page
  const subjectIdsString =
    typeof window !== "undefined" ? localStorage.getItem("subjectIds") : null;

  const userDetailsString =
    typeof window !== "undefined" ? localStorage.getItem("userDetails") : null;

  const userId = userDetailsString ? JSON.parse(userDetailsString)?.id : undefined;

  // Server-side questions (active only after first Apply)
  const {
    data: serverData,
    isFetching,
    isLoading,
    error: serverError,
    refetch,
  } = useGetAllQuestionsQuery(appliedParams ?? ({} as GetQuestionsParams), {
    skip: !isServerView || !appliedParams,
  });

  const totalItems = serverData?.total ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((serverData?.total ?? 0) / (serverData?.limit ?? limit))),
    [serverData?.total, serverData?.limit, limit]
  );

  // Handle Apply from static mode → switch to server mode
  const handleApplyFromStatic = (filters: Partial<GetQuestionsParams>) => {
    const base: GetQuestionsParams = {
      subjectIds: subjectIdsString || undefined,
      userId,
      page: 1,
      limit,
      ...filters,
    };
    setPage(1);
    setAppliedParams(base);
    setIsServerView(true); // switch to server mode (shows pagination + server data)
  };

  // Server mode handlers
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

  // Initial loading or errors (batch or filters)
  if (!isServerView && (isQuestionsLoading || isFilterLoading)) {
    return <p>Loading questions...</p>;
  }

  if (!isServerView && (questionsError || filterError)) {
    return (
      <Alert variant="destructive" className="mt-10">
        Failed to load question batch details. Please try again.
      </Alert>
    );
  }

  // Server mode error
  if (isServerView && serverError) {
    return (
      <Alert variant="destructive" className="mt-10">
        Failed to load filtered questions. Please try again.
      </Alert>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {!isServerView ? (
        // Static view WITH filters visible; pagination hidden
        <QuestionList
          mode="static"
          showFiltersInStatic
          questionsData={batchQuestions ?? []}
          filterData={filterData}
          onApply={handleApplyFromStatic}
          isLoading={isQuestionsLoading || isFilterLoading}
        />
      ) : (
        // Server view AFTER Apply: full filters + pagination
        <QuestionList
          // server mode (default)
          questionsData={serverData?.data ?? []}
          filterData={filterData}
          page={page}
          limit={serverData?.limit ?? limit}
          totalPages={totalPages}
          totalItems={totalItems}
          isLoading={isLoading}
          isFetching={isFetching}
          onApply={(filters) => {
            // re-apply filters & reset page
            const base: GetQuestionsParams = {
              subjectIds: subjectIdsString || undefined,
              userId,
              page: 1,
              limit,
              ...filters,
            };
            setPage(1);
            setAppliedParams(base);
          }}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          hasApplied={!!appliedParams}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default QuestionBatchDetails;
