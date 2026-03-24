"use client";

import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  getFilteredRowModel, // Added for Global Search
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

import { PaginationControls } from './Pagination';
import { ExportControls } from './ExportControls';
import { ColumnVisibility } from './ColumnVisibility';
import { GlobalSearch } from './GlobalSearch'; // New Component

const DEFAULT_ROWS_PER_PAGE = 5;

interface DataTableProps<TData extends { id: string | number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

export function DataTable<TData extends { id: string | number }>({ columns, data }: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState(''); // State for search

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      globalFilter, // Sync search state
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id.toString(),
    initialState: {
      pagination: { pageSize: DEFAULT_ROWS_PER_PAGE },
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Required for search logic
    enableRowSelection: true,
  });

  return (
    <div className="enterprise-table-wrapper space-y-4">
      {/* Top Bar with Search and Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b rounded-t-xl gap-4">
        <GlobalSearch 
          value={globalFilter ?? ''} 
          onChange={value => setGlobalFilter(String(value))} 
        />
        <div className="flex items-center gap-2">
           <ColumnVisibility table={table} />
           <ExportControls table={table} data={data} />
        </div>
      </div>

      <div className="overflow-x-auto border-x border-slate-100">
        <table className="w-full text-sm text-left border-collapse">
          {/* ... Table Head & Body remain same as previous version ... */}
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors ${row.getIsSelected() ? 'bg-blue-50/60' : ''}`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls table={table} />
    </div>
  );
}