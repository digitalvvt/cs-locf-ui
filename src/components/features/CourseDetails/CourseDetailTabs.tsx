import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseOutcomes from "./CourseOutComes";
import CoPOMapping from "./CopoMapping";
import QuestionBank from "./qBank";
import ComingSoon from "@/pages/ComingSoon";

interface CourseDetailTabsProps {
  courseId: string;
}

const CourseDetailTabs = ({ courseId }: CourseDetailTabsProps) => {
  return (
    <div>
      <Tabs defaultValue="outcomes" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="mapping">CO-PO Mapping</TabsTrigger>
          {/* <TabsTrigger value="questions">Question Bank</TabsTrigger> */}
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="attainment">Attainment</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes">
          <CourseOutcomes courseId={courseId} />
        </TabsContent>

        <TabsContent value="mapping">
          {/* <CoPOMapping courseId={courseId} canEdit={canEdit} /> */}
          <CoPOMapping courseId={courseId} />
        </TabsContent>

        {/* <TabsContent value="questions">
          <QuestionBank />
        </TabsContent> */}

        <TabsContent value="assessments">
          <ComingSoon />
        </TabsContent>

        <TabsContent value="attainment">
          <ComingSoon />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetailTabs;
