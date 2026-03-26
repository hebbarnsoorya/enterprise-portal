"use client";

import React from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  ColumnDef,
  flexRender,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';

import './DataTable.scss'; 
import { PaginationControls } from './Pagination';
import { ExportControls } from './ExportControls';
import { ColumnVisibility } from './ColumnVisibility';
import { GlobalSearch } from './GlobalSearch';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react';

// TAG-CASE#5: High-Standard Server-Side Props Interface
interface DataTableV7Props<TData extends { id: string | number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageCount: number;                    // Total pages from Spring Boot
  pagination: PaginationState;          // Current { pageIndex, pageSize }
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;                // Current [{ id, desc }]
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  onRowClick?: (row: TData) => void;
  loading: boolean;                     // Required for the blur-overlay
}

export function DataTableV7<TData extends { id: string | number }>({ 
  columns, 
  data,
  pageCount,
  pagination,
  setPagination,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  onRowClick,
  loading 
}: DataTableV7Props<TData>) {
  
  const table = useReactTable({
    data,
    columns,
    pageCount, 
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    // TAG-CASE#5: Enabling Manual (Server-Side) Modes
    manualPagination: true, 
    manualSorting: true,
    manualFiltering: true,
    
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  return (
    <div className="enterprise-table-wrapper relative">
      
      {/* TAG-CASE#5: High-End Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center transition-all">
           <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mt-2">
             Syncing PostgreSQL...
           </p>
        </div>
      )}

      <div className="table-controls-bar">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <div className="flex items-center gap-2">
           <ColumnVisibility table={table} />
           <ExportControls table={table} data={data} />
        </div>
      </div>

      <div className="table-container min-h-[400px]">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const isSorted = header.column.getIsSorted(); 
                  return (
                    <th 
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                           <span className="sort-icon">
                             {{
                               asc: <ArrowUp size={14} className="text-indigo-600" />,
                               desc: <ArrowDown size={14} className="text-indigo-600" />,
                             }[isSorted as string] ?? <ArrowUpDown size={14} className="opacity-20 group-hover:opacity-100" />}
                           </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  onClick={() => onRowClick?.(row.original)} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={columns.length} className="text-center py-20 text-slate-400 font-medium">
                  No records found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls table={table} />
    </div>
  );
}