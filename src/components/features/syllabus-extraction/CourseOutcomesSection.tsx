import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CourseOutcome {
  CO?: string;
  description: string;
}

interface CourseOutcomesSectionProps {
  data: CourseOutcome[];
}

export const CourseOutcomesSection: React.FC<CourseOutcomesSectionProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((outcome, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="default">AI Extracted</Badge>
              </div>

              <div className="grid gap-3">
                <div>
                  <Label>Outcome Code</Label>
                  <Input value={outcome.CO} disabled />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={outcome.description} disabled rows={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
