import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface Course {
  type: string;
  title: string;
  common_to: string;
}

interface SyllabusMetadataSectionProps {
  course: Course;
  semester: number;
}

export const SyllabusMetadataSection: React.FC<SyllabusMetadataSectionProps> = ({ course, semester }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="course_title">Course Title</Label>
            <Input id="course_title" value={course.title} disabled />
          </div>
          {/* <div>
            <Label htmlFor="course_type">Course Type</Label>
            <Input id="course_type" value={course.type} disabled />
          </div> */}
          <div>
            <Label htmlFor="common_to">Common Code</Label>
            <Input id="common_to" value={course.common_to} disabled />
          </div>
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input id="semester" value={semester} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
