"use client";
import MainCard from "@/components/Common/MainCard";
import MarkdownForBot from "@/components/MarkdownForBot";
import { cn } from "@/lib/utils";

const OptionCard = ({
  options,
  selected,
  onSelect,
  questionId,
}: {
  options: {
    optionId: string;
    optionKey: string;
    option: string;
    optionImg: string;
  }[];
  selected: string | undefined;
  onSelect: (optionKey: string) => void;
  questionId: number;
}) => {
  return (
    <div className="col-span-12 grid grid-cols-12 gap-5 mt-5">
      {options.map((option) => (
        <Option
          key={option.optionId}
          option={option}
          isSelectedOpt={selected === option.optionKey}
          handleSelectOption={() => onSelect(option.optionKey)}
        />
      ))}
    </div>
  );
};

const Option = ({
  option,
  isSelectedOpt = false,
  handleSelectOption,
}: {
  isSelectedOpt?: boolean;
  option: {
    optionId: string;
    optionKey: string;
    option: string;
    optionImg: string;
  };
  handleSelectOption: () => void;
}) => {
  return (
    <MainCard
      title=""
      className={cn("cursor-pointer flex flex-row shadow-none col-span-12")}
      contentClassName="!p-0 flex flex-row w-full items-center"
      onClick={handleSelectOption}
    >
      <div
        className={cn(
          "w-[40px] lg:h-[40px] h-[37px] flex justify-center items-center text-center rounded-md",
          isSelectedOpt ? "bg-[#30D158] text-white" : "bg-[#F5F5F5] text-black"
        )}
      >
        {option.optionKey}
      </div>
      <div className="w-full px-[16px] flex items-center">
        {option.option ? (
          <p
            className={cn(
              "text-[14px]",
              isSelectedOpt
                ? "text-[#096443] dark:text-[#30D158]"
                : "dark:text-[#fff] text-[#101010] text-opacity-[70%]"
            )}
          >
            <MarkdownForBot content={option.option} />
          </p>
        ) : (
          <p className="text-red-500">Option not available</p>
        )}
      </div>
    </MainCard>
  );
};

export default OptionCard;
