import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SemesterStructure {
  semester_number: number;
  semester_name: string;
  semester_type: 'odd' | 'even' | 'summer' | 'winter';
}

interface YearStructure {
  year_number: number;
  semesters: SemesterStructure[];
}

interface StructurePreviewStepProps {
  yearStructures: YearStructure[];
  onUpdateSemester: (yearIndex: number, semesterIndex: number, field: keyof SemesterStructure, value: any) => void;
}

export const StructurePreviewStep = ({ yearStructures }: StructurePreviewStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Structure Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {yearStructures.map((year, yearIndex) => (
            <div key={year.year_number} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Year {year.year_number}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {year.semesters.map((semester, semesterIndex) => (
                  <div key={semester.semester_number} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{semester.semester_name}</span>
                      <Badge variant={semester.semester_type === 'odd' ? 'default' : 'secondary'}>
                        {semester.semester_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Semester {semester.semester_number}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {yearStructures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Complete program details to preview the structure</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
