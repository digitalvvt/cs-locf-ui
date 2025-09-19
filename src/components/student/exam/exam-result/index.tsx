import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import QuestionAnalysis, { IQuestionAnalysis } from "./QuestionAnalysis";
import OverAllScore, { ISummary } from "./OverallScore";
import { useNavigate, useParams } from "react-router-dom";
import { useGetExamResultByUUIDQuery } from "@/api/api/student/student-api";
import { Button } from "@/components/ui/button";
import QuestionsTabsAccordiun, { IQuestions } from "./QuestionTabsAccordion";
import ChapterCardAccordion, { IChapterwiseAnalysis } from "./ChapterAnalysisCard";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const ExamResult = () => {
  const role = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails") || "{}").role
    : "";

  const { uuid, userId } = useParams<{ uuid: string; userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetExamResultByUUIDQuery({
    uuid: uuid!,
    userId: Number(userId),
  });

  const [summary, setSummary] = useState<ISummary | null>(null);
  const [analysis, setAnalysis] = useState<IQuestionAnalysis | null>(null);
  const [questionsData, setQuestionsData] = useState<IQuestions[]>([]);
  const [chapterAnalysis, setChapterAnalysis] = useState<IChapterwiseAnalysis[]>([]);
  const [programName, setProgramName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");

  useEffect(() => {
    if (data?.success && data.data?.summaryData && data.data?.analysisData) {
      setSummary(data.data.summaryData);
      setAnalysis(data.data.analysisData);
      setQuestionsData(data.data.questionsData);
      setChapterAnalysis(data.data.chapterAnalysis);
      setProgramName(data.data.programName);
      setCourseName(data.data.courseName);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <p>Loading result...</p>;
  if (isError || !summary || !analysis) return <p>Failed to load result.</p>;

  return (
    <div className="container">
      <div className="mb-4">
        <Button
          variant="default"
          className="bg-black text-white hover:bg-gray-900"
          onClick={() => void (role === "student" ? navigate("/exams") : navigate(-1))}
        >
          {role === "student" ? "Back to Exams" : "Back"}
        </Button>
      </div>
      <div className="space-y-4">
        <Label className=" text-2xl">Overall Score</Label>
        <OverAllScore summary={summary} />
      </div>
      <div className="space-y-4 mt-4">
        <Label className=" text-2xl block">Chapter Analysis</Label>
        <Label className=" text-xl text-gray-500 block !mb-2 ">
          <span className="text-black">Program :</span> {programName}
        </Label>
        <Label className=" text-xl text-gray-500">
          {" "}
          <span className="text-black">Course : </span>
          {courseName}
        </Label>
        <div className={`${chapterAnalysis.length > 1 ? "h-[700px]" : "h-[300px]"}  overflow-auto`}>
          <Accordion type="single" collapsible className="mt-[10px]">
            {chapterAnalysis?.map((chapter, i) => (
              <ChapterCardAccordion key={i} data={chapter} />
            ))}
          </Accordion>
        </div>
      </div>
      <div className="space-y-4 mt-4">
        <Label className=" text-2xl">Question Analysis</Label>
        <QuestionAnalysis data={analysis} />
        <QuestionsTabsAccordiun questions={questionsData} />
      </div>
    </div>
  );
};

export default ExamResult;
