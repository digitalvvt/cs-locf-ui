import {
  useGetProgramAndSectionsQuery,
  useLazyGetOverallSectionWiseResultQuery,
} from "@/api/api/admin/exam-analytics";
import SelectDropdown from "@/components/Common/SelectDropdown";
import React, { useEffect, useMemo, useState } from "react";
import StudentMarksTable from "./StudentMarksTable";
import { GenericType } from "@/types";
import DifficultyMarksTable from "./DifficultyAnalysis";
import ChapterPerformanceCard from "./ChapterTopicsAnalysis";
import CoMarksDistribution from "./CoMarksDistrubution";
import StudentResultTable from "./StudentResultTable";

const topDropdownOptions: GenericType[] = [
  { id: 0, name: "All" },
  { id: 1, name: "Top 10" },
];

const leastDropdownOptions: GenericType[] = [
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

const ClassAnalytics = () => {
  const [programs, setPrograms] = useState<GenericType[]>([]);
  const [years, setYears] = useState<GenericType[]>([]);
  const [semesters, setSemesters] = useState<GenericType[]>([]);
  const [sections, setSections] = useState<GenericType[]>([]);

  const [selectedProgram, setSelectedProgram] = useState<GenericType | null>(null);
  const [selectedYear, setSelectedYear] = useState<GenericType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<GenericType | null>(null);
  const [selectedSection, setSelectedSection] = useState<GenericType | null>(null);
  const [selectedOption, setSelectedOption] = useState<GenericType | null>(dropdownOptions[0]);

  const [topStudents, setTopStudents] = useState<GenericType>(topDropdownOptions[0]);
  const [leastStudents, setLeastStudents] = useState<GenericType>(leastDropdownOptions[0]);

  const userData = localStorage.getItem("userDetails"); // or whatever key you're storing it as

  let subjectIdsString = "";
  let programIdsString = "";
  if (userData) {
    const parsedUser = JSON.parse(userData);
    subjectIdsString = parsedUser.subjectIds ?? "";
    programIdsString = parsedUser.programIds ?? "";
  }

  const hasAnyIds =
    (subjectIdsString && subjectIdsString.trim().length > 0) ||
    (programIdsString && programIdsString.trim().length > 0);

  const { data: programSectionData } = useGetProgramAndSectionsQuery(
    hasAnyIds
      ? {
          subjectIds: subjectIdsString || undefined,
          programIds: programIdsString || undefined,
        }
      : undefined,
    {
      // skip when there's no userData or no IDs to filter by
      skip: !userData,
    }
  );

  const [triggerSectionWiseResult, { data: resultData, isFetching, isError }] =
    useLazyGetOverallSectionWiseResultQuery();

  // Load Programs
  useEffect(() => {
    if (programSectionData?.length > 0) {
      const formatted = programSectionData.map((program) => ({
        id: program.id,
        name: program.name,
      }));
      setPrograms(formatted);
    }
  }, [programSectionData]);

  // Load Years
  useEffect(() => {
    if (selectedProgram) {
      const found = programSectionData?.find((p) => p.id === selectedProgram.id);
      if (found) {
        const mappedYears = found.years.map((y) => ({
          id: y.year,
          name: `Year ${y.year}`,
        }));
        setYears(mappedYears);
      }
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSection(null);
      setSemesters([]);
      setSections([]);
    }
  }, [selectedProgram]);

  // Load Semesters
  useEffect(() => {
    if (selectedProgram && selectedYear) {
      const program = programSectionData?.find((p) => p.id === selectedProgram.id);
      const year = program?.years.find((y) => y.year === selectedYear.id);
      if (year) {
        const mappedSemesters = year.semesters.map((s) => ({
          id: s.semester,
          name: `Semester ${s.semester}`,
        }));
        setSemesters(mappedSemesters);
      }
      setSelectedSemester(null);
      setSelectedSection(null);
      setSections([]);
    }
  }, [selectedYear]);

  // Load Sections
  useEffect(() => {
    if (selectedProgram && selectedYear && selectedSemester) {
      const program = programSectionData?.find((p) => p.id === selectedProgram.id);
      const year = program?.years.find((y) => y.year === selectedYear.id);
      const semester = year?.semesters.find((s) => s.semester === selectedSemester.id);
      if (semester) {
        const mappedSections = semester.sections.map((section) => ({
          id: section.id,
          name: section.name,
        }));
        setSections(mappedSections);
      }
      setSelectedSection(null);
    }
  }, [selectedSemester]);

  // Apply Filters
  const handleApplyFilters = () => {
    if (selectedProgram && selectedYear && selectedSemester && selectedSection) {
      const filterPayload = {
        programId: selectedProgram.id,
        year: selectedYear.id,
        semester: selectedSemester.id,
        section: selectedSection.id,
      };
      console.log("Apply Filters →", filterPayload);
      triggerSectionWiseResult(filterPayload);
    } else {
      alert("Please select all fields before applying filters.");
    }
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSelectedProgram(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setYears([]);
    setSemesters([]);
    setSections([]);
  };

  // Top Students Filter
  const topStudentsData = useMemo(() => {
    if (!resultData?.students) return [];
    if (topStudents?.id === 1) {
      return [...resultData.students].sort((a, b) => b.total - a.total).slice(0, 10);
    }
    return resultData.students;
  }, [resultData, topStudents]);

  // Least Students Filter
  const leastStudentsData = useMemo(() => {
    if (!resultData?.students) return [];
    const sorted = [...resultData.students].sort((a, b) => a.total - b.total);
    return leastStudents?.id === 1 ? sorted.slice(0, 10) : sorted;
  }, [resultData, leastStudents]);

  return (
    <>
      <div className="mx-auto space-y-6">
        {/* First Row: Program, Year, Clear Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectDropdown
            options={programs}
            value={selectedProgram}
            onChange={setSelectedProgram}
            placeholder="Select Program"
          />
          <SelectDropdown
            options={years}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Select Year"
            disabled={!selectedProgram}
          />
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 hidden sm:block text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full h-full"
          >
            Clear Filters
          </button>
        </div>

        {/* Second Row: Semester, Section, Apply Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectDropdown
            options={semesters}
            value={selectedSemester}
            onChange={setSelectedSemester}
            placeholder="Select Semester"
            disabled={!selectedYear}
          />
          <SelectDropdown
            options={sections}
            value={selectedSection}
            onChange={setSelectedSection}
            placeholder="Select Section"
            disabled={!selectedSemester}
          />
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 sm:hidden text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full h-full"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full h-full"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {resultData ? (
        <>
          <div className="mt-5">
            {resultData?.chapterAnalysis && resultData.chapterAnalysis.length > 0 && (
              <>
                <div className="text-lg font-semibold !mb-2">Chapter and Topic Analysis</div>
                <ChapterPerformanceCard chapterData={resultData?.chapterAnalysis} />
              </>
            )}
          </div>

          {/* Tables */}
          {resultData && (
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-1 mt-10 mb-10">
              <StudentMarksTable
                title="Top Students List"
                subjects={resultData.subjects}
                students={topStudentsData}
                dropdownOptions={topDropdownOptions}
                selectedOption={topStudents}
                onSelectOption={setTopStudents}
              />
              <StudentMarksTable
                title="Least Students List"
                subjects={resultData.subjects}
                students={leastStudentsData}
                dropdownOptions={leastDropdownOptions}
                selectedOption={leastStudents}
                onSelectOption={setLeastStudents}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
            {resultData?.questionDistribution && resultData.questionDistribution.length > 0 && (
              <DifficultyMarksTable data={resultData?.questionDistribution} />
            )}

            {resultData?.CourseOutComeAnalysis && resultData.CourseOutComeAnalysis?.length > 0 && (
              <CoMarksDistribution data={resultData?.CourseOutComeAnalysis} />
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] sm:min-w-full">
              <StudentResultTable
                totalMarks={57}
                subjects={resultData?.subjects}
                students={resultData?.students}
                dropdownOptions={dropdownOptions}
                selectedOption={selectedOption}
                onChangeOption={setSelectedOption}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh] text-black text-xl">
          Apply filters above to view the analysis.
        </div>
      )}
    </>
  );
};

export default ClassAnalytics;
