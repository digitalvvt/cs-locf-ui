import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { ICoPoMapping } from "@/api/api/program-outcomes-api";

const strengthLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
};

const strengthColors = {
  1: "bg-red-200 text-red-800",
  2: "bg-yellow-200 text-yellow-800",
  3: "bg-green-200 text-green-800",
};
// Group the data by CO label
const groupByCO = (data: ICoPoMapping[]) => {
  const grouped: Record<string, ICoPoMapping[]> = {};
  data.forEach((item) => {
    if (!grouped[item.co_label]) {
      grouped[item.co_label] = [];
    }
    grouped[item.co_label].push(item);
  });
  return grouped;
};

const MappingItem = ({ data }: { data: ICoPoMapping[] }) => {
  const filteredData = data.filter(
    (item) => item.co_label !== "TOTAL" && item.co_label !== "AVERAGE"
  );
  const groupedData = groupByCO(filteredData);

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([coLabel, items]) => {
        const coDescription = items[0].course_outcome_content;

        return (
          <div key={coLabel} className="space-y-3 p-4 border rounded-md shadow-sm bg-white">
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="text-lg font-semibold">{coLabel}</h3>
              <p className="text-sm text-gray-700">{coDescription}</p>
            </div>

            {items.map((item, index) => {
              const [isChecked, setIsChecked] = useState(true);
              const [strength, setStrength] = useState(item.value || 2);
              const [justification, setJustification] = useState(item.justification || "");

              return (
                <div key={`${item.id}-${index}`} className="flex flex-col gap-2 p-3 rounded border">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => setIsChecked(!isChecked)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.po_label}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {item.program_outcome_description}
                      </p>
                      {isChecked && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Strength:</Label>
                            <Select
                              value={strength.toString()}
                              onValueChange={(value) => setStrength(parseInt(value))}
                            >
                              <SelectTrigger className="w-[7.5rem] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="w-[7.5rem]">
                                <SelectItem value="1">1 - Low</SelectItem>
                                <SelectItem value="2">2 - Medium</SelectItem>
                                <SelectItem value="3">3 - High</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge className={strengthColors[strength as 1 | 2 | 3]}>
                              {strengthLabels[strength as 1 | 2 | 3]}
                            </Badge>
                          </div>

                          {/* ✅ Justification per item */}
                          <div>
                            <Label className="text-xs">Justification</Label>
                            <Textarea
                              disabled
                              value={justification}
                              onChange={(e) => setJustification(e.target.value)}
                              className="mt-1 text-sm"
                              rows={2}
                              placeholder="Explain why this CO maps to this PO..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MappingItem;
