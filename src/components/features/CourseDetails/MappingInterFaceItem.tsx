import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

// Dummy labels and colors
const strengthLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
};

const strengthColors = {
  1: "bg-yellow-200 text-yellow-800",
  2: "bg-blue-200 text-blue-800",
  3: "bg-green-200 text-green-800",
};

const MappingItem = () => {
  // Static dummy data
  const co = { id: "CO1", code: "CO1", description: "Understand basics" };
  const po = { id: "PO1", code: "PO1", description: "Engineering Knowledge" };

  const [isChecked, setIsChecked] = useState(true);
  const [strength, setStrength] = useState(2);
  const [justification, setJustification] = useState("");
  const [isSuggested] = useState(true);

  return (
    <div className="flex items-start gap-3 p-2 rounded border">
      <Checkbox checked={isChecked} onCheckedChange={() => setIsChecked(!isChecked)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{po.code}</span>
          {isSuggested && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Suggested
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2">{po.description}</p>

        {isChecked && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Strength:</Label>
              <Select value={strength.toString()} onValueChange={(value) => setStrength(parseInt(value))}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                </SelectContent>
              </Select>

              <Badge className={strengthColors[strength as 1 | 2 | 3]}>{strengthLabels[strength as 1 | 2 | 3]}</Badge>
            </div>

            <div>
              <Label className="text-xs">Justification (optional):</Label>
              <Textarea
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
  );
};

export default MappingItem;
