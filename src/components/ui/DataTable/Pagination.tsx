import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps<TData> {
  table: Table<TData>;
}

export const PaginationControls = <TData,>({ table }: PaginationProps<TData>) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t rounded-b-xl gap-4">
      {/* Fix #1: Clear and dynamic selection counter */}
      <div className="text-sm font-medium text-slate-500">
        {selectedCount > 0 ? (
          <span className="text-blue-600 font-bold bg-blue-100 px-2 py-1 rounded-md mr-2">
            {selectedCount}
          </span>
        ) : "0"} 
        {" of "} 
        <span className="font-semibold text-slate-700">{totalCount}</span> 
        {" row(s) selected"}
      </div>

      <div className="flex items-center gap-6">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-slate-500">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <NavButton 
            onClick={() => table.setPageIndex(0)} 
            disabled={!table.getCanPreviousPage()}
            icon={<ChevronsLeft size={16} />} 
          />
          <NavButton 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            icon={<ChevronLeft size={16} />} 
          />
          
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600 px-3">
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
          </span>

          <NavButton 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            icon={<ChevronRight size={16} />} 
          />
          <NavButton 
            onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
            disabled={!table.getCanNextPage()}
            icon={<ChevronsRight size={16} />} 
          />
        </div>
      </div>
    </div>
  );
};

// Reusable NavButton Sub-component
const NavButton = ({ onClick, disabled, icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
  >
    {icon}
  </button>
);