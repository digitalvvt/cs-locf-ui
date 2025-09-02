import { Brain, CircleCheckBig, Crosshair, Timer } from "lucide-react";
import React from "react";

interface OverAllScoreProps {
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  topSubtitle?: string;
  darkBgColor?: string;
}

export interface ISummary {
  accuracy: number;
  attempted: number;
  overallScore: number;
  avgTimePerQst: number;
  totalQsts: number;
}

const convertToPercentage = (value: number, totalValue: number) => {
  return (value / totalValue) * 100;
};

const OverAllScore = ({ summary }: { summary: ISummary }) => {
  const cardData: OverAllScoreProps[] = [
    {
      bgColor: "bg-[#39d65f1f]",
      darkBgColor: "bg-[#39d65f1f]",
      borderColor: "border-[#248a3d33]",
      icon: <Crosshair />,
      title: "Overall Score",
      value: `${summary?.overallScore}`,
      topSubtitle: "",
    },
    {
      bgColor: "bg-[#0b57d01c] ",
      darkBgColor: "bg-[#39d65f1f]",
      borderColor: "border-[#0b57d03d]",
      icon: <CircleCheckBig />,
      title: "Questions Attempted",
      value: `${summary.attempted}/${summary?.totalQsts}`,
      subtitle: `${convertToPercentage(summary.attempted, summary.totalQsts).toFixed(
        2
      )}% Completion`,
    },
    {
      bgColor: "bg-[#f3e8ff8f] ",
      darkBgColor: "bg-[#39d65f1f]",
      borderColor: "border-[#9747ff57]",
      icon: <Brain />,
      title: "Accuracy",
      value: `${summary.accuracy?.toFixed(2) || "-"}%`,
    },
    {
      bgColor: "bg-[#dd863e1c]",
      darkBgColor: "bg-[#39d65f1f]",
      borderColor: "border-[#dd863e80]",
      icon: <Timer />,
      title: "Avg. Time per Question",
      value: (summary.avgTimePerQst > 60
        ? summary.avgTimePerQst / 60
        : summary.avgTimePerQst
      ).toFixed(2),
      subtitle: summary.avgTimePerQst > 60 ? "mins" : "Secs",
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-4  ">
      {cardData.map((data, index) => (
        <div key={index} className=" col-span-6 lg:col-span-3">
          <OverAllScoreCard {...data} />
        </div>
      ))}
    </div>
  );
};

const OverAllScoreCard: React.FC<OverAllScoreProps> = ({
  bgColor,
  borderColor,
  icon,
  title,
  value,
  subtitle,
  topSubtitle,
}) => {
  return (
    <div
      className={`rounded-[12px] p-[18px]  lg:min-h-[180px] min-h-[190px]  border ${bgColor} dark:bg-[#000] flex flex-col  transition-all ${borderColor}`}
    >
      <div className={`flex justify-between items-center border-b ${borderColor} pb-[10px]`}>
        <div className="text-2xl">{icon}</div>

        {topSubtitle && <div className={`text-[#248A3D]  font-bold text-lg`}>{topSubtitle}</div>}
      </div>
      <div className="mt-4">
        <div className="text-[#101010]/[70%] mb-[4px] dark:text-[#fff]/[70%] font-medium text-[14px]">
          {title}
        </div>
        <div className="text-[20px] font-semibold  text-[#101010] dark:text-[#fff]">{value}</div>
        {subtitle && (
          <div className="text-[#101010]/[70%] dark:text-[#fff]/[70%] mt-[4px] font-light text-[12px]">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverAllScore;