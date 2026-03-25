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
} from '@tanstack/react-table';

import './DataTable.scss'; 
import { PaginationControls } from './Pagination';
import { ExportControls } from './ExportControls';
import { ColumnVisibility } from './ColumnVisibility';
import { GlobalSearch } from './GlobalSearch';
import { ArrowUpDown, AlertCircle, Filter, X } from 'lucide-react';

interface FilterConditions {
  idRange?: { min: number; max: number };
  nameContains?: string;
  status?: boolean | string;
  dojRange?: { start: string; end: string };
}

interface DataTableV5Props<TData extends object> {
  data: TData[];
  overrideColumns?: ColumnDef<TData, any>[];
  conditions?: FilterConditions;
}

export function DataTableV5<TData extends { id?: any; name?: any; doj?: any; status?: any }>({ 
  data, 
  overrideColumns = [],
  conditions 
}: DataTableV5Props<TData>) {
  
  const [globalFilter, setGlobalFilter] = useState('');
  // TASK#250326P0129.3: Local state to toggle the 'Condition Engine'
  const [isFilterActive, setIsFilterActive] = useState(true);

  /**
   * TASK#250326P0129.2: Conditional Loader Logic
   * Now respects the 'isFilterActive' toggle
   */
  const filteredData = useMemo(() => {
    // If no conditions exist or the user turned them off, return raw data
    if (!conditions || !isFilterActive) return data;

    return data.filter((item: any) => {
      let matchId = true;
      let matchName = true;
      let matchStatus = true;
      let matchDoj = true;

      if (conditions.idRange && item.id !== undefined) {
        const val = Number(item.id);
        matchId = val > conditions.idRange.min && val < conditions.idRange.max;
      }

      if (conditions.nameContains && item.name) {
        matchName = String(item.name).toLowerCase().includes(conditions.nameContains.toLowerCase());
      }

      if (conditions.status !== undefined) {
        const targetStatus = String(conditions.status).toLowerCase() === 'true';
        const itemStatus = String(item.status).toLowerCase() === 'true';
        matchStatus = itemStatus === targetStatus;
      }

      if (conditions.dojRange && item.doj) {
        const itemDate = new Date(item.doj).getTime();
        const start = new Date(conditions.dojRange.start).getTime();
        const end = new Date(conditions.dojRange.end).getTime();
        matchDoj = itemDate >= start && itemDate <= end;
      }

      return matchId && matchName && matchStatus && matchDoj;
    });
  }, [data, conditions, isFilterActive]);

  const isValidData = useMemo(() => {
    return Array.isArray(data) && (data.length === 0 || typeof data[0] === 'object');
  }, [data]);

  const getAlignmentClass = (columnId: string) => {
    const centeredIds = ['select', 'actions', 'status'];
    return centeredIds.includes(columnId.toLowerCase()) ? 'column-center' : 'column-left';
  };

  const columns = useMemo<ColumnDef<TData, any>[]>(() => {
    if (!isValidData || filteredData.length === 0) return overrideColumns;
    const autoKeys = Object.keys(filteredData[0]);
    const generatedCols: ColumnDef<TData, any>[] = autoKeys.map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      size: 200,
    }));
    const merged = generatedCols.map(gCol => {
      const gKey = (gCol as any).accessorKey;
      const override = overrideColumns.find(oCol => ((oCol as any).accessorKey || oCol.id) === gKey);
      return override || gCol;
    });
    const extraCols = overrideColumns.filter(oCol => !autoKeys.includes(((oCol as any).accessorKey || oCol.id) as string));
    return [...merged, ...extraCols];
  }, [filteredData, overrideColumns, isValidData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!isValidData) return (
    <div className="p-12 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50 flex flex-col items-center gap-3 text-rose-600 text-center">
      <AlertCircle size={48} />
      <h3 className="font-bold text-xl">Data Error</h3>
      <p className="text-sm">Invalid JSON structure detected.</p>
    </div>
  );

  return (
    <div className="enterprise-table-wrapper">
      <div className="table-controls-bar">
        <div className="flex items-center gap-4">
          <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
          
          {/* TASK#250326P0129.3: The Interactive Filter Badge */}
          {conditions && isFilterActive && (
            <div className="flex items-center gap-2 pl-3 pr-1 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-bold text-indigo-600 uppercase tracking-tight shadow-sm">
              <span className="flex items-center gap-1.5">
                <Filter size={12} />
                Conditions Active
              </span>
              <button 
                onClick={() => setIsFilterActive(false)}
                className="p-1 hover:bg-indigo-100 rounded-full transition-colors text-indigo-400 hover:text-indigo-700"
                title="Clear all conditions"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Optional: Show a button to re-enable if conditions exist but are off */}
          {conditions && !isFilterActive && (
            <button 
              onClick={() => setIsFilterActive(true)}
              className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 underline underline-offset-4 decoration-slate-200"
            >
              Re-apply Filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ColumnVisibility table={table} />
          <ExportControls table={table} data={filteredData} />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const alignClass = getAlignmentClass(header.column.id);
                  return (
                    <th key={header.id} className={alignClass}>
                      <div className="flex-header" onClick={header.column.getToggleSortingHandler()}>
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && <ArrowUpDown size={12} className="sort-icon" />}
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
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={getAlignmentClass(cell.column.id)}>
                      <div className="flex-cell">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
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