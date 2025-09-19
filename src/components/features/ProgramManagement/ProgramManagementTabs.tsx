import React from "react";
import { ProgramList } from "./ProgramList";

export interface Program {
  id: string;
  name: string;
  code: string;
  durationYears: number;
  programType: string;
  description?: string;
  organization_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: string;
  totalSemesters?: number;
  accreditation_details?: any;
}

interface ProgramManagementTabsProps {
  programs: Program[];
  selectedProgram: Program | null;
  onProgramSelect: (program: Program) => void;
  onProgramUpdate: () => void;
  onCreateProgram: () => void;
}

export const ProgramManagementTabs = ({
  programs,
  selectedProgram,
  onProgramSelect,
  onProgramUpdate,
  onCreateProgram,
}: ProgramManagementTabsProps) => {
  return (
    <div>
      <ProgramList programs={programs} onProgramSelect={onProgramSelect} onProgramUpdate={onProgramUpdate} />
    </div>
  );
};
