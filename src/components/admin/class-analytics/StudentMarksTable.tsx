"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { GenericType } from "@/types";
import { Student } from "@/types/admin/exam-analytics";

type StudentMarksTableProps = {
  title?: string;
  subjects?: string[];
  students?: Student[];
  dropdownOptions?: GenericType[];
  selectedOption?: GenericType | null;
  onSelectOption?: (option: GenericType) => void;
};

export default function StudentMarksTable({
  title,
  subjects,
  students,
  dropdownOptions,
  selectedOption,
  onSelectOption,
}: StudentMarksTableProps) {
  const averageMarks = useMemo(() => {
    const subjectSums: Record<string, number> = {};
    let totalSum = 0;

    subjects?.forEach((subject) => {
      subjectSums[subject] = 0;
    });

    students?.forEach((student) => {
      subjects?.forEach((subject) => {
        subjectSums[subject] += student.marks?.[subject] ?? 0;
      });
      totalSum += student.total ?? 0;
    });

    const count = students?.length || 1;
    const averages: Record<string, number> = {};

    subjects?.forEach((subject) => {
      averages[subject] = Math.round(subjectSums[subject] / count);
    });

    averages["total"] = Math.round(totalSum / count);
    return averages;
  }, [students, subjects]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="w-full sm:w-40">
          <SelectDropdown
            options={dropdownOptions}
            value={selectedOption}
            onChange={onSelectOption}
            placeholder="Select type"
            className="w-[180px]"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student, index) => (
                  <TableRow key={`${student.slNo}-${index}`}>
                    <TableCell className="text-center w-16">{index + 1}</TableCell>
                    <TableCell className="min-w-[150px]">{student.name}</TableCell>
                    {subjects?.map((subject) => (
                      <TableCell key={subject} className="text-center w-40">
                        {student.marks?.[subject] ?? "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center w-20">{student.total ?? "-"}</TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-muted font-semibold sticky bottom-0 z-10">
                  <TableCell className="w-16" />
                  <TableCell className="min-w-[150px]">Average Marks</TableCell>
                  {subjects?.map((subject) => (
                    <TableCell className="text-center w-40" key={subject}>
                      {averageMarks[subject] ?? "-"}
                    </TableCell>
                  ))}
                  <TableCell className="text-center w-20">{averageMarks.total ?? "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
