import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopoMappingInterfaceSection from "./CopoMappingInterfaceSection";
import { useGetCopoMappingbyCourseIdQuery } from "@/api/api/program-outcomes-api";
import { CoPOMappingMatrix } from "./CoPOMappingMatrix";

interface CoPOMappingProps {
  courseId: string;
}

const CoPOMapping: React.FC<CoPOMappingProps> = ({ courseId }) => {
  const {
    data: CopoMappingInterface = [],
    isLoading: isCoursesLoading,
    error: courseError,
  } = useGetCopoMappingbyCourseIdQuery(courseId!, {
    skip: !courseId,
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mapping" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mapping">Mapping Interface</TabsTrigger>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
          {/* <TabsTrigger value="validation">AI Validation</TabsTrigger> */}
        </TabsList>
        <TabsContent value="mapping" className="space-y-6">
          <CopoMappingInterfaceSection data={CopoMappingInterface} />
        </TabsContent>
        <TabsContent value="matrix">
          <CoPOMappingMatrix data={CopoMappingInterface} />
        </TabsContent>
        {/* <TabsContent value="validation">validation Section</TabsContent> */}
      </Tabs>
    </div>
  );
};

export default CoPOMapping;
