import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

export const ColumnVisibility = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-50">
        <Settings2 size={16} /> Columns
      </button>
      <div className="absolute hidden group-hover:block z-10 bg-white border shadow-xl p-2 rounded-md min-w-[150px]">
        {table.getAllLeafColumns().map(column => (
          <label key={column.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            <span className="text-sm capitalize">{column.id}</span>
          </label>
        ))}
      </div>
    </div>
  );
};