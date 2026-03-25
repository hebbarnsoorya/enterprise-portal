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
import { ArrowUpDown, AlertCircle, Filter } from 'lucide-react';

// TASK#250326P0129.2: Interface for the Logic Engine
interface FilterConditions {
  idRange?: { min: number; max: number };
  nameContains?: string;
  status?: boolean | string;
  dojRange?: { start: string; end: string };
}

interface DataTableV5Props<TData extends object> {
  data: TData[];
  overrideColumns?: ColumnDef<TData, any>[];
  conditions?: FilterConditions; // Primary feature for TAG-CASE#3
}

export function DataTableV5<TData extends { id?: any; name?: any; doj?: any; status?: any }>({ 
  data, 
  overrideColumns = [],
  conditions 
}: DataTableV5Props<TData>) {
  
  const [globalFilter, setGlobalFilter] = useState('');

  /**
   * TASK#250326P0129.2: Conditional Loader Logic
   * Filters the incoming JSON stream based on the 'conditions' prop.
   */
  const filteredData = useMemo(() => {
    if (!conditions) return data;

    return data.filter((item: any) => {
      // Logic Gate: Assume true until a condition fails
      let matchId = true;
      let matchName = true;
      let matchStatus = true;
      let matchDoj = true;

      // 1. ID Range Logic (id > 5 && id < 25)
      if (conditions.idRange && item.id !== undefined) {
        const val = Number(item.id);
        matchId = val > conditions.idRange.min && val < conditions.idRange.max;
      }

      // 2. Name Contains Logic (Case Insensitive)
      if (conditions.nameContains && item.name) {
        matchName = String(item.name).toLowerCase().includes(conditions.nameContains.toLowerCase());
      }

      // 3. Status Logic (Handles "true" as string or boolean)
      if (conditions.status !== undefined) {
        const targetStatus = String(conditions.status).toLowerCase() === 'true';
        const itemStatus = String(item.status).toLowerCase() === 'true';
        matchStatus = itemStatus === targetStatus;
      }

      // 4. Date Range Logic (doj > '2025-01-01' && < '2026-01-01')
      if (conditions.dojRange && item.doj) {
        const itemDate = new Date(item.doj).getTime();
        const start = new Date(conditions.dojRange.start).getTime();
        const end = new Date(conditions.dojRange.end).getTime();
        matchDoj = itemDate >= start && itemDate <= end;
      }

      return matchId && matchName && matchStatus && matchDoj;
    });
  }, [data, conditions]);

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

  if (!isValidData) {
    return (
      <div className="p-12 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50 flex flex-col items-center gap-3 text-rose-600">
        <AlertCircle size={48} />
        <h3 className="font-bold text-xl tracking-tight">Data Error</h3>
        <p className="text-sm opacity-80">Invalid JSON structure detected for TAG-CASE#3.</p>
      </div>
    );
  }

  return (
    <div className="enterprise-table-wrapper">
      <div className="table-controls-bar">
        <div className="flex items-center gap-4">
          <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
          {conditions && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-bold text-indigo-600 uppercase tracking-tight">
              <Filter size={12} />
              Conditions Active
            </div>
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
                {row.getVisibleCells().map(cell => {
                  const alignClass = getAlignmentClass(cell.column.id);
                  return (
                    <td key={cell.id} className={alignClass}>
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