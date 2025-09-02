"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Circle } from "lucide-react";

interface SubChapter {
  name: string;
  correct: number;
  wrong: number;
  left: number;
  performance: number;
}

interface ChapterData {
  id: number;
  name: string;
  totalStudents: number;
  correct: number;
  wrong: number;
  left: number;
  performance: string;
  performanceValue: number;
  topics?: SubChapter[];
}

const getPerformanceColor = (value: number): string => {
  if (value >= 75) return "bg-green-500";
  if (value >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

const PerformanceBar = ({ value }: { value: number }) => {
  const color = getPerformanceColor(value);
  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 min-w-[50px]">{value.toFixed(2)}%</span>
    </div>
  );
};

export default function ChapterPerformanceCard({ chapterData }: { chapterData: ChapterData[] }) {
  return (
    <>
      {/* 💻 Laptop Accordion */}
      <Card className="w-full mx-auto hidden lg:block">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-700">
            <div className="col-span-1 text-left">Sl.No</div>
            <div className="col-span-3 text-left">Chapter Name</div>
            <div className="col-span-1 text-center">Students</div>
            <div className="col-span-1 text-center flex justify-center items-center gap-1">
              <Circle className="w-3 h-3 text-green-500 fill-current" />
              Correct
            </div>
            <div className="col-span-1 text-center flex justify-center items-center gap-1">
              <Circle className="w-3 h-3 text-red-500 fill-current" />
              Wrong
            </div>
            <div className="col-span-1 text-center flex justify-center items-center gap-1">
              <Circle className="w-3 h-3 text-yellow-500 fill-current" />
              Left
            </div>
            <div className="col-span-3 text-left">Chapter Performance</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Body */}
          <Accordion type="single" collapsible className="w-full">
            {chapterData?.map((chapter, index) => (
              <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`} className="border-b">
                <AccordionTrigger className="hover:no-underline p-0">
                  <div className="grid grid-cols-12 gap-4 p-4 w-full text-left">
                    <div className="col-span-1 text-sm text-left text-gray-600">{index + 1}</div>
                    <div className="col-span-3 text-sm font-medium text-gray-800 uppercase text-left">
                      {chapter.name}
                    </div>
                    <div className="col-span-1 text-sm text-center text-gray-600">
                      {chapter.totalStudents}
                    </div>
                    <div className="col-span-1 text-sm text-center text-green-600">
                      {chapter.correct}%
                    </div>
                    <div className="col-span-1 text-sm text-center text-red-500">
                      {chapter.wrong}%
                    </div>
                    <div className="col-span-1 text-sm text-center text-yellow-500">
                      {chapter.left}%
                    </div>
                    <div className="col-span-3">
                      <PerformanceBar value={chapter.correct} />
                    </div>
                  </div>
                </AccordionTrigger>

                {chapter.topics && (
                  <AccordionContent className="pb-0">
                    <div className="bg-gray-50">
                      {chapter.topics.map((subChapter, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 p-4 pl-4 border-t border-gray-200"
                        >
                          <div className="col-span-1"></div>
                          <div className="col-span-3 text-sm text-gray-700 uppercase text-left">
                            {subChapter.name}
                          </div>
                          <div className="col-span-1 text-sm text-center text-gray-600"></div>
                          <div className="col-span-1 text-sm text-center text-green-600">
                            {subChapter.correct}%
                          </div>
                          <div className="col-span-1 text-sm text-center text-red-500">
                            {subChapter.wrong}%
                          </div>
                          <div className="col-span-1 text-sm text-center text-yellow-500">
                            {subChapter.left}%
                          </div>
                          <div className="col-span-3">
                            <PerformanceBar value={subChapter.correct} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Small Screen Accordion */}
      <div className="block lg:hidden">
        <Accordion type="single" collapsible className="space-y-2">
          {chapterData?.map((chapter) => (
            <AccordionItem
              key={chapter.id}
              value={`mobile-${chapter.id}`}
              className="rounded-md border shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 flex justify-between items-start w-full text-left">
                {/* Left-side content */}
                <div className="flex flex-col w-full">
                  {/* Chapter Title */}
                  <div className="text-sm font-bold text-gray-800 uppercase mb-2">
                    {chapter.name}
                  </div>

                  {/* Header Labels */}
                  <div className="grid grid-cols-4 w-full text-[12px] font-medium text-gray-600 mb-1">
                    <div className="text-left">Total Students</div>
                    <div className="text-center text-green-600">Correct</div>
                    <div className="text-center text-red-500">Wrong</div>
                    <div className="text-center text-yellow-500">Left</div>
                  </div>

                  {/* Header Values */}
                  <div className="grid grid-cols-4 w-full text-[12px] text-gray-800">
                    <div className="text-left">{chapter.totalStudents}</div>
                    <div className="text-center text-green-600">{chapter.correct}%</div>
                    <div className="text-center text-red-500">{chapter.wrong}%</div>
                    <div className="text-center text-yellow-500">{chapter.left}%</div>
                  </div>
                </div>
              </AccordionTrigger>

              {/* Subtopics Section */}
              {chapter.topics && (
                <AccordionContent className="bg-gray-50 px-4 py-2">
                  {chapter.topics.map((sub, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 py-3 border-b last:border-none text-xs items-center"
                    >
                      <div className="col-span-1 font-medium uppercase text-gray-700 text-left">
                        {sub.name}
                      </div>
                      <div className="text-center text-green-600">{sub.correct}%</div>
                      <div className="text-center text-red-500">{sub.wrong}%</div>
                      <div className="text-center text-yellow-500">{sub.left}%</div>
                    </div>
                  ))}
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
