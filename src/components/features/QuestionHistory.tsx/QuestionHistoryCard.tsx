import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Target,
  TimerIcon,
  Users,
} from "lucide-react";
import React from "react";

const QuestionHistoryCard = ({ index, data }: any) => {
  const isAdmin = localStorage.getItem("subjectIds") === null;

  const navigate = useNavigate();

  function formatAddedDate(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format month/day/year + 12-hour time in UTC
    const formatted = date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // key: keeps the raw 11:33
    });

    // turn the comma into your dash
    return formatted.replace(",", " –");
  }

  return (
    <Card className="group w-full h-full">
      {/* Header */}
      <CardHeader className="pb-4 pt-6 px-6 bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            Question Set {index + 1}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm w-fit border-0 hover:bg-gray-700"
          >
            <FileText size={14} className="mr-1.5" />
            {data.question_count} Questions
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Left Column: Subjects, Chapters, Topics */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <BookOpen size={16} className="text-gray-600" />
              <span>{data.programName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <BookOpen size={16} className="text-gray-600" />
              <span>{data.subjectName}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.co_outcome?.split(",").map((co, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-300 px-3 py-1"
                >
                  {co}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 text-sm">
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <div>
                  <span className="font-semibold text-gray-700">Created By: </span>
                  {data.firstname}
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-500">
                <TimerIcon size={16} />
                <span className="text-sm">{formatAddedDate(data.added_date)}</span>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate(`/q-bank/${data.uuid}`)}
                className="bg-gray-500 rounded-full  text-white"
              >
                View Questions
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionHistoryCard;
