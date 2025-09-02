"use client";

import SelectDropdown from "@/components/Common/SelectDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { GenericType } from "@/types";
import { Student } from "@/types/admin/exam-analytics";

type StudentDataProps = {
  totalMarks: number;
  title?: string;
  subjects: string[];
  students: Student[];
  dropdownOptions?: GenericType[];
  selectedOption?: GenericType | null;
  onChangeOption?: (option: GenericType) => void;
};

const findMarksPercentage = (totalMarks: number, marks: number): string => {
  const percentage = (marks / totalMarks) * 100;
  return `${percentage.toFixed(2)}%`;
};

export default function StudentResultTable({
  totalMarks,
  title = "Student Results",
  subjects,
  students,
  dropdownOptions,
  selectedOption,
  onChangeOption,
}: StudentDataProps) {
  const filteredStudents = useMemo(() => {
    if (!selectedOption || selectedOption.id === 0) return students;

    const ranges: Record<number, [number, number]> = {
      1: [0, 30],
      2: [31, 50],
      3: [51, 70],
      4: [71, 100],
    };

    const [min, max] = ranges[selectedOption.id];

    return students.filter((student) => {
      const percent = (student.total / totalMarks) * 100;
      return percent >= min && percent <= max;
    });
  }, [students, selectedOption, totalMarks]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="w-full sm:w-40">
          <SelectDropdown
            options={dropdownOptions}
            value={selectedOption}
            onChange={onChangeOption}
            placeholder="Select range"
            className="w-[180px]"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {/* ✅ This wrapper is CRUCIAL */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-background">
                <TableRow>
                  <TableHead className="text-center border-b bg-background w-16">Sl.No</TableHead>
                  <TableHead className="border-b bg-background min-w-[150px]">
                    Student Name
                  </TableHead>
                  {subjects?.map((subject) => (
                    <TableHead
                      key={subject}
                      title={subject}
                      className="text-center border-b bg-background w-40 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {subject}
                    </TableHead>
                  ))}
                  <TableHead className="text-center border-b bg-background w-20">Total</TableHead>
                  <TableHead className="text-center border-b bg-background w-28">Mark %</TableHead>
                  <TableHead className="text-center border-b bg-background w-24">
                    Accuracy
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents?.length > 0 ? (
                  filteredStudents?.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center w-16">{index + 1}</TableCell>
                      <TableCell className="min-w-[150px]">{student.name}</TableCell>
                      {subjects?.map((subject) => (
                        <TableCell key={subject} className="text-center w-40">
                          {student.marks[subject] ?? "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-center w-20">{student.total}</TableCell>
                      <TableCell className="text-center w-28">
                        {findMarksPercentage(totalMarks, student.total)}
                      </TableCell>
                      <TableCell className="text-center w-24">{student.accuracy}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={subjects?.length + 4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
