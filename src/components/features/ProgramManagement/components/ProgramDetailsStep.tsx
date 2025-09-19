import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IYearsSelectOptionProps {
  value: string;
  label: string;
}

interface ProgramData {
  name: string;
  code: string;
  programType: 'undergraduate' | 'postgraduate' | 'diploma' | 'certificate' | 'doctoral';
  durationYears: number;
  totalSemesters: number;
  description?: string;
  academic_year_id: string;
}

interface ProgramDetailsStepProps {
  programData: ProgramData;
  onProgramDataChange: (data: Partial<ProgramData>) => void;
  yearsSelectOption: IYearsSelectOptionProps[];
}

export const ProgramDetailsStep = ({ programData, onProgramDataChange, yearsSelectOption }: ProgramDetailsStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="program-name">Program Name *</Label>
            <Input
              id="program-name"
              value={programData.name}
              onChange={(e) => onProgramDataChange({ name: e.target.value })}
              placeholder="e.g., Bachelor of Technology"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="program-code">Program Code *</Label>
            <Input
              id="program-code"
              value={programData.code}
              onChange={(e) => onProgramDataChange({ code: e.target.value })}
              placeholder="e.g., B.Tech"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="program-type">Program Type *</Label>
          <Select 
            value={programData.programType} 
            onValueChange={(value: any) => onProgramDataChange({ programType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select program type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="doctoral">Doctoral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration-years">Duration (Years)</Label>
            <Input
              id="duration-years"
              type="number"
              min="1"
              max="10"
              value={programData.durationYears}
              onChange={(e) => onProgramDataChange({ durationYears: parseInt(e.target.value) || 4 })}
            />
          </div>
          
          <div>
            <Label htmlFor="total-semesters">Total Semesters</Label>
            <Input
              id="total-semesters"
              type="number"
              min="1"
              max="20"
              value={programData.totalSemesters}
              onChange={(e) => onProgramDataChange({ totalSemesters: parseInt(e.target.value) || 8 })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="academic-year">Academic Year *</Label>
          <select
            id="academic-year"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={programData.academic_year_id}
            onChange={(e) => onProgramDataChange({ academic_year_id: e.target.value })}
            required
          >
            <option value="">Select Academic Year</option>
            {yearsSelectOption.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={programData.description || ''}
            onChange={(e) => onProgramDataChange({ description: e.target.value })}
            placeholder="Brief description of the program..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
