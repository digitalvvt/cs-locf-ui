import SelectDropdown from "@/components/Common/SelectDropdown";
import { Button } from "@/components/ui/button";
import React from "react";

const filters = [
  { id: 0, name: "All" },
  { id: 1, name: "Latest" },
  { id: 2, name: "Last Week" },
  { id: 3, name: "Last Month" },
];

const ExamHeader = ({
  onCreate,
  onFilter,
}: {
  onCreate: () => void;
  onFilter: (filter: any) => void;
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState(filters[0]);

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
    onFilter(filter);
  };

  return (
    <div className="flex items-center justify-end mb-3">
      <div className="flex items-center justify-between">
        <div className="mr-4">
          <SelectDropdown
            options={filters}
            value={selectedFilter}
            onChange={handleFilterChange}
            className="w-[150px]"
          />
        </div>
        <div>
          <Button
            onClick={() => onCreate()}
            variant="outline"
            size="default"
            className="bg-gray-500 !py-1  text-white"
          >
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
