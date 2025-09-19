import React, { useEffect, useState } from "react";
import { AIQuestionPanel, GeneratePayload } from "./AIQuestionPanel";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";
import { useParams } from "react-router-dom";
import QuestionsTable, { FilterOption } from "./AIGeneratedQuestionsTable";
import QuestionFormDialog from "./QuestionFomDialog";
import { ISingleQuestion, useLazyGetQuestionByIdQuery } from "@/api/api/question-bank-api";

type QuestionType = {
  s_no: number;
  question_type: string;
};

type CognitiveLevel = {
  s_no: number;
  title: string;
};

type CourseOutcome = {
  id: number;
  co_number: string;
};

export type Question = {
  s_no: number;
  question: string;
  difficulty: number;
  estimated_time: number;
  course_id: number;
  question_type: QuestionType;
  cognitive_level: CognitiveLevel;
  co_outcome: CourseOutcome;
};

const QuestionBank = () => {
  const userId = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")!).id
    : null;

  const { programId, courseId } = useParams();
  const { toast } = useToast();
  const [tableData, setTableData] = useState<Question[]>([]);
  const [generating, setGenerating] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ISingleQuestion | null>(null);
  const [triggerGetQuestionById, { isFetching }] = useLazyGetQuestionByIdQuery();

  const [questionTypes, setQuestionTypes] = useState<FilterOption[]>([]);
  const [difficulties, setDifficulties] = useState<FilterOption[]>([]);
  const [bloomsLevels, setBloomsLevels] = useState<FilterOption[]>([]);
  const [coLevels, setCoLevels] = useState<FilterOption[]>([]);

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

    const questionTypes: FilterOption[] = [
      { id: 0, name: "All" },
      ...getUniqueObjects(
        questions.map((q) => ({
          id: q.question_type.s_no,
          name: q.question_type.question_type,
        })),
        "id"
      ),
    ];

    const difficulties: FilterOption[] = [
      { id: 0, name: "All" },
      ...Array.from(new Set(questions.map((q) => q.difficulty)))
        .filter((d) => difficultyMap[d])
        .map((d) => ({
          id: d,
          name: difficultyMap[d],
        })),
    ];

    const bloomsLevels: FilterOption[] = [
      { id: 0, name: "All" },
      ...getUniqueObjects(
        questions.map((q) => ({
          id: q.cognitive_level.s_no,
          name: q.cognitive_level.title,
        })),
        "id"
      ),
    ];

    const coLevels: FilterOption[] = [
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

  const editQuestionHandler = async (questionId: number) => {
    setOpenModal(true);
    const result = await triggerGetQuestionById(questionId);
    if ("data" in result) {
      setSelectedQuestion(result.data); // ✅ store in state
    } else {
      toast({ title: "Error", description: "Failed to fetch question." });
    }
  };

  const intialRender = async () => {
    try {
      const getUrl = new URL(
        `https://locf.vvtsolutions.in/api/q-bank/${courseId}/${programId}/${userId}/questions`
      );

      // const getUrl = new URL(
      //   `http://localhost:3004/api/q-bank/${courseId}/${programId}/questions`
      // );

      const secondResponse = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!secondResponse.ok) throw new Error("Failed to fetch");

      const secondResult = await secondResponse.json();
      setTableData(secondResult);
      generateQuestionFilters(secondResult);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching data from the API.",
        variant: "destructive",
      });
    }
  };

  const generateQuestionHandler = async (payload: GeneratePayload) => {
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
        intialRender(); // Re-fetch the data after generating questions
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

  useEffect(() => {
    intialRender();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-3 bg-gray-100">
          <AIQuestionPanel onQuestionsGenerated={generateQuestionHandler} generating={generating} />
        </div>
        <div className="xl:col-span-9 p-4">
          {tableData.length === 0 ? (
            <p className="text-gray-600 text-lg">No data available</p>
          ) : (
            <QuestionsTable
              questions={tableData}
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
