import React from "react";
import StatsOverview from "./MetricCard";
import ExamsOverviewTable from "./ExamTable";
import { useGetAnalyticsQuery } from "@/api/api/admin/dashboard";
import { Layers, BookOpen, Map, ListOrdered } from "lucide-react";

const DashboardPage = () => {
  const { data, isLoading } = useGetAnalyticsQuery();

  const totalStudents = data?.totalStudents ?? 0;
  const totalExams = data?.totalExams ?? 0;
  const totalFaculty = data?.totalFaculty ?? 0;
  const totalCompletedStudents = data?.totalCompletedStudents ?? 0;

  const totalProgrammes = data?.programsCount ?? 0;
  const totalCourses = data?.subjectsCount ?? 0;
  const totalChapters = data?.chaptersCount ?? 0;
  const totalTopics = data?.topicsCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Row 1: existing summary */}

      <StatsOverview
        loading={isLoading}
        items={[
          {
            title: "Programmes",
            value: totalProgrammes,
            Icon: Layers,
            accentFrom: "from-fuchsia-500",
            accentTo: "to-purple-500",
          },
          {
            title: "Courses",
            value: totalCourses,
            Icon: BookOpen,
            accentFrom: "from-blue-500",
            accentTo: "to-indigo-500",
          },
          {
            title: "Chapters",
            value: totalChapters,
            Icon: ListOrdered,
            accentFrom: "from-emerald-500",
            accentTo: "to-green-500",
          },
          {
            title: "Topics",
            value: totalTopics,
            Icon: Map,
            accentFrom: "from-rose-500",
            accentTo: "to-pink-500",
          },
        ]}
      />

      <StatsOverview
        students={totalStudents}
        exams={totalExams}
        faculties={totalFaculty}
        attended={totalCompletedStudents}
        loading={isLoading}
      />

      <ExamsOverviewTable />
    </div>
  );
};

export default DashboardPage;
