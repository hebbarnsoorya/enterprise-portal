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
import { ArrowUpDown, AlertCircle } from 'lucide-react';

// TASK#250326P0129.2: Define the Filter Condition Structure
interface FilterConditions {
  idRange?: { min: number; max: number };
  nameContains?: string;
  status?: boolean;
  dojRange?: { start: string; end: string };
}

interface DataTableV4Props<TData extends object> {
  data: TData[];
  overrideColumns?: ColumnDef<TData, any>[];
  conditions?: FilterConditions; // New Prop for TAG-CASE#3
}

export function DataTableV4<TData extends { id?: string | number; name?: string; doj?: string; status?: boolean | string }>({ 
  data, 
  overrideColumns = [],
  conditions 
}: DataTableV4Props<TData>) {
  
  const [globalFilter, setGlobalFilter] = useState('');

  /**
   * TASK#250326P0129.2: Data Filtering Engine (Condition Loader)
   * This filters the raw data based on the passed conditions before table initialization
   */
  const processedData = useMemo(() => {
    if (!conditions) return data;

    return data.filter((item: any) => {
      let isMatch = true;

      // 1. ID Range Condition: id > min && id < max
      if (conditions.idRange && item.id !== undefined) {
        const id = Number(item.id);
        if (id <= conditions.idRange.min || id >= conditions.idRange.max) isMatch = false;
      }

      // 2. Name Contains Condition (Case Insensitive)
      if (conditions.nameContains && item.name) {
        if (!item.name.toLowerCase().includes(conditions.nameContains.toLowerCase())) isMatch = false;
      }

      // 3. Status Condition
      if (conditions.status !== undefined) {
        const itemStatus = String(item.status).toLowerCase() === 'true';
        if (itemStatus !== conditions.status) isMatch = false;
      }

      // 4. Date of Joining (DOJ) Range Condition
      if (conditions.dojRange && item.doj) {
        const itemDate = new Date(item.doj);
        const startDate = new Date(conditions.dojRange.start);
        const endDate = new Date(conditions.dojRange.end);
        if (itemDate < startDate || itemDate > endDate) isMatch = false;
      }

      return isMatch;
    });
  }, [data, conditions]);

  const isValidData = useMemo(() => {
    return Array.isArray(data) && (data.length === 0 || typeof data[0] === 'object');
  }, [data]);

  const getAlignmentClass = (columnId: string) => {
    const centeredIds = ['select', 'actions', 'status'];
    if (centeredIds.includes(columnId.toLowerCase())) return 'column-center';
    return 'column-left';
  };

  const columns = useMemo<ColumnDef<TData, any>[]>(() => {
    if (!isValidData || processedData.length === 0) return overrideColumns;

    const autoKeys = Object.keys(processedData[0]);

    const generatedCols: ColumnDef<TData, any>[] = autoKeys.map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      minSize: 100,
      size: 200,
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
  }, [processedData, overrideColumns, isValidData]);

  const table = useReactTable({
    data: processedData, // Use filtered data
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
        <h3 className="font-bold text-xl tracking-tight">Data Integrity Error</h3>
        <p className="text-sm font-medium opacity-80">JSON must be an Array of Objects.</p>
      </div>
    );
  }

  return (
    <div className="enterprise-table-wrapper">
      <div className="table-controls-bar">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <div className="flex items-center gap-3">
          <ColumnVisibility table={table} />
          <ExportControls table={table} data={processedData} />
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
                    <th key={header.id} className={`${alignClass} select-none`}>
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
              <tr key={row.id}>
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