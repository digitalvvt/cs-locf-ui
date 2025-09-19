import React from "react";
import MappingItem from "./MappingItem";
import { ICoPoMapping } from "@/api/api/program-outcomes-api";

const CopoMappingInterfaceSection = ({ data }: { data: ICoPoMapping[] }) => {

  return (
    <div className="space-y-3">
      <MappingItem data={data} />
    </div>
  );
};

export default CopoMappingInterfaceSection;
