import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/hooks/use-toast";
import { ProgramDetailsStep } from "./components/ProgramDetailsStep";
import { StructurePreviewStep } from "./components/StructurePreviewStep";
import { useCreateCompleteProgramMutation } from "@/api/api/program-management-api";
interface IYearsSelectOptionProps {
  value: string;
  label: string;
}

interface ProgramBuilderProps {
  organizationId: string;
  onComplete?: () => void;
  yearsSelectOption: IYearsSelectOptionProps[];
}

interface ProgramData {
  name: string;
  code: string;
  programType: "undergraduate" | "postgraduate" | "diploma" | "certificate" | "doctoral";
  durationYears: number;
  totalSemesters: number;
  description?: string;
  academic_year_id: string;
}

interface SemesterStructure {
  semester_number: number;
  semester_name: string;
  semester_type: "odd" | "even" | "summer" | "winter";
}

interface YearStructure {
  year_number: number;
  semesters: SemesterStructure[];
}

export const ProgramBuilder = ({
  organizationId,
  onComplete,
  yearsSelectOption,
}: ProgramBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [createCompleteProgram, { isLoading: isCreating }] = useCreateCompleteProgramMutation();
  const [programData, setProgramData] = useState<ProgramData>({
    name: "",
    code: "",
    programType: "undergraduate",
    durationYears: 4,
    totalSemesters: 8,
    description: "",
    academic_year_id: "",
  });
  const [yearStructures, setYearStructures] = useState<YearStructure[]>([]);

  const { toast } = useToast();

  const steps = [
    { title: "Program Details", description: "Basic program information" },
    { title: "Structure Preview", description: "Review academic structure" },
    { title: "Create Program", description: "Finalize and create" },
  ];

  const generateYearStructures = (duration: number, totalSemesters: number) => {
    const years: YearStructure[] = [];
    const semestersPerYear = Math.ceil(totalSemesters / duration);
    let semesterCounter = 1;

    for (let year = 1; year <= duration; year++) {
      const semesters: SemesterStructure[] = [];

      for (
        let semInYear = 1;
        semInYear <= semestersPerYear && semesterCounter <= totalSemesters;
        semInYear++
      ) {
        const semesterType = semesterCounter % 2 === 1 ? "odd" : "even";

        semesters.push({
          semester_number: semesterCounter,
          semester_name: `Semester ${semesterCounter}`,
          semester_type: semesterType as "odd" | "even",
        });

        semesterCounter++;
      }

      years.push({
        year_number: year,
        semesters,
      });
    }

    return years;
  };

  const handleProgramDataChange = (data: Partial<ProgramData>) => {
    setProgramData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const structures = generateYearStructures(
        programData.durationYears,
        programData.totalSemesters
      );
      setYearStructures(structures);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Mock function to create a program - replace with actual API call
  // const createCompleteProgram = async (
  //   orgId: string,
  //   data: ProgramData,
  //   duration: number
  // ) => {
  //   // Simulate API call
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log('Creating program:', { orgId, data, duration });
  //       resolve({ success: true, programId: 'prog_' + Math.random().toString(36).substr(2, 9) });
  //     }, 1000);
  //   });
  // };

  const handleCreateProgram = async () => {
    if (!organizationId) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }

    if (!programData.name || !programData.code) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createCompleteProgram({
        organizationId,
        code: programData.code,
        name: programData.name,
        description: programData.description,
        totalSemesters: programData.totalSemesters,
        programType: programData.programType,
        status: "active",
        durationYears: programData.durationYears,
        academic_year_id: Number(programData.academic_year_id),
      }).unwrap();

      toast({
        title: "Success!",
        description: `Program "${programData.name}" has been created successfully.`,
        variant: "default",
      });

      setCurrentStep(3);
      onComplete?.();
      return result;
    } catch (error) {
      console.error("Failed to create program:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create program. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return (
        programData.name &&
        programData.code &&
        programData.durationYears > 0 &&
        programData.totalSemesters > 0
      );
    }
    return true;
  };

  useEffect(() => {
    if (programData.durationYears > 0 && programData.totalSemesters > 0) {
      const structures = generateYearStructures(
        programData.durationYears,
        programData.totalSemesters
      );
      setYearStructures(structures);
    } else {
      console.log("Skipping year structure generation - missing duration or semesters");
    }
  }, [programData.durationYears, programData.totalSemesters]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProgramDetailsStep
            programData={programData}
            onProgramDataChange={handleProgramDataChange}
            yearsSelectOption={yearsSelectOption}
          />
        );
      case 1:
        return (
          <StructurePreviewStep
            yearStructures={yearStructures}
            onUpdateSemester={() => {}} // Not implemented in this version
          />
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Create Your Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                  <div className="space-y-1 text-blue-800">
                    <p>
                      <strong>Name:</strong> {programData.name}
                    </p>
                    <p>
                      <strong>Code:</strong> {programData.code}
                    </p>
                    <p>
                      <strong>Type:</strong> {programData.programType}
                    </p>
                    <p>
                      <strong>Duration:</strong> {programData.durationYears} years
                    </p>
                    <p>
                      <strong>Total Semesters:</strong> {programData.totalSemesters}
                    </p>
                    {programData.description && (
                      <p>
                        <strong>Description:</strong> {programData.description}
                      </p>
                    )}
                    <p>
                      <strong>Academic Year:</strong> {programData.academic_year_id}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCreateProgram}
                  disabled={isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? "Creating Program..." : "Create Program"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>🎉 Program Created Successfully</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg text-green-800 text-center">
                  <p>
                    <span className="font-semibold">{programData.name}</span> (
                    {programData.durationYears} years, {programData.totalSemesters} semesters)
                  </p>
                  <p className="text-sm mt-1 mb-1">All academic years and semesters are set up!</p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Build Another Program
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Program Builder</CardTitle>
          <Stepper currentStep={currentStep <= 2 ? currentStep : 2} steps={steps} />
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          {currentStep < 2 && (
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()}>
                {currentStep === 1 ? "Review & Create" : "Next"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
