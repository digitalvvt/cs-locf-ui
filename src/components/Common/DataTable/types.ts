
import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  label?: string; // Keep this optional for backwards compatibility
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
