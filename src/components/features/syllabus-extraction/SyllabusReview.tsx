import React from "react";
import { useParams } from "react-router-dom";
import { ReviewHeader } from "./ReviewHeader";
import { SyllabusMetadataSection } from "./SyllabusMetadataSection";
import { useGetSyllabusExtractedDataByProgramIdQuery } from "@/api/api/program-outcomes-api";
import { CourseOutcomesSection } from "./CourseOutcomesSection";
import { UnitStructureSection } from "./UnitStructureSection";
import { CoPOMappingSection } from "./CoPOMappingSection";

const SyllabusReview = () => {
  const { fileId } = useParams();

  const {
    data: syllabusData,
    isLoading,
    isError,
    error,
  } = useGetSyllabusExtractedDataByProgramIdQuery(fileId ?? "");

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        Error: {(error as any)?.data?.message || "Failed to load data"}
      </p>
    );

  const courseOutcomes = syllabusData?.processing_results?.course_outcomes || [];
  const units = syllabusData?.processing_results?.units || [];
  const course = syllabusData?.processing_results?.course;
  const semester = syllabusData?.processing_results?.semester;
  const mappingData = syllabusData?.processing_results?.mapping_with_programme_outcomes;

  return (
    <div className="space-y-6">
      <ReviewHeader />
      <SyllabusMetadataSection course={course} semester={semester} />
      <CourseOutcomesSection data={courseOutcomes} />
      <UnitStructureSection unit={units} />
      <CoPOMappingSection mappingData={mappingData} />
    </div>
  );
};

export default SyllabusReview;
