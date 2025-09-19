import ExamCard from "@/components/admin/exams/ExamCard";
import { useGetStudentExamsListQuery } from "@/api/api/student/student-api";
import StudentExamCard from "@/components/student/StudentExamCard";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { GenericType } from "@/types";
import { useState } from "react";
import { ExamReponse } from "@/types/admin/exams";

const filters = [
  { id: 0, name: "All" },
  { id: 1, name: "Latest" },
  { id: 2, name: "Last Week" },
  { id: 3, name: "Last Month" },
];

const StudentExam = () => {
  const [selectedFilter, setSelectedFilter] = useState<GenericType>({ id: 0, name: "All" });
  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const { org_id, p_id, semester, year, id, shiftId, section } = userData || {};

  const {
    data: examData,
    isLoading,
    isError,
  } = useGetStudentExamsListQuery(
    { org_id, p_id, semester, year, id, shiftId, section },
    {
      skip: !org_id,
      refetchOnMountOrArgChange: true,
    }
  );

  // Filter examData based on selected filter
  const now = new Date();
  const filteredExams = examData?.filter((exam) => {
    const examDate = new Date(exam.start_date);

    if (selectedFilter.id === 1) {
      // Latest: 0–7 days ago
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      return examDate >= sevenDaysAgo && examDate <= now;
    }

    if (selectedFilter.id === 2) {
      // Last Week: 7–14 days ago
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      const fourteenDaysAgo = new Date(now);
      fourteenDaysAgo.setDate(now.getDate() - 14);
      return examDate >= fourteenDaysAgo && examDate < sevenDaysAgo;
    }

    if (selectedFilter.id === 3) {
      // Last Month: 0–30 days ago
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return examDate >= thirtyDaysAgo && examDate <= now;
    }

    return true; // All
  });

  const filterChangeHandler = (filter: GenericType) => {
    setSelectedFilter(filter);
  };

  if (isLoading) return <p>Loading exams...</p>;
  if (isError) return <p>Error fetching exams.</p>;

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <SelectDropdown
          options={filters}
          value={selectedFilter}
          onChange={filterChangeHandler}
          className="w-[150px]"
        />
      </div>
      {filteredExams && filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExams.map((exam: ExamReponse) => (
            <StudentExamCard key={exam.id} {...exam} />
          ))}
        </div>
      ) : (
        <div className="text-center flex items-center justify-center min-h-[500px]">
          <p className="text-2xl text-foreground">No exams found.</p>
        </div>
      )}
    </>
  );
};

export default StudentExam;
