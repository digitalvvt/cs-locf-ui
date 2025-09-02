import React from "react";
import QuestionHistoryCard from "./QuestionHistoryCard";
import { useGetAllBatchQuestionsQuery, useGetAllQuestionsQuery } from "@/api/api/question-bank-api";
import { Loader2, LucideLoader } from "lucide-react";

const QuestionHistory = () => {
  const subjectIdsString = localStorage.getItem("subjectIds");
  const userDetailsString = localStorage.getItem("userDetails");
  const userId = userDetailsString ? JSON.parse(userDetailsString)?.id : undefined;


  const {
    data: questionsData,
    isLoading,
    error,
  } = useGetAllBatchQuestionsQuery(
    subjectIdsString && userId !== undefined ? { subjectIds: subjectIdsString, userId } : undefined
  );
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {isLoading ? (
  // Loading state
  <div className="flex items-center justify-center py-10 text-gray-600 dark:text-gray-300">
    <Loader2 className="animate-spin mr-2" />
    Loading Question Batches…
  </div>
) : questionsData?.length > 0 ? (
  // Data state
  <div className="grid grid-cols-1 gap-6">
    {questionsData.map((item, idx) => (
      <QuestionHistoryCard key={idx} index={idx} data={item} />
    ))}
  </div>
) : (
  // Empty state
  <div className="text-center text-gray-600 dark:text-gray-300 py-10">
    No Questions Batch Found
  </div>
)}

    </div>
  );
};

export default QuestionHistory;
