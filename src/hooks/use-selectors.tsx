import { useGetProgramsQuery } from "@/api/api/program-management-api";
import { GenericType } from "@/types";
import React, { useEffect, useState } from "react";

const useSelectorsHook = () => {
  const [programData, setProgramData] = useState<GenericType[]>([]);

  const subjectIdsString = localStorage.getItem("subjectIds");
  const userString = localStorage.getItem("userDetails");
  const user = userString ? JSON.parse(userString) : null;

  const programIdsString = user?.programIds || "";
  const {
    data: programsList,
    isLoading,
    error,
  } = useGetProgramsQuery(
    subjectIdsString || programIdsString
      ? { subjectIds: subjectIdsString || undefined, programIds: programIdsString || undefined }
      : undefined
  );

  useEffect(() => {
    if (programsList && Array.isArray(programsList)) {
      const filtered = programsList.map((program: any) => ({
        id: program.id,
        name: program.name,
      }));

      setProgramData(filtered);
    }
  }, [programsList]);
  return {
    programData,
  };
};

export default useSelectorsHook;
