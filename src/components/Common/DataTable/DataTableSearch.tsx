
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DataTableSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export const DataTableSearch = ({ searchQuery, onSearch }: DataTableSearchProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
