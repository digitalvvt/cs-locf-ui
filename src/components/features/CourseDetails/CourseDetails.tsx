import React from "react";
import { useParams } from "react-router-dom";
import CourseDetailTabs from "./CourseDetailTabs";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>(); // ✅ Gets the ID from URL


  return (
    <div>
      <CourseDetailTabs courseId={courseId || ""} />
    </div>
  );
};

export default CourseDetails;
