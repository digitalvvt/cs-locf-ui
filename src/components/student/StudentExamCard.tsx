"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExamReponse } from "@/types/admin/exams";
import { Box } from "lucide-react";
import React, { useState, memo } from "react";
import { formatDateTime } from "../admin/exams/utils";
import { useSaveStudentExamSessionMutation } from "@/api/api/student/student-api";

const StudentExamCard = ({
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
  isCompleted,
  uniqueId,
  userId,
}: ExamReponse) => {
  const navigate = useNavigate();
  const [saveSession] = useSaveStudentExamSessionMutation();

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleViewResult = () => {
    if (!uniqueId || !userId) return;
    navigate(`/exam/result/${uniqueId}/${userId}`);
  };

  const handleRetake = async () => {
    try {
      let uuid = uniqueId;
      if (!uuid) return;

      const userDataString = localStorage.getItem("userDetails");
      if (!userDataString) return;
      const userData = JSON.parse(userDataString);

      const result = await saveSession({
        uuid,
        exam_id: Number(id),
        student_id: Number(userData.id),
      }).unwrap();

      navigate(`/exams/${id}?session=${uuid}`);
    } catch (err) {
      console.error("❌ Failed to retake:", err);
    }
  };

  const handleStartExam = async () => {
    try {
      const localStorageKey = `exam_session_uuid_${id}`;
      let uuid = uniqueId || localStorage.getItem(localStorageKey);

      if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem(localStorageKey, uuid);
      }

      const userDataString = localStorage.getItem("userDetails");
      if (!userDataString) return;
      const userData = JSON.parse(userDataString);

      const result = await saveSession({
        uuid,
        exam_id: Number(id),
        student_id: Number(userData.id),
      }).unwrap();

      navigate(`/exams/${id}?session=${uuid}`);
    } catch (err) {
      console.error("❌ Failed to start:", err);
    }
  };

  const hasEnded = React.useMemo(() => {
    if (!end_date) return false;
    const s = end_date.trim();
    const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T23:59:59`) : new Date(s);
    return d.getTime() <= Date.now();
  }, [end_date]);

  const parseEdge = React.useCallback((value?: string | null, edge: "start" | "end" = "start") => {
    if (!value) return null;
    const s = value.trim();
    // Treat date-only as LOCAL start/end of day (avoid UTC shift)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Date(edge === "start" ? `${s}T00:00:00` : `${s}T23:59:59`);
    }
    // Otherwise rely on the provided string (local if no TZ, UTC if has Z)
    return new Date(s);
  }, []);

  const { notStarted, ended, ongoing, statusLabel, lockReason } = React.useMemo(() => {
    const startAt = parseEdge(start_date, "start"); // disable before this
    const endAt = parseEdge(end_date, "end"); // disable after this
    const now = Date.now();

    const before = startAt ? now < startAt.getTime() : false; // if no start_date, don’t block
    const after = endAt ? now > endAt.getTime() : false; // if no end_date, don’t block
    const live = !before && !after;

    return {
      notStarted: before,
      ended: after,
      ongoing: live,
      statusLabel: after ? "Completed" : before ? "Upcoming" : "Ongoing",
      lockReason: after ? "Exam has ended" : before ? "Exam not started yet" : "",
    };
  }, [start_date, end_date, parseEdge]);

  return (
    <>
      <Card
        className={`relative mb-4 overflow-hidden pb-1 pt-4 border-l-[10px] border-l-green-400
        before:absolute before:left-[-30px] before:top-0 before:w-[61px] before:rotate-[-45deg] before:p-3 before:content-['']`}
      >
        {/* Header Section */}
        <CardHeader className="flex flex-col space-y-2 px-4 py-0">
          <div className="flex w-full items-center space-x-2">
            <div className="font-bold text-B2CAgray">{id}</div>
            <Separator orientation="vertical" className="bg-gray-500 h-4" />
            <span className="font-semibold text-md text-primary truncate">
              {exam_name?.toUpperCase()}
            </span>

            {hasEnded && (
              <Badge
                variant="secondary"
                className="ml-auto rounded-full px-2 py-0.5 text-xs bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
              >
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="mb-2 space-y-2 px-6 py-0 mt-3">
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-1">
              <div className="text-sm font-medium text-B2CAgray truncate">Program: {p_name}</div>
              <div className="text-sm font-medium text-B2CAgray truncate">
                Subject: {subject_name}
              </div>
            </div>
          </div>

          {/* Stats + Action Buttons */}
          <div className="flex items-center justify-between pb-2">
            {/* Left: Question Count + Duration */}
            <div className="flex h-5 space-x-2">
              <div className="text-xs text-B2CAgray lg:text-sm">{`${question_count} Questions`}</div>
              <Separator orientation="vertical" className="bg-gray-500 h-4" />
              <div className="text-xs text-B2CAgray lg:text-sm">{duration} Mins</div>
            </div>

            {/* Right: Buttons */}
            <div className="flex space-x-2">
              {isCompleted === 0 ? (
                // START EXAM: disabled after end_date
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-blue-500 hover:bg-sky-600 text-white font-semibold disabled:pointer-events-none disabled:opacity-50"
                          onClick={handleStartExam}
                          disabled={!ongoing}
                        >
                          Start Exam
                          <Icon icon="si:chevron-right-alt-fill" className="ml-1 text-white" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!ongoing && <TooltipContent>{lockReason}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-sky-600 text-white font-semibold"
                    onClick={handleViewResult}
                  >
                    Result
                    <Icon icon="si:chevron-right-alt-fill" className="ml-1 text-white" />
                  </Button>

                  {/* RETAKE: disabled after end_date */}
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold disabled:pointer-events-none disabled:opacity-50"
                            onClick={handleRetake}
                            disabled={!ongoing}
                          >
                            Retake
                            <Icon icon="si:chevron-right-alt-fill" className="ml-1 text-white" />
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!ongoing && <TooltipContent>{lockReason}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>

          {/* Footer: Dates */}
          <div className="flex items-center justify-between text-sm border-t-2 pt-3">
            <span className="flex items-center gap-2">
              <Icon icon="lucide:calendar-days" className="text-base" />
              {formatDateTime(start_date)}
            </span>
            <span className="flex items-center gap-2">
              <Icon icon="ic:outline-access-time" className="text-base" />
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

export default memo(StudentExamCard);
