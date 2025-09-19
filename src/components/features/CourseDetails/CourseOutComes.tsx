import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Target } from "lucide-react";
import { useGetOutComesbyCourseIdQuery } from "@/api/api/program-outcomes-api";

interface CourseOutcomesProps {
  courseId: string;
}

const CourseOutcomes: React.FC<CourseOutcomesProps> = ({ courseId }) => {
  const {
    data: outcomes = [],
    isLoading: isCoursesLoading,
    error: courseError,
  } = useGetOutComesbyCourseIdQuery(courseId!, {
    skip: !courseId,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Course Outcomes
            </CardTitle>
            <CardDescription>Define the learning outcomes for this course</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {outcomes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outcomes.map((outcome) => (
                <TableRow key={outcome.id}>
                  <TableCell className="font-medium">{outcome.code}</TableCell>
                  <TableCell>{outcome.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Outcomes</h3>
            <p className="text-gray-600 mb-4">
              Define learning outcomes for this course or upload a syllabus to extract them automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseOutcomes;
