import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface RawUnit {
  title: string;
  content: string;
  unit_number: number;
  hours_allocated: number;
}

interface UnitStructureSectionProps {
  unit: RawUnit[];
}

export const UnitStructureSection: React.FC<UnitStructureSectionProps> = ({ unit }) => {
  const mappedUnits = unit && unit?.map((u) => ({
    unit_no: u.unit_number.toString(),
    title: u.title,
    topics: u.content
      .split(/[-–.]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 3),
    hours: u.hours_allocated.toString(),
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Unit Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mappedUnits.map((unit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline">Unit {unit.unit_no}</Badge>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Unit Number</Label>
                    <Input value={unit.unit_no} disabled />
                  </div>
                  <div>
                    <Label>Unit Title</Label>
                    <Input value={unit.title} disabled />
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <Input value={unit.hours} disabled />
                  </div>
                </div>

                <div>
                  <Label>Topics (one per line)</Label>
                  <Textarea value={unit.topics.join("\n")} disabled rows={4} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
