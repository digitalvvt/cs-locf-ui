import { ICoPoMapping } from "@/api/api/program-outcomes-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useMemo } from "react";

export const CoPOMappingMatrix = ({ data }: { data: ICoPoMapping[] }) => {
  const canEdit = true;

  // Unique COs (including TOTAL / AVERAGE if present in incoming data)
  const courseOutcomes = useMemo(() => {
    const map = new Map<
      string,
      { id: string; code: string; description: string | null; value: number }
    >();
    data.forEach((item) => {
      if (!map.has(item.co_label)) {
        map.set(item.co_label, {
          id: item.co_label,
          code: item.co_label,
          description:
            (item as any).course_outcome_content ??
            (item as any).course_outcome_description ??
            null,
          value: Number(item.value) || 0,
        });
      }
    });
    return Array.from(map.values());
  }, [data]);

  // Unique POs/PSOs
  const programOutcomes = useMemo(() => {
    const map = new Map<
      string,
      { id: string; code: string; description: string | null; value: number }
    >();
    data.forEach((item) => {
      if (!map.has(item.po_label)) {
        map.set(item.po_label, {
          id: item.po_label,
          code: item.po_label,
          description:
            (item as any).program_outcome_description ??
            (item as any).program_specific_outcome_description ??
            null,
          value: Number(item.value) || 0,
        });
      }
    });
    return Array.from(map.values());
  }, [data]);

  // Keep PO* first, then PSO* (your original ordering)
  const pos = useMemo(
    () => programOutcomes.filter((po) => po.code.startsWith("PO")),
    [programOutcomes]
  );
  const psos = useMemo(
    () => programOutcomes.filter((po) => po.code.startsWith("PSO")),
    [programOutcomes]
  );
  const orderedOutcomes = useMemo(() => [...pos, ...psos], [pos, psos]);

  // Only the "real" COs count towards TOTAL/AVERAGE (exclude summary rows)
  const baseCoIds = useMemo(
    () => courseOutcomes.filter((c) => c.id !== "TOTAL" && c.id !== "AVERAGE").map((c) => c.id),
    [courseOutcomes]
  );

  // Column aggregates per PO/PSO
  const sumForPo = (poId: string) =>
    data
      .filter((it) => it.po_label === poId && baseCoIds.includes(it.co_label))
      .reduce((acc, it) => acc + (Number(it.value) || 0), 0);

  const avgForPo = (poId: string) => {
    const denom = baseCoIds.length || 1;
    const avg = sumForPo(poId) / denom;
    return Number.isFinite(avg) ? Number(avg.toFixed(1)) : 0;
  };

  // Value resolver for each cell
  const getMappingStrength = (coId: string, poId: string): number => {
    if (coId === "TOTAL") return sumForPo(poId);
    if (coId === "AVERAGE") return avgForPo(poId);
    const match = data.find((item) => item.co_label === coId && item.po_label === poId);
    return match ? Number(match.value) || 0 : 0;
  };

  const handleStrengthChange = (coId: string, poId: string, value: string) => {
    // UI-only for now. In real usage, call your API then refresh local state.
    // Ignore edits on summary rows
    if (coId === "TOTAL" || coId === "AVERAGE") return;
    console.log("update mapping", { coId, poId, value: Number(value) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CO-PO/PSO Mapping Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Outcomes</TableHead>
              {orderedOutcomes.map((po) => (
                <TableHead key={po.id} className="text-center">
                  {po.code}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseOutcomes.map((co) => {
              const isSummaryRow = co.id === "TOTAL" || co.id === "AVERAGE";
              return (
                <TableRow key={co.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={isSummaryRow ? "secondary" : "outline"}>{co.code}</Badge>
                    </div>
                  </TableCell>

                  {orderedOutcomes.map((po) => {
                    const strength = getMappingStrength(co.id, po.id);

                    return (
                      <TableCell key={`${co.id}-${po.id}`} className="text-center">
                        {isSummaryRow ? (
                          <Badge variant="secondary">{strength}</Badge>
                        ) : canEdit ? (
                          <Select
                            value={String(strength)}
                            onValueChange={(value) => handleStrengthChange(co.id, po.id, value)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 20 }, (_, index) => (
                                <SelectItem key={index} value={String(index)}>
                                  {index === 0 ? "-" : index}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex justify-center">
                            {strength > 0 ? (
                              <Badge>{strength}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


// import { ICoPoMapping } from "@/api/api/program-outcomes-api";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import React, { useState, useMemo } from "react";

// export const CoPOMappingMatrix = ({ data }: { data: ICoPoMapping[] }) => {
//   const canEdit = true;


//   const courseOutcomes = useMemo(() => {
//     const map = new Map();
//     data.forEach((item) => {
//       if (!map.has(item.co_label)) {
//         map.set(item.co_label, {
//           id: item.co_label,
//           code: item.co_label,
//           description: item.course_outcome_content,
//           value: item.value,
//         });
//       }
//     });
//     return Array.from(map.values());
//   }, [data]);


//   const programOutcomes = useMemo(() => {
//     const map = new Map();
//     data.forEach((item) => {
//       if (!map.has(item.po_label)) {
//         map.set(item.po_label, {
//           id: item.po_label,
//           code: item.po_label,
//           description: item.program_outcome_description,
//           value: item.value,
//         });
//       }
//     });
//     return Array.from(map.values());
//   }, [data]);


//   const getMappingStrength = (coId: string, poId: string): number => {
//     const match = data.find((item) => item.co_label === coId && item.po_label === poId);
//     return match ? match.value : 0;
//   };

//   const handleStrengthChange = (coId: string, poId: string, value: string) => {
//     // This part is for UI only. Real update should trigger backend sync.
//   };

//   const pos = programOutcomes.filter((po) => po.code.startsWith("PO"));
//   const psos = programOutcomes.filter((po) => po.code.startsWith("PSO"));
//   const orderedOutcomes = [...pos, ...psos];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>CO-PO/PSO Mapping Matrix</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Course Outcomes</TableHead>
//               {orderedOutcomes.map((po) => (
//                 <TableHead key={po.id} className="text-center">
//                   {po.code}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {courseOutcomes.map((co) => (
//               <TableRow key={co.id}>
//                 <TableCell>
//                   <div className="space-y-1">
//                     <Badge variant="outline">{co.code}</Badge>
//                   </div>
//                 </TableCell>
//                 {orderedOutcomes.map((po) => {
//                   const strength = getMappingStrength(co.id, po.id);
//                   return (
//                     <TableCell key={po.id} className="text-center">
//                       {canEdit ? (
//                         <Select
//                           value={strength.toString()}

//                           onValueChange={(value) => handleStrengthChange(co.id, po.id, value)}
//                         >
//                           <SelectTrigger className="w-16 h-8">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {Array.from({ length: 20 }, (_, index) => (
//                               <SelectItem key={index} value={index.toString()}>
//                                 {index === 0 ? "-" : index}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       ) : (
//                         <div className="flex justify-center">
//                           {strength > 0 ? <Badge>{strength}</Badge> : <span className="text-gray-400">-</span>}
//                         </div>
//                       )}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };
