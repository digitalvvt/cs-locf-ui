"use client";

import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { convertTimeToMinsOrSec, getTimeExtension } from "@/utils";

export interface ITopicAnalysis {
  name: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface IChapterwiseAnalysis {
  chapter: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number;
  avgTimePerQuestion: number;
  topics: ITopicAnalysis[];
}

const ChapterCardAccordion = ({ data }: { data: IChapterwiseAnalysis }) => {
  return (
    <div className="bg-[#fff] dark:bg-[#171717] border pt-4 lg:pt-6 pb-3 w-full mb-[42px] rounded-[16px]">
      {/* Chapter Header */}
      <div className="flex justify-between border-b pb-4 px-6 mb-4">
        <div>
          <h1 className="text-[16px] lg:text-[20px] flex items-center justify-start font-medium text-[#101010] dark:text-[#FFFF] mb-[6px]">
            {data.chapter}
          </h1>
          <p className="text-[14px] font-normal text-[#101010]/[70%] dark:text-[#FFFF]/[70%]">
            {`${data.attempted}/${data.total} questions attempted`}
          </p>
        </div>
        <div className="text-right">
          <span className="lg:text-[20px] text-[16px] font-semibold text-[#000] dark:text-[#FFFF]">
            {data.accuracy.toFixed(2) || 0}%
          </span>
          <p className="text-[14px] text-[#248A3D] font-normal">Accuracy</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 px-6">
        <div className="text-center">
          <p className="lg:text-[16px] text-[14px] font-normal text-[#101010]/[70%] dark:text-[#FFFF]/[70%]">
            Accuracy
          </p>
          <p className="lg:text-[18px] text-[16px] font-medium text-[#101010] dark:text-[#FFFF]">
            {data.accuracy.toFixed(2) || "-"}
          </p>
        </div>
        <div className="text-center">
          <p className="lg:text-[16px] text-[14px] font-normal text-[#101010]/[70%] dark:text-[#FFFF]/[70%]">
            Time/Q
          </p>
          <p className="lg:text-[18px] text-[16px] font-medium text-[#101010] dark:text-[#FFFF]">
            {convertTimeToMinsOrSec(data.avgTimePerQuestion)}{" "}
            {getTimeExtension(data.avgTimePerQuestion)}
          </p>
        </div>
        <div className="text-center">
          <p className="lg:text-[16px] text-[14px] font-normal text-[#101010]/[70%] dark:text-[#FFFF]/[70%]">
            Rank
          </p>
          <p className="lg:text-[18px] text-[16px] font-medium text-[#101010] dark:text-[#FFFF]">
            -
          </p>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="border-t mt-4">
        <AccordionItem
          value={data.chapter}
          className="px-6 hover:bg-[#ffff] dark:hover:bg-[#6b6b6b50] border-b-0 mt-[10px]"
        >
          <AccordionTrigger className="flex justify-between items-center py-4 border-b-0 hover:no-underline">
            <h2 className="text-[18px] font-medium text-[#101010] dark:text-[#FFFF]">
              Topic Breakdown
            </h2>
          </AccordionTrigger>
          <AccordionContent className="px-4 lg:px-6 max-h-[500px] overflow-y-auto scrollbar-thin mt-[18px] lg:mt-[24px]">
            {data.topics.map((topic, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-[12px]">
                  <p className="text-[14px] lg:text-[16px] font-normal text-[#101010]/[70%] dark:text-[#FFFF]/[70%]">
                    {topic.name}
                  </p>
                  <p
                    className={`text-[16px] font-medium ${
                      topic.accuracy === 100 ? "text-[#248A3D]" : "text-[#0B57D0]"
                    } dark:text-[#FFFF]`}
                  >
                    {topic.accuracy.toFixed(1)}%
                  </p>
                </div>

                <Progress
                  value={topic.accuracy}
                  className="w-full h-[8px]"
                  indicatorStyle={{
                    backgroundColor: topic.accuracy === 100 ? "#248A3D" : "#0B57D0",
                  }}
                />

                <p className="text-sm text-[#101010]/[70%] dark:text-[#FFFF]/[70%] mt-[12px] flex justify-between">
                  <span>
                    {topic.correct}/{topic.total} Correct
                  </span>
                  {/* <span>- /Q</span> */}
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </div>
    </div>
  );
};

export default ChapterCardAccordion;
