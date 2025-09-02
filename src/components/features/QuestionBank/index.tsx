import React, { useEffect, useState } from "react";
import AIQuestionGenerator from "./AIQuestionGenerator";
import { GenericType, Question } from "@/types";
import QuestionsTable from "../CourseDetails/qBank/AIGeneratedQuestionsTable";
import {
  ISingleQuestion,
  useLazyGetQuestionByIdQuery,
  useGetAllQuestionsQuery,
} from "@/api/api/question-bank-api";
import { useToast } from "@/hooks/use-toast";
import QuestionFormDialog from "../CourseDetails/qBank/QuestionFomDialog";
import { GeneratePayload } from "../CourseDetails/qBank/AIQuestionPanel";

const QuestionBank = () => {
  const { data: questionsData, refetch, isLoading, error } = useGetAllQuestionsQuery();
  const { toast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Question[]>([]);
  const [questionTypes, setQuestionTypes] = useState<GenericType[]>([]);
  const [difficulties, setDifficulties] = useState<GenericType[]>([]);
  const [bloomsLevels, setBloomsLevels] = useState<GenericType[]>([]);
  const [coLevels, setCoLevels] = useState<GenericType[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<ISingleQuestion | null>(null);
  const [triggerGetQuestionById, { isFetching }] = useLazyGetQuestionByIdQuery();

  const generateQuestionFilters = (questions: Question[]) => {
    const getUniqueObjects = <T, K extends keyof T>(arr: T[], key: K) => {
      const map = new Map<number, T>();
      for (const item of arr) {
        const id = item[key] as unknown as number;
        if (!map.has(id)) {
          map.set(id, item);
        }
      }
      return Array.from(map.values());
    };

    const difficultyMap: Record<number, string> = {
      1: "Easy",
      2: "Medium",
      3: "Hard",
    };

    const questionTypes: GenericType[] = [
      { id: 0, name: "All" },
      ...getUniqueObjects(
        questions.map((q) => ({
          id: q.question_type.s_no,
          name: q.question_type.question_type,
        })),
        "id"
      ),
    ];

    const difficulties: GenericType[] = [
      { id: 0, name: "All" },
      ...Array.from(new Set(questions.map((q) => q.difficulty)))
        .filter((d) => difficultyMap[d])
        .map((d) => ({
          id: d,
          name: difficultyMap[d],
        })),
    ];

    const bloomsLevels: GenericType[] = [
      { id: 0, name: "All" },
      ...getUniqueObjects(
        questions.map((q) => ({
          id: q.cognitive_level.s_no,
          name: q.cognitive_level.title,
        })),
        "id"
      ),
    ];

    const coLevels: GenericType[] = [
      { id: 0, name: "All" },
      ...getUniqueObjects(
        questions.map((q) => ({
          id: q.co_outcome.id,
          name: q.co_outcome.co_number,
        })),
        "id"
      ),
    ];

    setQuestionTypes(questionTypes);
    setDifficulties(difficulties);
    setBloomsLevels(bloomsLevels);
    setCoLevels(coLevels);
  };

  const generateQuestionsHandler = async (payload: GeneratePayload) => {
    setGenerating(true);
    try {
      const response = await fetch("https://doubts.collegesuggest.com/locf/question_bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }

      const result = await response.json();

      if (result) {
        refetch(); // Re-fetch the data after generating questions
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending data to the API.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const editQuestionHandler = async (questionId: number) => {
    setOpenModal(true);
    const result = await triggerGetQuestionById(questionId);
    if ("data" in result) {
      setSelectedQuestion(result.data);
    } else {
      toast({ title: "Error", description: "Failed to fetch question.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (questionsData && questionsData.length > 0) {
      generateQuestionFilters(questionsData as Question[]);
    }
  }, [questionsData]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 bg-gray-100">
          <AIQuestionGenerator
            generating={generating}
            onGenerateQuestions={generateQuestionsHandler}
          />
        </div>
        <div className="lg:col-span-9">
          {questionsData && questionsData.length === 0 ? (
            <p className="text-gray-600 text-lg">No data available</p>
          ) : (
            <QuestionsTable
              questions={questionsData}
              onEditQuestion={editQuestionHandler}
              questionTypes={questionTypes}
              difficulties={difficulties}
              bloomsLevels={bloomsLevels}
              coLevels={coLevels}
            />
          )}
        </div>
      </div>
      <QuestionFormDialog
        isOpen={openModal}
        onOpenChange={setOpenModal}
        question={selectedQuestion}
        questionTypes={questionTypes}
        difficulties={difficulties}
        bloomsLevels={bloomsLevels}
        courseOutcomes={coLevels}
        // courseOutcomes={courseOutcomes || []}
        // onCreate={createQuestion.mutate}
        // onUpdate={updateQuestion.mutate}
        // isCreating={isCreating}
        // isUpdating={isUpdating}
      />
    </>
  );
};

export default QuestionBank;
