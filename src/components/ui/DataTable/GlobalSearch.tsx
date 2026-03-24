import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
}

export const GlobalSearch = ({
  value: initialValue,
  onChange,
  debounce = 300,
}: GlobalSearchProps) => {
  const [value, setValue] = useState(initialValue);

  // Debounce the search input to prevent excessive re-renders
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <div className="relative w-full max-w-sm group">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
        size={18} 
      />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search all columns..."
        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
      />
      {value && (
        <button 
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};