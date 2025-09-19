
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import type { Column } from '@/components/Common/DataTable/types';

interface DataTableProps<T = any> {
  title?: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  emptyState?: {
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
  };
  emptyMessage?: string;
}

export function DataTable<T = any>({
  title,
  description,
  data,
  columns,
  loading = false,
  error,
  searchable = true,
  filterable = false,
  exportable = false,
  onRefresh,
  onExport,
  emptyState,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row as Record<string, any>).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no title is provided, render without Card wrapper
  if (!title) {
    return (
      <div>
        {loading ? (
          <LoadingSpinner text="Loading table data..." />
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {emptyState?.title || 'No data found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {emptyState?.description || emptyMessage}
            </p>
            {emptyState?.action && (
              <Button onClick={emptyState.action.onClick}>
                {emptyState.action.label}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`text-left p-3 font-medium ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-2">
                        {column.title}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-3">
                        {column.render
                          ? column.render((row as any)[column.key as keyof T], row, index)
                          : String((row as any)[column.key as keyof T] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {exportable && onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
        
        {(searchable || filterable) && (
          <div className="flex gap-4 mt-4">
            {searchable && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <LoadingSpinner text="Loading table data..." />
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {emptyState?.title || 'No data found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {emptyState?.description || emptyMessage}
            </p>
            {emptyState?.action && (
              <Button onClick={emptyState.action.onClick}>
                {emptyState.action.label}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`text-left p-3 font-medium ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-2">
                        {column.title}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-3">
                        {column.render
                          ? column.render((row as any)[column.key as keyof T], row, index)
                          : String((row as any)[column.key as keyof T] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
