
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Column } from './types';

interface DataTableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (row: T, index: number) => React.ReactNode;
  emptyMessage: string;
}

export const DataTableBody = <T,>({
  data,
  columns,
  actions,
  emptyMessage
}: DataTableBodyProps<T>) => {
  const renderCellValue = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    return String(value || '');
  };

  return (
    <TableBody>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500">
            {emptyMessage}
          </TableCell>
        </TableRow>
      ) : (
        data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {renderCellValue(column, row, index)}
              </TableCell>
            ))}
            {actions && (
              <TableCell>
                {actions(row, index)}
              </TableCell>
            )}
          </TableRow>
        ))
      )}
    </TableBody>
  );
};
