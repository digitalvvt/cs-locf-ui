import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";

// Define the props type correctly
interface CoPOMappingSectionProps {
  mappingData: Record<string, Record<string, number>>;
  onUpdateMapping?: (coCode: string, type: "po" | "pso", outcome: string, value: number) => void;
  canEdit?: boolean;
}

export const CoPOMappingSection: React.FC<CoPOMappingSectionProps> = ({
  mappingData,
  onUpdateMapping = () => {},
  canEdit = true,
}) => {
  const strengthItems = [
    { value: "0", label: "None" },
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          CO-PO Mapping Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(mappingData).map(([co, outcomes]) => {
            const isEditable = canEdit && co !== "TOTAL" && co !== "AVERAGE";

            return (
              <div key={co} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4 font-semibold">{co}</div>

                <div className="grid gap-4">
                  {/* PO section */}
                  <div>
                    <Label className="text-sm font-medium">Program Outcomes (PO)</Label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                      {Object.entries(outcomes)
                        .filter(([k]) => k.startsWith("PO"))
                        .map(([po, strength]) => (
                          <div key={po} className="text-center">
                            <Label className="text-xs">{po}</Label>
                            {isEditable ? (
                              <Select
                                value={Math.round(strength).toString()}
                                onValueChange={(value) => onUpdateMapping(co, "po", po, parseInt(value))}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {strengthItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="text-sm font-medium py-1 px-2 border rounded bg-gray-100 text-gray-800 min-w-[40px]">
                                {strength}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* PSO section */}
                  <div>
                    <Label className="text-sm font-medium">Program Specific Outcomes (PSO)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Object.entries(outcomes)
                        .filter(([k]) => k.startsWith("PSO"))
                        .map(([pso, strength]) => (
                          <div key={pso} className="text-center">
                            <Label className="text-xs">{pso}</Label>
                            {isEditable ? (
                              <Select
                                value={Math.round(strength).toString()}
                                onValueChange={(value) => onUpdateMapping(co, "pso", pso, parseInt(value))}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {strengthItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="text-sm font-medium py-1 px-2 border rounded bg-gray-100 text-gray-800 min-w-[40px]">
                                {strength}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
