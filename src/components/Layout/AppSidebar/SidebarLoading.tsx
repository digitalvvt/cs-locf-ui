
import React from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export const SidebarLoading = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
