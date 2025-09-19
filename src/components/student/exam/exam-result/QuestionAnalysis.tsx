import { ChartNoAxesColumn, CircleCheckBig, MessageCircleQuestion, Timer } from "lucide-react";
import React from "react";

interface QuestionAnalysisProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string | number;
  highlightColor: string;
  borderColor: string;
}

export interface IQuestionAnalysis {
  attempted: number;
  accuracy: number;
  correct: number;
  avgTimePerQst: number;
  totalQuestionsCount: number;
}

const convertTimeToMinsOrSec = (time: number) => {
  return (time > 60 ? time / 60 : time)?.toFixed(2);
};

const getTimeExtension = (time: number) => {
  return time > 60 ? "mins" : "Secs";
};

const QuestionAnalysis = ({ data }: { data: IQuestionAnalysis }) => {
  const attemptRate = (data.attempted / data.totalQuestionsCount) * 100;
  const QuestionAnalysisData = [
    {
      icon: <MessageCircleQuestion />,
      title: "Questions",
      subtitle: "Total Questions",
      value: data.totalQuestionsCount,
      highlightColor: "#101010",
      borderColor: "border-[#10101026]",
    },
    {
      icon: <ChartNoAxesColumn />,
      title: "Attempted",
      subtitle: `${attemptRate.toFixed(2)}% Attempt Rate`,
      value: data.attempted,
      highlightColor: "#0B57D0",
      borderColor: "border-[#0385FF4D]",
    },
    {
      icon: <CircleCheckBig />,
      title: "Correct",
      subtitle: ` Accuracy`,
      value: data.correct,
      highlightColor: "#248A3D",
      borderColor: "border-[#248A3D4D]",
    },
    {
      icon: <Timer />,
      title: "Avg. Time / Que",
      subtitle: `${getTimeExtension(data.avgTimePerQst)} per question`,
        value: convertTimeToMinsOrSec(data.avgTimePerQst),
      // value: 3.5,
      highlightColor: "#101010",
      borderColor: "border-[#10101026]",
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-4 mb-[42px] ">
      {QuestionAnalysisData.map((datas, index) => (
        <div key={index} className="col-span-6 lg:col-span-3">
          <QuestionAnalysisCard {...datas} />
        </div>
      ))}
    </div>
  );
};

const QuestionAnalysisCard: React.FC<QuestionAnalysisProps> = ({
  icon,
  title,
  subtitle,
  value,
  highlightColor,
  borderColor,
}) => {
  return (
    <div
      className={`rounded-[12px] p-[18px]  lg:!min-h-[180px] min-h-[170px] border flex flex-col  transition-all dark:bg-[#171717] ${borderColor}`}
    >
      <div className={`flex  items-center border-b pb-[10px]`}>
        <div className="text-[18px] dark:text-[#fff] text-[#101010]  font-semibold me-3">
          {icon}
        </div>
        <div className={`font-medium  lg:text-[18px] text-[14px]`}>{title}</div>
      </div>

      {/* Details Section */}
      <div className="mt-4">
        <div className="text-[#101010]/[70%] mb-[8px] dark:text-[#fff]/[70%] font-medium text-[14px]">
          {subtitle}
        </div>
        <div className={`text-[20px] font-semibold text-[${highlightColor}] dark:text-[#fff] `}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnalysis;
