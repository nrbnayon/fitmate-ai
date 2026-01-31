// types/table.types.ts
import { ReactNode } from "react";

// Base column configuration
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => any);
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  hidden?: boolean;
  className?: string;
}

// Action configuration
export interface TableAction<T = any> {
  icon?: ReactNode;
  label?: string;
  onClick: (row: T, index: number) => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  show?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  tooltip?: string;
  requiresConfirmation?: boolean;
  confirmationConfig?: ConfirmationConfig;
}

// Confirmation modal configuration
export interface ConfirmationConfig {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "info" | "success";
}

// Table configuration
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  showActions?: boolean;
  actionsLabel?: string;
  actionsAlign?: "left" | "center" | "right";
  actionsWidth?: string;
}

// Pagination configuration
export interface PaginationConfig {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showTotal?: boolean;
  position?: "top" | "bottom" | "both";
}

// Sorting configuration
export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// Filter configuration
export interface FilterConfig {
  enabled?: boolean;
  searchKeys?: string[];
  customFilters?: Record<string, (value: any) => boolean>;
}

// Selection configuration
export interface SelectionConfig<T = any> {
  enabled?: boolean;
  mode?: "single" | "multiple";
  onSelectionChange?: (selectedRows: T[]) => void;
  selectedRows?: T[];
  getRowId?: (row: T) => string | number;
}

// Complete table props
export interface DynamicTableProps<T = any> {
  data: T[];
  config: TableConfig<T>;
  pagination?: PaginationConfig;
  selection?: SelectionConfig<T>;
  filter?: FilterConfig;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  title?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
}