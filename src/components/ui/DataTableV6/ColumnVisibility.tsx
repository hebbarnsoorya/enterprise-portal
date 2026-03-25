import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

export const ColumnVisibility = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <button className="flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-50 bg-white transition-colors">
        <Settings2 size={16} /> Columns
      </button>

      {/* Floating Menu Container 
        - absolute: Pulls it out of document flow so rows don't move
        - hidden group-hover:block: Shows only on hover
        - z-50: Ensures it stays above table headers/rows
        - max-h & overflow-y: Adds the scroller for many columns
      */}
      <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 bg-white border border-slate-200 shadow-xl p-2 rounded-lg min-w-[200px] max-h-[400px] overflow-y-auto custom-scrollbar">
        
        <div className="px-2 py-1 mb-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Toggle Columns
        </div>

        {table.getAllLeafColumns().map(column => (
          <label 
            key={column.id} 
            className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            <span className="text-sm font-medium text-slate-700 capitalize truncate">
              {column.id.replace(/_/g, ' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};