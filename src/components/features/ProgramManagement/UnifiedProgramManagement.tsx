import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramManagementHeader } from "./ProgramManagementHeader";
import { Program, ProgramManagementTabs } from "./ProgramManagementTabs";
import { Button } from "@/components/ui/button";
import { ProgramBuilder } from "./ProgramBuilder";
import { useGetProgramsQuery } from "@/api/api/program-management-api";
import { useGetYearsListQuery } from "@/api/api/year";
import { useNavigate } from "react-router-dom";

interface UnifiedProgramManagementProps {
  organizationId: string;
}

interface IYearsSelectOptionProps {
  value: string;
  label: string;
}
export const UnifiedProgramManagement = ({ organizationId }: UnifiedProgramManagementProps) => {
  const navigate = useNavigate();
  const subjectIdsString = localStorage.getItem("subjectIds");
  const userString = localStorage.getItem("userDetails");
  const user = userString ? JSON.parse(userString) : null;

  const programIdsString = user?.programIds || "";

  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const {
    data: programsList,
    isLoading,
    error,
  } = useGetProgramsQuery(
    subjectIdsString || programIdsString
      ? { subjectIds: subjectIdsString || undefined, programIds: programIdsString || undefined }
      : undefined
  );

  const { data: yearsList } = useGetYearsListQuery();
  const [yearsSelectOption, setYearsSelectOption] = useState<IYearsSelectOptionProps[]>([]);

  useEffect(() => {
    if (yearsList) {
      const options = yearsList.map((year) => ({
        value: year.id.toString(),
        label: year.year,
      }));
      setYearsSelectOption(options);
    }
  }, [yearsList]);

  if (isLoading) return <p>Loading programs...</p>;
  if (error) return <p>Error loading programs!</p>;

  const handleProgramCreated = () => {
    setShowBuilder(false);
    // Refresh programs list or update state as needed
  };

  const handleCreateProgram = () => {
    setShowBuilder(true);
  };

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setActiveTab("academic-structure");
    // if (onProgramSelect) {
    //   onProgramSelect(program); // Notify parent (UnifiedProgramManagement) of program selection
    // }
    navigate(`/program-outcomes/${program.id}`);
  };

  const handleProgramUpdate = () => {
    // loadPrograms();
    setSelectedProgram(null);
  };

  if (showBuilder) {
    return (
      <div className="space-y-6">
        <ProgramManagementHeader
          title="Create New Program"
          description="Build a complete academic program structure"
          showCreateButton={false}
          onCreateProgram={() => {}}
        />
        {showBuilder && (
          <ProgramBuilder
            organizationId={organizationId}
            onComplete={handleProgramCreated}
            yearsSelectOption={yearsSelectOption}
          />
        )}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <ProgramManagementHeader
        title="Program Management"
        description="Manage programs, courses, and upload syllabi in a single place"
        showCreateButton={false}
        onCreateProgram={handleCreateProgram}
      />
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Programs
          </TabsTrigger>
          {/* <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Syllabus Upload
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="programs">
          <div className="space-y-3">
            <ProgramManagementHeader onCreateProgram={handleCreateProgram} />
            <ProgramManagementTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              programs={programsList || []}
              selectedProgram={selectedProgram}
              onProgramSelect={handleProgramSelect}
              onProgramUpdate={handleProgramUpdate}
              onCreateProgram={handleCreateProgram}
            />
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <Card className="mt-8">
            <CardContent className="py-8 text-center text-gray-700">
              Course list for selected program will appear here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus">
          <Card className="mt-8">
            <CardContent className="py-8 text-center text-gray-700">
              Syllabus upload interface goes here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
