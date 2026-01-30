// components/Shared/DynamicTable.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";
import { ConfirmationModal } from "./ConfirmationModal";
import {
  DynamicTableProps,
  TableAction,
  SortConfig,
  ConfirmationConfig,
} from "@/types/table.types";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export function DynamicTable<T extends Record<string, any>>({
  data,
  config,
  pagination = { enabled: true, pageSize: 10 },
  selection,
  filter,
  loading = false,
  emptyMessage = "No data available",
  className,
  title,
  headerClassName,
  rowClassName,
  onRowClick,
  striped = false,
  hoverable = true,
  bordered = false,
  stickyHeader = false,
}: DynamicTableProps<T>) {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<T[]>(
    selection?.selectedRows || []
  );
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    config: ConfirmationConfig;
    onConfirm: () => void;
  }>({
    isOpen: false,
    config: {},
    onConfirm: () => {},
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Get row ID for selection
  const getRowId = useCallback(
    (row: T, index: number) => {
      if (selection?.getRowId) {
        return String(selection.getRowId(row));
      }
      return String(row.id || index);
    },
    [selection]
  );

  // Filter data
  const filteredData = useMemo(() => {
    if (!filter?.enabled || !searchQuery) return data;

    return data.filter((row) => {
      const searchKeys = filter.searchKeys || Object.keys(row);
      return searchKeys.some((key) => {
        const value = row[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, filter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = config.columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      let aValue: any;
      let bValue: any;

      if (typeof column.accessor === "function") {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else if (column.accessor) {
        aValue = a[column.accessor];
        bValue = b[column.accessor];
      } else {
        aValue = a[column.key];
        bValue = b[column.key];
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, config.columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination.enabled]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const column = config.columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((prev) => {
      if (prev?.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  // Handle selection
  const handleSelectRow = (row: T, index: number) => {
    if (!selection?.enabled) return;

    const rowId = getRowId(row, index);
    const isSelected = selectedRows.some(
      (r, i) => getRowId(r, i) === rowId
    );

    let newSelection: T[];

    if (selection.mode === "single") {
      newSelection = isSelected ? [] : [row];
    } else {
      newSelection = isSelected
        ? selectedRows.filter((r, i) => getRowId(r, i) !== rowId)
        : [...selectedRows, row];
    }

    setSelectedRows(newSelection);
    selection.onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    if (!selection?.enabled || selection.mode === "single") return;

    const allSelected =
      paginatedData.length > 0 &&
      paginatedData.every((row, index) =>
        selectedRows.some((r, i) => getRowId(r, i) === getRowId(row, index))
      );

    const newSelection = allSelected
      ? selectedRows.filter(
          (r, i) =>
            !paginatedData.some(
              (row, index) => getRowId(row, index) === getRowId(r, i)
            )
        )
      : [
          ...selectedRows,
          ...paginatedData.filter(
            (row, index) =>
              !selectedRows.some((r, i) => getRowId(r, i) === getRowId(row, index))
          ),
        ];

    setSelectedRows(newSelection);
    selection.onSelectionChange?.(newSelection);
  };

  // Handle actions
  const handleAction = async (
    action: TableAction<T>,
    row: T,
    index: number
  ) => {
    if (action.disabled?.(row)) return;

    if (action.requiresConfirmation) {
      setConfirmationModal({
        isOpen: true,
        config: action.confirmationConfig || {
          title: "Confirm Action",
          description: "Are you sure you want to proceed?",
          type: "warning",
        },
        onConfirm: async () => {
          setIsActionLoading(true);
          try {
            await action.onClick(row, index);
          } finally {
            setIsActionLoading(false);
            setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
          }
        },
      });
    } else {
      await action.onClick(row, index);
    }
  };

  // Get cell value
  const getCellValue = (row: T, column: any, index: number) => {
    if (column.render) {
      return column.render(
        column.accessor
          ? typeof column.accessor === "function"
            ? column.accessor(row)
            : row[column.accessor]
          : row[column.key],
        row,
        index
      );
    }

    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    return row[column.accessor || column.key];
  };

  // Visible columns
  const visibleColumns = config.columns.filter((col) => !col.hidden);

  return (
    <div className={cn("bg-white rounded-3xl shadow-[6px_6px_54px_0px_#0000000D] w-full", className)}>
      {/* Header */}
      {(title || filter?.enabled) && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {filter?.enabled && (
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <div className={stickyHeader ? "max-h-[600px] overflow-y-auto" : ""}>
          <table className="w-full min-w-[800px]">
            <thead
              className={cn(
                stickyHeader && "sticky top-0 z-10 bg-white",
                headerClassName
              )}
            >
              <tr className="bg-[#F1F4F9]">
                {/* Selection Column */}
                {/* {selection?.enabled && selection.mode === "multiple" && (
                  <th className="py-4 px-6 rounded-l-xl">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((row, index) =>
                          selectedRows.some(
                            (r, i) => getRowId(r, i) === getRowId(row, index)
                          )
                        )
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                )} */}

                {/* Data Columns */}
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.key}
                    className={cn(
                      "py-4 px-6 text-gray-500 font-semibold text-sm",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      !column.align && "text-left",
                      index === 0 &&
                        !selection?.enabled &&
                        "rounded-l-xl",
                      index === visibleColumns.length - 1 &&
                        !config.showActions &&
                        "rounded-r-xl",
                      column.className
                    )}
                    style={{ width: column.width }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end",
                        column.sortable && "cursor-pointer select-none"
                      )}
                      onClick={() =>
                        column.sortable && handleSort(column.key)
                      }
                    >
                      {column.header}
                      {column.sortable && (
                        <span className="text-gray-400">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {/* Actions Column */}
                {config.showActions && config.actions && (
                  <th
                    className={cn(
                      "py-4 px-6 rounded-r-xl text-gray-500 font-semibold text-sm",
                      config.actionsAlign === "center" && "text-center",
                      config.actionsAlign === "right" && "text-right",
                      !config.actionsAlign && "text-center"
                    )}
                    style={{ width: config.actionsWidth }}
                  >
                    {config.actionsLabel || "Action"}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      visibleColumns.length +
                      (selection?.enabled ? 1 : 0) +
                      (config.showActions ? 1 : 0)
                    }
                    className="py-12 text-center"
                  >
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      visibleColumns.length +
                      (selection?.enabled ? 1 : 0) +
                      (config.showActions ? 1 : 0)
                    }
                    className="py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const globalIndex =
                    (currentPage - 1) * pageSize + rowIndex;
                  const isSelected = selectedRows.some(
                    (r, i) => getRowId(r, i) === getRowId(row, globalIndex)
                  );
                  const rowClass =
                    typeof rowClassName === "function"
                      ? rowClassName(row, globalIndex)
                      : rowClassName;

                  return (
                    <tr
                      key={getRowId(row, globalIndex)}
                      className={cn(
                        hoverable && "hover:bg-gray-50",
                        striped && rowIndex % 2 === 1 && "bg-gray-50",
                        isSelected && "bg-blue-50",
                        onRowClick && "cursor-pointer",
                        "transition-colors",
                        rowClass
                      )}
                      onClick={() => onRowClick?.(row, globalIndex)}
                    >
                      {/* Selection Cell */}
                      {/* {selection?.enabled && (
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(row, globalIndex);
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      )} */}

                      {/* Data Cells */}
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            "py-4 px-6 text-gray-900",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            column.className
                          )}
                        >
                          {getCellValue(row, column, globalIndex)}
                        </td>
                      ))}

                      {/* Actions Cell */}
                      {config.showActions && config.actions && (
                        <td
                          className={cn(
                            "py-4 px-6",
                            config.actionsAlign === "center" &&
                              "text-center",
                            config.actionsAlign === "right" && "text-right",
                            !config.actionsAlign && "text-center"
                          )}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {config.actions
                              .filter(
                                (action) =>
                                  !action.show || action.show(row)
                              )
                              .map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(action, row, globalIndex);
                                  }}
                                  disabled={action.disabled?.(row)}
                                  className={cn(
                                    "p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    action.variant === "danger" &&
                                      "hover:bg-red-50 text-red-600",
                                    action.variant === "success" &&
                                      "hover:bg-green-50 text-green-600",
                                    action.variant === "warning" &&
                                      "hover:bg-orange-50 text-orange-600",
                                    action.variant === "primary" &&
                                      "hover:bg-blue-50 text-blue-600",
                                    !action.variant &&
                                      "hover:bg-gray-100 text-gray-600"
                                  )}
                                  title={action.tooltip}
                                  aria-label={action.label}
                                >
                                  {action.icon}
                                </button>
                              ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.enabled && !loading && paginatedData.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={
            pagination.pageSizeOptions ? setPageSize : undefined
          }
          pageSizeOptions={pagination.pageSizeOptions}
          showPageSize={!!pagination.pageSizeOptions}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationModal.onConfirm}
        isLoading={isActionLoading}
        {...confirmationModal.config}
      />
    </div>
  );
}