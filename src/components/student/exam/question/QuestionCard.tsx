"use client";

import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import MainCard from "@/components/Common/MainCard";
import { cn } from "@/lib/utils";
import MarkdownForBot from "@/components/MarkdownForBot";

const QuestionCard = ({
  question,
  index,
  total,
  difficulty,
  isBookmarked,
  onBookmarkToggle,
}: {
  question: string;
  index: number;
  total: number;
  difficulty: number;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}) => {
  const getDifficultyLabel = (level: number) => {
    if (level === 1) return "Easy";
    if (level === 2) return "Medium";
    if (level === 3) return "Hard";
    return "Unknown";
  };

  return (
    <div className="col-span-12">
      <MainCard
        title={
          <div className="flex flex-row justify-between items-center">
            <p className="text-[#101010] text-opacity-[70%] dark:text-[#ffff]">
              Question {index + 1} /{" "}
              <span className="text-[#101010] dark:text-[#ffff] font-[600]">{total}</span>
            </p>
            <div className="flex gap-1">
              <Badge className="bg-[#FFCC00] text-[#101010] text-[12px] font-semibold px-[8px] py-[2px] rounded-[4px]">
                {getDifficultyLabel(difficulty)}
              </Badge>
              <BookmarkFilledIcon
                className={cn(
                  "cursor-pointer size-[21px] transition-colors",
                  isBookmarked ? "text-yellow-500" : "text-gray-600"
                )}
                onClick={onBookmarkToggle}
              />
            </div>
          </div>
        }
      >
        <h3 className="text-[16px] xl:text-[18px] font-medium text-[#101010] dark:text-[#FFFF] mt-2 xl:leading-[28px] leading-[22px]">
          <MarkdownForBot content={question} />
        </h3>
      </MainCard>
    </div>
  );
};

export default QuestionCard;
