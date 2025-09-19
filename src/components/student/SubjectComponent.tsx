"use client";
import { cn } from "@/lib/utils";

interface Question {
  s_no: number;
  question: string;
  options: any[];
  difficulty: number;
}

interface ExamResponse {
  qId: number;
  ans?: string;
  mr?: boolean;
  saved?: boolean;
  visited?: boolean;
}

enum QuestionStatus {
  NOT_VISITED = "not-visited",
  NOT_ANSWERED = "not-answered",
  ANSWERED = "answered",
  MARK_FOR_REVIEW = "mark-for-review",
  SAVE_MARK_REVIEW = "save-mark-review",
}

const SubjectComponent = ({
  questions,
  currentQIndex,
  examResponses,
  onQuestionSelect,
}: {
  questions: Question[];
  currentQIndex: number;
  examResponses: ExamResponse[];
  onQuestionSelect: (index: number) => void;
}) => {
  const getQuestionStatus = (questionIndex: number): QuestionStatus => {
    const question = questions[questionIndex];
    const response = examResponses.find((res) => res.qId === question.s_no);

    // Check if question has been visited
    if (!response || !response.visited) {
      return QuestionStatus.NOT_VISITED;
    }

    // Check if marked for review and has saved answer
    if (response.mr && response.saved && response.ans && response.ans !== "") {
      return QuestionStatus.SAVE_MARK_REVIEW;
    }

    // Check if only marked for review (no saved answer or empty answer)
    if (response.mr && (!response.saved || !response.ans || response.ans === "")) {
      return QuestionStatus.MARK_FOR_REVIEW;
    }

    // Check if has saved answer (clicked Save & Next with selection)
    if (response.saved && response.ans && response.ans !== "") {
      return QuestionStatus.ANSWERED;
    }

    // If visited but no saved answer or empty answer (this is the NOT_ANSWERED case)
    if (response.visited && (!response.saved || !response.ans || response.ans === "")) {
      return QuestionStatus.NOT_ANSWERED;
    }

    return QuestionStatus.NOT_VISITED;
  };

  return (
    <div className="w-full bg-white dark:bg-[#0E0E0E] rounded-lg border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Questions Overview</h3>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <Indicator color="before:bg-[#046444]" text="Answered" />
          <Indicator color="before:bg-[#D70015]" text="Not Answered" />
          <Indicator color="before:bg-[#FF9900]" text="Mark For Review" />
          <Indicator color="before:bg-[#808080]" text="Not Visited" />
        </div>
      </div>

      {/* Questions Grid */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(index);
            return (
              <QuestionNumber
                key={question.s_no}
                questionIndex={index + 1}
                status={status}
                isActive={index === currentQIndex}
                onClick={() => onQuestionSelect(index)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const QuestionNumber = ({
  questionIndex,
  status,
  isActive,
  onClick,
}: {
  questionIndex: number;
  status: QuestionStatus;
  isActive: boolean;
  onClick: () => void;
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case QuestionStatus.ANSWERED:
        return "bg-[#C7F7D499] text-[#046444] border-[#C7F7D499] dark:bg-[#C7F7D4] dark:border-[#C7F7D4]";
      case QuestionStatus.NOT_ANSWERED:
        return "bg-[#FDD7CA99] text-[#D70015] border-[#FDD7CA99] dark:bg-[#FDD7CA] dark:border-[#FDD7CA]";
      case QuestionStatus.MARK_FOR_REVIEW:
        return "bg-[#FFF2CCB3] text-[#DB7A00] border-[#FFF2CCB3] dark:bg-[#FFF2CC] dark:border-[#FFF2CC]";
      case QuestionStatus.SAVE_MARK_REVIEW:
        return "before:w-[13px] before:h-[13px] before:inline-block before:rounded-[50%] before:bg-[#ffcb72] before:absolute before:bottom-[-1px] before:right-[-2px] bg-[#C7F7D499] dark:bg-[#C7F7D4] dark:border-[#C7F7D4] text-[#046444] border-[#C7F7D499] relative";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  return (
    <div
      className={cn(
        "w-[40px] h-[40px] shadow-sm flex justify-center items-center border cursor-pointer rounded-[8px] transition-all font-semibold text-[14px] select-none",
        getStatusStyles(),
        isActive && "!border-[#101010] dark:!border-[#f5f5f5] !border-2 cursor-default"
      )}
      onClick={onClick}
    >
      {questionIndex}
    </div>
  );
};

const Indicator = ({
  color,
  text,
  className,
  indicatorClassName,
}: {
  color: string;
  text: string;
  className?: string;
  indicatorClassName?: string;
}) => {
  return (
    <div
      className={cn(
        `before:content-[''] before:w-[10px] before:h-[10px] before:inline-block before:rounded-[50%] flex items-center flex-row`,
        color,
        indicatorClassName
      )}
    >
      <p className={cn("ml-2 text-[11px] text-nowrap", className)}>{text}</p>
    </div>
  );
};

export default SubjectComponent;
