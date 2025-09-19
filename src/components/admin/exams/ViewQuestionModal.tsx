import { MainDialog } from "@/components/Common/MainDialog";
import MarkdownBotLatest from "@/components/MarkdownBotLatest";
import MarkdownForBot from "@/components/MarkdownForBot";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideLoaderCircle, Timer } from "lucide-react";
import React, { Fragment, useState } from "react";

interface ViewQuestionModalProps {
  open: boolean;
  onClose: () => void;
  questions: any;
  isLoading: boolean;
  examId: number;
  onReplace: (payload: {
    s_no?: number;
    course_id?: number;
    question_typeId?: number;
    co_outcomeId?: number;
    programId?: number;
    chapterId?: number;
    topicId?: number;
    examId: number;
  }) => void;
}

const ViewQuestionModal = ({
  open,
  onClose,
  questions,
  isLoading,
  onReplace,
  examId,
}: ViewQuestionModalProps) => {
  const [explanationExpand, setExplanationExpand] = useState("");

  const cognitiveLevelColor = (level: string) => {
    if (level === "Application" || level === "Applying")
      return "border-[#cefafd] bg-[#cefafd] !text-[#0e748e]";
    if (level === "Remembering") return "border-[#f3e8fe] bg-[#f3e8fe] !text-[#a562d9]";
    if (level === "Understanding") return "border-[#dce9fd] bg-[#dce9fd] !text-[#2550d4]";
    if (level === "Knowledge") return "border-[#cbfbf1] bg-[#cbfbf1] !text-[#09756e]";
  };

  const colorSchemes = [
    { bg: "#EADCF8", text: "#8A2BE2" },
    { bg: "#DCE9FD", text: "#2550D4" },
    { bg: "#D5F7F8", text: "#0D8F95" },
    { bg: "#DBFCE7", text: "#1C715A" },
    { bg: "#FDE2E4", text: "#D8345F" },
    { bg: "#FDDADA", text: "#C62828" },
  ];

  let lastColorIndex = -1;
  const getNextColor = () => {
    let nextColorIndex;
    do {
      nextColorIndex = Math.floor(Math.random() * colorSchemes.length);
    } while (nextColorIndex === lastColorIndex);
    lastColorIndex = nextColorIndex;
    return colorSchemes[nextColorIndex];
  };
  return (
    <MainDialog isOpen={open} onOpenChange={onClose} title="View Question" size="md">
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LucideLoaderCircle className="animate-spin size-10" />
          </div>
        ) : (
          questions?.map((d, i) => (
            <Fragment key={i}>
              <div className="relative w-full rounded-lg border px-3 py-4">
                {/* Tags */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-3xl border px-4 py-2 ${cognitiveLevelColor(
                      d.cognitive_level.title
                    )}`}
                  >
                    <span className="text-[11px] font-medium sm:text-[12px]">
                      {`K${d.cognitive_level.s_no} - ${d.cognitive_level.title}`}
                    </span>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-[25px] px-4 py-2 text-[11px] font-medium sm:text-[12px]",
                      d.difficulty === 1
                        ? "bg-[#d0fae5] !text-[#007758]"
                        : d.difficulty === 2
                        ? "bg-[#fdf9c7] !text-[#a1621b]"
                        : "bg-[#fee2e2] !text-[#ba2023]"
                    )}
                  >
                    {d.difficulty == 1 ? "Easy" : d.difficulty == 2 ? "Medium" : "Hard"}
                  </Badge>
                  <Badge className="bg-[#e0f2fe] px-4 py-2 text-[11px] text-[#0a699e] sm:text-[12px]">
                    <Timer size={18} className="me-2" /> {d.estimated_time} mins
                  </Badge>
                  <Badge className="bg-[#a6d7f8] px-4 py-2 text-[11px] text-[#423d3d] sm:text-[12px]">
                    {d.question_type?.question_type}
                  </Badge>
                  <Button
                    type="button"
                    className="rounded-[25px] px-4 py-2 text-[11px] sm:text-[12px]
             bg-[#2b2b2b] text-white
             hover:bg-[#242424] active:bg-[#1e1e1e]
             border border-[#3a3a3a]
             shadow-sm transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3a3a3a] focus-visible:ring-offset-2"
                    onClick={() =>
                      onReplace({
                        s_no: d?.s_no,
                        course_id: d?.course_id,
                        question_typeId: d?.question_type?.s_no,
                        co_outcomeId: d?.co_outcome?.id,
                        programId: d?.ProgramId ?? d?.programId,
                        chapterId: d?.chapterId,
                        topicId: d?.topicId,
                        examId,
                      })
                    }
                  >
                    Replace Question
                  </Button>
                </div>

                {/* Question */}
                <div className="px-[15px] py-[10px]">
                  <div className="inline-flex leading-7">
                    <span className="mr-2 text-[14px] font-bold text-[#00143f]">{i + 1}.</span>
                    <MarkdownForBot content={d.question} />
                  </div>
                </div>
                {/* Options */}
                {[d.optionA, d.optionB, d.optionC, d.optionD].map((opt, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "mt-2 rounded-sm border px-[15px] py-[8px]",
                      `${d.correctOption}` === `${idx + 1}` ? "bg-[#C7F7D4] text-[#046444]" : ""
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium whitespace-nowrap">
                        Option {String.fromCharCode(65 + idx)}:
                      </span>
                      <div className="flex-1">
                        <MarkdownForBot content={opt} />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Subject + Chapter */}
                <div className="my-4 flex flex-wrap items-center gap-2 rounded-lg">
                  <div className="flex items-center gap-2 bg-[#e0e7fe] px-4 py-2 rounded-3xl">
                    <span className="text-[13px] font-medium text-[#000]">📚 Subject:</span>
                    <span className="text-[13px] font-medium text-[#473ac5]">{d.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#fef2ca] px-4 py-2 rounded-3xl">
                    <span className="text-[13px] font-medium text-[#000]">📑 Chapter:</span>
                    <span className="text-[13px] font-medium text-[#b4541c]">{d.chapterName}</span>
                  </div>
                </div>
                {/* Keywords */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-[13px] font-semibold">🔄 Concepts:</div>
                  {d.Keywords?.split(",")
                    .filter((k) => k.trim().length > 0)
                    .map((keyword, idx) => {
                      const colors = getNextColor();
                      return (
                        <div key={idx} className="my-4">
                          <div
                            className="flex items-center gap-2 rounded-3xl px-4 py-2"
                            style={{ backgroundColor: colors.bg }}
                          >
                            <span
                              style={{ color: colors.text }}
                              className="text-[12px] font-medium"
                            >
                              {keyword}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {/* Accordion Explanation */}
                <Accordion
                  type="single"
                  collapsible
                  value={explanationExpand}
                  onValueChange={(val) => setExplanationExpand(val)}
                  className="mt-4 w-full border bg-[#f3faff] px-[15px] py-[2px]"
                >
                  <AccordionItem value={`${i}`} className="border-none">
                    <AccordionTrigger onClick={() => setExplanationExpand(`${i}`)}>
                      Explanation
                    </AccordionTrigger>
                    <AccordionContent className="mark_down_text">
                      <MarkdownBotLatest content={d.answerDescription} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Fragment>
          ))
        )}
      </div>
    </MainDialog>
  );
};

export default ViewQuestionModal;
