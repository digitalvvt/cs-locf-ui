import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GenericType } from "@/types";
import StudentMarksTable from "./StudentsMarksTable";
import { useState, useMemo } from "react";
import DifficultyMarksTable, { DifficultyData } from "./DifficultyAnalysis";
import StudentResultTable from "./StudentResultTable";
import ChapterPerformanceCard from "./ChapterTopicsAnalysis";
import { useGetAdminExamsAnalyticsQuery } from "@/api/api/admin/exam-analytics";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import CoMarksDistribution, { CoDistributionData } from "./CoMarksDistribution";

const topDropdownOptions = [
  { id: 0, name: "All" },
  { id: 1, name: "Top 10" },
];

const leastDropdownOptions = [
  { id: 0, name: "All" },
  { id: 1, name: "Least 10" },
];

const dropdownOptions = [
  { id: 0, name: "All" },
  { id: 1, name: "0 - 30" },
  { id: 2, name: "31 - 50" },
  { id: 3, name: "51 - 70" },
  { id: 4, name: "71 - 100" },
];

const mockData: CoDistributionData[] = [
  {
    co: "CO1",
    noOfQuestions: 12,
    correct: 75,
    wrong: 15,
    left: 10,
  },
  {
    co: "CO2",
    noOfQuestions: 10,
    correct: 60,
    wrong: 30,
    left: 10,
  },
  {
    co: "CO3",
    noOfQuestions: 8,
    correct: 80,
    wrong: 10,
    left: 10,
  },
  {
    co: "CO4",
    noOfQuestions: 15,
    correct: 50,
    wrong: 40,
    left: 10,
  },
  {
    co: "CO5",
    noOfQuestions: 5,
    correct: 90,
    wrong: 5,
    left: 5,
  },
];

export default function StudentTable() {
  const { examId } = useParams();
  const [topStudents, setTopStudents] = useState<GenericType | null>(topDropdownOptions[0]);
  const [leastStudents, setLeastStudents] = useState<GenericType | null>(leastDropdownOptions[0]);
  const [selectedOption, setSelectedOption] = useState<GenericType | null>(dropdownOptions[0]);

  const { data: fullData } = useGetAdminExamsAnalyticsQuery(examId!, { skip: !examId });

  // Top Students
  const topStudentsData = useMemo(() => {
    const arr = fullData?.students ?? [];
    if (!arr.length) return [];

    const sortedDesc = [...arr].sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
    // Coerce id so '1' and 1 both work
    return Number(topStudents?.id) === 1 ? sortedDesc.slice(0, 10) : sortedDesc;
  }, [fullData?.students, topStudents?.id]);

  // Least Students
  const leastStudentsData = useMemo(() => {
    const arr = fullData?.students ?? [];
    if (!arr.length) return [];

    const sortedAsc = [...arr].sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
    return Number(leastStudents?.id) === 1 ? sortedAsc.slice(0, 10) : sortedAsc;
  }, [fullData?.students, leastStudents?.id]);

  return (
    <>
      <div className="mb-10">
        <div className="text-lg font-semibold !mb-2">Chapter and Topic Analysis</div>
        <ChapterPerformanceCard chapterData={fullData?.chapterAnalysis} />
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mb-10">
        <StudentMarksTable
          title="Top Students List"
          subjects={fullData?.subjects}
          students={topStudentsData}
          dropdownOptions={topDropdownOptions}
          selectedOption={topStudents}
          onSelectOption={setTopStudents}
        />

        <StudentMarksTable
          title="Least Students List"
          subjects={fullData?.subjects}
          students={leastStudentsData}
          dropdownOptions={leastDropdownOptions}
          selectedOption={leastStudents}
          onSelectOption={setLeastStudents}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
        <DifficultyMarksTable data={fullData?.questionDistribution} />
        <CoMarksDistribution data={fullData?.CourseOutComeAnalysis} />
      </div>

      {/* Optional Student Table if needed later */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] sm:min-w-full">
          <StudentResultTable
            totalMarks={fullData?.questionCount}
            subjects={fullData?.subjects}
            students={fullData?.students}
            dropdownOptions={dropdownOptions}
            selectedOption={selectedOption}
            onChangeOption={setSelectedOption}
          />
        </div>
      </div>
    </>
  );
}
