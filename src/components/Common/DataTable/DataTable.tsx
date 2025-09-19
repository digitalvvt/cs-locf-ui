
import React, { useState, useMemo } from 'react';
import { Table } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { DataTablePagination } from './DataTablePagination';
import { DataTableSearch } from './DataTableSearch';
import { Column, PaginationConfig } from './types';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  actions?: (row: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export const DataTable = <T,>({
  data,
  columns,
  loading = false,
  pagination,
  searchable = false,
  onSearch,
  actions,
  emptyMessage = 'No data available',
  className
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key as keyof T];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search */}
      {searchable && (
        <DataTableSearch 
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <DataTableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            hasActions={!!actions}
          />
          <DataTableBody
            data={sortedData}
            columns={columns}
            actions={actions}
            emptyMessage={emptyMessage}
          />
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <DataTablePagination pagination={pagination} />
      )}
    </div>
  );
};
