"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import type { ExamReponse } from "@/types/admin/exams";
import { MoreVertical } from "lucide-react";
import { memo, useMemo } from "react";
import { formatDateTime } from "./utils";
import { useNavigate } from "react-router-dom";

interface ExamCardProps extends ExamReponse {
  onViewQuestions: () => void;
  onViewStudents: () => void;
  onEditExam: () => void;
}

const packages = [
  { id: 1, name: "Package 1" },
  { id: 2, name: "Package 2" },
  { id: 3, name: "Package 3" },
];

const ExamCard = ({
  id,
  is_published,
  exam_name,
  c_id,
  p_name,
  start_date,
  end_date,
  duration,
  question_count,
  subject_name,
  onViewQuestions,
  onViewStudents,
  onEditExam,
}: ExamCardProps) => {
  const navigate = useNavigate();
  const AdminOnlyGroups = ["admin"];
  const updateExamHandler = (id: number) => {};
  const deleteExamHandler = (id: number) => {};
  const onChangePin = (id: number, pin: boolean) => {};

  const hasEnded = useMemo(() => {
    if (!end_date) return false;
    const s = end_date.trim();
    // If it's just "YYYY-MM-DD", treat as end of that day (local time)
    const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T23:59:59`) : new Date(s);
    return d.getTime() <= Date.now();
  }, [end_date]);

  return (
    <>
      <Card
        className={`relative mb-4 overflow-hidden pb-1 pt-4 border-l-[10px] border-l-green-400 before:absolute before:left-[-30px] before:top-0 before:w-[61px] before:rotate-[-45deg]         } before:p-3 before:content-['']`}
      >
        <CardHeader className="flex flex-col space-y-2 px-4 py-0">
          {/* First Row: ID + p_name */}
          <div className="flex w-full items-center space-x-2">
            <div className="font-bold text-B2CAgray">{id}</div>
            <Separator orientation="vertical" className="bg-gray-500 h-4" />
            <span className="font-semibold text-md text-primary truncate">
              {exam_name?.toUpperCase()}
            </span>
            {hasEnded && (
              <Badge
                variant="secondary"
                className="ml-auto mr-12 rounded-full border border-amber-200 bg-amber-100 text-amber-800
                   px-2 py-0.5 text-xs
                   dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Completed
              </Badge>
            )}
          </div>
          {/* Second Row: subject_name */}
          {/* <div className="flex w-full items-center space-x-2 mt-1">
            <Separator orientation="vertical" className="bg-gray-500 h-4" />
            <span className="h-4 w-4 mr-3"></span>
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default truncate text-sm font-semibold text-B2CAgray">
                    {subject_name}
                  </div>
                </TooltipTrigger>
                <TooltipContent color="default">
                  <p>{subject_name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
          {/* Right Section: Actions */}
          <div className="absolute right-4 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="icon" className="text-black">
                  <MoreVertical className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEditExam}>Edit Exam</DropdownMenuItem>
                <DropdownMenuItem onClick={onViewQuestions}>View Questions</DropdownMenuItem>
                <DropdownMenuItem onClick={onViewStudents}>View Students</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/admin/exams/analytics/${id}`)}>
                  View Analytics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="mb-2 space-y-2 px-6 py-0 mt-3">
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-1">
              <div className="text-sm font-medium text-B2CAgray truncate">Program: {p_name}</div>
              <div className="text-sm font-medium text-B2CAgray truncate">
                Subject: {subject_name}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pb-2">
            <div className="flex h-5 space-x-2">
              <div className="text-xs text-B2CAgray lg:text-sm">{`${question_count} Questions`}</div>
              {/* <div className="text-xs text-B2CAgray lg:text-sm">{`23 Questions`}</div> */}
              <Separator orientation="vertical" className="bg-gray-500 h-4" />
              {/* <div className="text-xs text-B2CAgray lg:text-sm">{} Marks</div> */}
              {/* <div className="text-xs text-B2CAgray lg:text-sm">28 Marks</div> */}
              <div className="text-xs text-B2CAgray lg:text-sm">{duration} Mins</div>
              {/* <Separator orientation="vertical" className="bg-gray-500 h-4" /> */}
              {/* <div className="text-xs text-B2CAgray lg:text-sm">2: 00 Mins</div> */}
            </div>
            {/* <Button
              onClick={onView}
              variant="default"
              size="sm"
              className="!px-0 text-sm font-semibold text-B2CAgray"
            >
              Questions
              <Icon icon={"si:chevron-right-alt-fill"} className="text-base transition-all" />
            </Button> */}
          </div>
          <div className="flex items-center justify-between text-sm border-t-2 pt-3">
            <span className="flex items-center gap-2">
              <Icon icon="lucide:calendar-days" className="text-base transition-all" />
              {formatDateTime(start_date)}
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="ic:outline-access-time" className="text-base transition-all" />
              {formatDateTime(end_date)}
            </span>
            {/* <Badge color="default" rounded="full" className="bg-primary/10 text-primary">
              <Icon icon="icon-park-outline:dot" fontSize="12px" className="mr-1 text-inherit" />
              {subject_name}
            </Badge> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default memo(ExamCard);
