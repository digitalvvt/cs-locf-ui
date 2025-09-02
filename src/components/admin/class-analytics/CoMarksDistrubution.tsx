import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CoDistributionData {
  co: string;
  noOfQuestions: number;
  correct: number;
  wrong: number;
  left: number;
}

export default function CoMarksDistribution({ data }: { data?: CoDistributionData[] }) {
  return (
    <Card className="w-full mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">CO Marks Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-left font-medium text-gray-700 py-3">Sl.No</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-3">CO</TableHead>
                <TableHead className="text-center font-medium text-gray-700 py-3">
                  No. of Ques
                </TableHead>
                <TableHead className="text-center font-medium text-gray-700 py-3">
                  Correct
                </TableHead>
                <TableHead className="text-center font-medium text-gray-700 py-3">Wrong</TableHead>
                <TableHead className="text-center font-medium text-gray-700 py-3">Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={index} className="border-b hover:bg-gray-50">
                  <TableCell className="py-4 text-gray-900">{index + 1}</TableCell>
                  <TableCell className="py-4 text-gray-900">{row.co}</TableCell>
                  <TableCell className="py-4 text-center text-gray-900">
                    {row.noOfQuestions}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-green-600 font-medium">{row.correct}%</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-red-500 font-medium">{row.wrong}%</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-orange-500 font-medium">{row.left}%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
