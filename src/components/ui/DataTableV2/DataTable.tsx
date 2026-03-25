"use client";

import React, { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeMode,
} from '@tanstack/react-table';

import './DataTable.scss'; 
import { PaginationControls } from './Pagination';
import { ExportControls } from './ExportControls';
import { ColumnVisibility } from './ColumnVisibility';
import { GlobalSearch } from './GlobalSearch';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

interface DataTableV2Props<TData extends object> {
  data: TData[];
  overrideColumns?: ColumnDef<TData, any>[];
}

export function DataTableV2<TData extends { id?: string | number }>({ 
  data, 
  overrideColumns = [] 
}: DataTableV2Props<TData>) {
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');

  /**
   * TASK#250126A1209.2: Validate JSON Format
   */
  const isValidData = useMemo(() => {
    return Array.isArray(data) && (data.length === 0 || typeof data[0] === 'object');
  }, [data]);

  /**
   * TAG-CASE#2: Dynamic Alignment Helper
   * Centralizes the "Source of Truth" for horizontal positioning
   */
  const getAlignmentClass = (columnId: string) => {
    const centeredIds = ['select', 'actions', 'status'];
    if (centeredIds.includes(columnId.toLowerCase())) return 'column-center';
    return 'column-left';
  };

  /**
   * TASK#250126A1209.3: Automatically calculate & merge columns
   */
  const columns = useMemo<ColumnDef<TData, any>[]>(() => {
    if (!isValidData || data.length === 0) return overrideColumns;

    const autoKeys = Object.keys(data[0]);

    const generatedCols: ColumnDef<TData, any>[] = autoKeys.map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      // TASK#250126A1209.4: Set default widths to prevent shrinking
      minSize: 100,
      size: 200, // This is the "Ideal" width on load
    }));

    const merged = generatedCols.map(gCol => {
      const gKey = (gCol as any).accessorKey;
      const override = overrideColumns.find(oCol => {
        const oKey = (oCol as any).accessorKey || oCol.id;
        return oKey === gKey;
      });
      return override || gCol;
    });

    const extraCols = overrideColumns.filter(oCol => {
      const oKey = (oCol as any).accessorKey || oCol.id;
      return !autoKeys.includes(oKey as string);
    });

    return [...merged, ...extraCols];
  }, [data, overrideColumns, isValidData]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!isValidData) {
    return (
      <div className="p-12 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50 flex flex-col items-center gap-3 text-rose-600">
        <AlertCircle size={48} />
        <h3 className="font-bold text-xl tracking-tight">Data Integrity Error</h3>
        <p className="text-sm font-medium opacity-80">Master Registry V2 requires an Array of Objects to initialize.</p>
      </div>
    );
  }

  return (
    <div className="enterprise-table-wrapper animate-in fade-in duration-700">
      {/* Search & Export Controls */}
      <div className="table-controls-bar">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <div className="flex items-center gap-3">
          <ColumnVisibility table={table} />
          <ExportControls table={table} data={data} />
        </div>
      </div>

    <div className="table-container shadow-sm border border-slate-100 rounded-xl">
      <table 
        style={{ 
          width: '100%', // Force table to span the full container width
          minWidth: table.getTotalSize(), // Ensure it doesn't collapse smaller than contents
        }}
      >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const alignClass = getAlignmentClass(header.column.id);
                  
                  return (
                    <th 
                      key={header.id} 
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className={`group relative select-none ${alignClass}`}
                    >
                      <div 
                        className="flex-header cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && header.column.id !== 'select' && (
                          <ArrowUpDown size={12} className="sort-icon opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>

                      {/* COLUMN RESIZER HANDLE */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                      />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className={`transition-colors hover:bg-slate-50/80 ${row.getIsSelected() ? 'row-selected' : ''}`}
              >
                {row.getVisibleCells().map(cell => {
                  const alignClass = getAlignmentClass(cell.column.id);
                  
                  return (
                    <td 
                      key={cell.id} 
                      style={{ width: cell.column.getSize() }}
                      className={alignClass}
                    >
                      <div className="flex-cell">
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