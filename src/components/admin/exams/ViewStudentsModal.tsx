import React from "react";
import { MainDialog } from "@/components/Common/MainDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust to your button component
export interface IStudent {
  id: number;
  name: string;
  email: string;
  uuid: string; // empty string means absent
}

const ViewStudentsModal = ({
  isOpen,
  onClose,
  students,
}: {
  isOpen: boolean;
  onClose: () => void;
  students: IStudent[];
}) => {
  const navigate = useNavigate();

  const handleViewResult = (id: number, uuid: string) => {
    if (!uuid) return;
    navigate(`/exam/result/${uuid}/${id}`);
  };

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} title="View Students" size="default">
      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        {students && students.length ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">ID</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                {/* <th className="px-6 py-3 text-left font-semibold">Email</th> */}
                <th className="px-6 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black divide-y divide-gray-100 dark:divide-gray-800">
              {students?.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{student.email}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {student.uuid ? (
                      <Button
                        className="bg-gray-500 text-white !py-2 !px-3 hover:bg-gray-600"
                        onClick={() => handleViewResult(student.id, student.uuid)}
                      >
                        View Result
                      </Button>
                    ) : (
                      <div>
                        <span className="text-red-500 text-lg">Absent</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-20">
            <p>No Students Found</p>
          </div>
        )}
      </div>
    </MainDialog>
  );
};

export default ViewStudentsModal;
