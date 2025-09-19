import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TickCorrectGreen from "@/components/icons/TickCorrectGreen";
import WrongRedCircle from "@/components/icons/WrongRedCircle";
import { EXAM_DIFFICULTY_LEVEL } from "@/types/exam";
import { convertTimeToMinsOrSec, getTimeExtension } from "@/utils";
import AnalysisMarkdown from "@/components/ui/AnalysisMarkdown";

export interface IQuestions {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectShortUrl: string;
  chapterId: number;
  classId: number;
  chapterName: string;
  chapterShortUrl: string;
  weightage: number;
  topicId: number;
  topicName: string;
  topicShortUrl: string;
  question: string;
  qst_img: null;
  difficulty: number;
  options: {
    optionId: string;
    optionKey: string;
    option: string;
    optionImg: string;
  }[];
  correctOpt: string;
  answerDescImg: string | null;
  questionType: number;
  answerDesc: string;
  keywords: string;
  title: string;
  estimatedTime: number;
  answerStatus: "correct" | "wrong" | "left";
  timeTaken: number;
  selectedAns: string | null;
}

// Utility function for difficulty styling
const difficultyColor = (level: number) => {
  if (level === EXAM_DIFFICULTY_LEVEL.EASY) return "bg-green-100 text-green-700";
  if (level === EXAM_DIFFICULTY_LEVEL.MEDIUM) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};
const difficultyLevel = (level: number) => {
  if (level === EXAM_DIFFICULTY_LEVEL.EASY) return "Easy";
  if (level === EXAM_DIFFICULTY_LEVEL.MEDIUM) return "Medium";
  return "Hard";
};

// Question Accordion Component
const QuestionAccordion = ({ question, index }: { question: IQuestions; index: number }) => (
  <AccordionItem
    value={`${question.id}`}
    className={`border rounded-lg mb-4 ${
      question.answerStatus === "correct"
        ? "border-[#248A3D80] dark:border-[#1df92673]"
        : question.answerStatus === "wrong"
        ? "border-[#FF3B3080] dark:border-[#ff0a5dc7]"
        : "border-[#f1e777]"
    }`}
  >
    <AccordionTrigger className="flex hover:no-underline items-center justify-between px-6 py-4 bg-white dark:bg-[#000] rounded-lg shadow-sm">
      <div className="block">
        <h4 className="flex items-center  text-left text-[18px] mb-[8px] font-semibold text-[#101010] dark:text-[#fff]">
          Q{index + 1}{" "}
          <span className="ms-2">
            {question.answerStatus === "correct" ? (
              <TickCorrectGreen />
            ) : question.answerStatus === "wrong" ? (
              <WrongRedCircle />
            ) : (
              <></>
            )}
          </span>
        </h4>
        <p className="text-sm text-start text-[#101010]/[80%] dark:text-[#fff]/[80%] text-[16px]">
          {question.subjectName} - {question.topicName}
        </p>
      </div>
      <div className="flex flex-col items-end ms-auto me-[10px]">
        <p
          className={`px-[8px] py-[6px] rounded-[4px] mb-[8px] font-medium text-[12px] min-w-[60px] ${difficultyColor(
            question.difficulty
          )}`}
        >
          {difficultyLevel(question.difficulty)}
        </p>
        <p className="text-sm text-[#101010]/[80%] dark:text-[#fff]/[80%]">
          {convertTimeToMinsOrSec(question.timeTaken) || "-"}{" "}
          {getTimeExtension(question.timeTaken) || ""}
        </p>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-6 py-4 bg-[#fff] dark:bg-[#0a0a0a]">
      <p className="text-sm font-medium text-[#101010] dark:text-[#fff] mb-4">
        <AnalysisMarkdown content={question.question} />
      </p>
      <div className="space-y-2">
        {Object.entries(question.options).map(([optionKey, optionText], idx) => {
          const isCorrect = String(idx + 1) === question.correctOpt; // index 0 → "1", 1 → "2", etc.
          const isSelected = String(idx + 1) === question.selectedAns;

          let optionClass = "bg-gray-100 border-gray-300"; // default

          if (question.answerStatus === "correct" && isCorrect) {
            optionClass = "bg-green-100 border-green-400";
          } else if (question.answerStatus === "wrong") {
            if (isCorrect) optionClass = "bg-green-100 border-green-400";
            else if (isSelected) optionClass = "bg-red-100 border-red-400";
          } else if (question.answerStatus === "left" && isCorrect) {
            optionClass = "bg-green-100 border-green-400";
          }

          return (
            <div
              key={optionKey}
              className={`p-3 flex items-center rounded-md border ${optionClass}`}
            >
              <span className="font-semibold me-2">{optionKey}:</span>
              <p className="text-[14px] text-[#101010]/80">
                <AnalysisMarkdown content={optionText} />
              </p>
            </div>
          );
        })}
      </div>
      <div className="bg-[#D1DDF74D]/[30%] dark:bg-[#DDE7FA] lg:p-[16px] p-[14px] rounded-[10px] my-4">
        <h4 className="font-semibold text-[#101010] dark:text-[#101010] lg:text-[18px] text-[16px] lg:mb-[13px] mb-[10px]">
          Explanation
        </h4>
        <p className="text-sm text-gray-600  dark:text-[#101010]/[]">
          <AnalysisMarkdown content={question.answerDesc} />
        </p>
      </div>
    </AccordionContent>
  </AccordionItem>
);

// Main Component
const QuestionsTabsAccordiun = ({ questions }: { questions: IQuestions[] }) => {
  const filterQuestions = (filter: string) => {
    if (filter === "All") return questions;
    if (filter === "Correct") return questions.filter((q) => q.answerStatus === "correct");
    if (filter === "Incorrect") return questions.filter((q) => q.answerStatus === "wrong");
    if (filter === "Left") return questions.filter((q) => q.answerStatus === "left");
    // Subject filters are commented out for now
    // return questions.filter((q) => q.subjectName.toLowerCase().includes(filter.toLowerCase()));
    return questions;
  };

  // Only show these tabs; preserve subject tabs for future
  const tabs = [
    "All",
    "Correct",
    "Incorrect",
    "Left",
    // "Physics",
    // "Chemistry",
    // "Botany",
    // "Zoology",
  ];

  return (
    <div className="w-full mx-auto mb-[41px]">
      <Tabs defaultValue="all" className="w-full ">
        {/* Tabs */}
        <TabsList className="flex justify-start mx-[5px] mb-4 border-0 bg-white dark:bg-[#0a0a0a]">
          {tabs.map((filter) => (
            <TabsTrigger
              key={filter}
              value={filter.toLowerCase()}
              className="lg:px-4 lg:py-2 p-1 me-2 lg:text-sm text-[12px] font-medium text-[#101010] dark:text-[#fff]/[70%] rounded-[8px] border border-transparent hover:border-gray-400 hover:text-gray-900 focus-visible:outline-none data-[state=active]:border-blue-500 data-[state=active]:text-[#000] dark:data-[state=active]:text-[#fff] data-[state=active]:bg-[#D1DDF740]/[20%] dark:data-[state=active]:bg-[#171717]/[50%]"
            >
              {filter}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((filter) => (
          <TabsContent
            key={filter}
            value={filter.toLowerCase()}
            className="!max-h-[500px] overflow-y-auto scrollbar-thin"
          >
            <Accordion
              type="single"
              collapsible
              className="!h-[500] overflow-y-auto scrollbar-thin"
            >
              {filterQuestions(filter).map((q, index) => (
                <QuestionAccordion key={q.id} question={q} index={index} />
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default QuestionsTabsAccordiun;
