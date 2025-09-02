
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Column } from './types';

interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (columnKey: string) => void;
  hasActions: boolean;
}

export const DataTableHeader = <T,>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  hasActions
}: DataTableHeaderProps<T>) => {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={String(column.key)}
            className={column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
            style={{ width: column.width }}
            onClick={() => column.sortable && onSort(String(column.key))}
          >
            <div className="flex items-center gap-2">
              {column.title}
              {column.sortable && sortColumn === column.key && (
                <span className="text-xs">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </TableHead>
        ))}
        {hasActions && <TableHead className="w-24">Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};
