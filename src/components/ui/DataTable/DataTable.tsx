"use client";

import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

// Relative Style Import (Modular)
import './DataTable.scss'; 

import { PaginationControls } from './Pagination';
import { ExportControls } from './ExportControls';
import { ColumnVisibility } from './ColumnVisibility';
import { GlobalSearch } from './GlobalSearch';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const DEFAULT_ROWS_PER_PAGE = 5;

interface DataTableProps<TData extends { id: string | number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

export function DataTable<TData extends { id: string | number }>({ columns, data }: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id.toString(), // Fix #1 logic
    initialState: {
      pagination: { pageSize: DEFAULT_ROWS_PER_PAGE }, // Fix #2 logic
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="enterprise-table-wrapper">
      <div className="table-controls-bar">
        <GlobalSearch 
          value={globalFilter ?? ''} 
          onChange={value => setGlobalFilter(String(value))} 
        />
        <div className="flex items-center gap-2">
           <ColumnVisibility table={table} />
           <ExportControls table={table} data={data} />
        </div>
      </div>

      <div className="table-container">
        <table>
<thead>
  {table.getHeaderGroups().map(headerGroup => (
  <tr key={headerGroup.id}>
    {headerGroup.headers.map(header => {
  // Fix#240326P0715: Define the missing variable here
  const isSorted = header.column.getIsSorted(); 
  
  const isSelection = header.column.id === 'select';
  const isAction = header.column.id === 'actions';
  const isCentered = isSelection || isAction;

  return (
    <th 
      key={header.id}
      onClick={header.column.getToggleSortingHandler()}
      className={`
        ${isSelection ? 'column-selection' : ''} 
        ${isCentered ? 'column-center' : ''}
        ${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''}
      `}
    >
      <div className={isCentered ? 'flex-header' : 'flex items-center gap-2'}>
        {flexRender(header.column.columnDef.header, header.getContext())}
        
        {/* Sort Icons (Hidden for Selection Column) */}
        {!isSelection && header.column.getCanSort() && (
           <span className="sort-icon transition-opacity opacity-0 group-hover:opacity-100">
              {{
                asc: <ArrowUp size={14} className="text-blue-500" />,
                desc: <ArrowDown size={14} className="text-blue-500" />,
              }[isSorted as string] ?? <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100" />}
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

           {table.getRowModel().rows.map(row => (
  <tr key={row.id} className={row.getIsSelected() ? 'row-selected' : ''}>
    {row.getVisibleCells().map(cell => {
      const isCentered = cell.column.id === 'select' || cell.column.id === 'actions';
      
      return (
        <td 
          key={cell.id} 
          className={isCentered ? 'column-center' : ''}
        >
          <div className={isCentered ? 'flex-cell' : ''}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </td>
      );
    })}
  </tr>


            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls table={table} />
    </div>
  );
}