"use client";

import { useRef, useState } from 'react';
import { Globe, FileJson } from 'lucide-react';

interface DataFeedManagerProps {
  onDataLoaded: (data: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function DataFeedManager({ onDataLoaded, loading, setLoading }: DataFeedManagerProps) {
  const [url, setUrl] = useState('');
  // TASK#250326P0920.1: Added Limit and Skip states with requested defaults
  const [limit, setLimit] = useState('100'); 
  const [skip, setSkip] = useState('0');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | '', msg: string }>({ type: '', msg: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TAG-CASE#4: Smart Auto-Discovery Logic
  const processData = (json: any) => {
    if (Array.isArray(json)) {
      onDataLoaded(json);
      setStatus({ type: 'success', msg: `Loaded ${json.length} items from Array.` });
      return;
    }

    if (json && typeof json === 'object') {
      // Find the first key that contains an array (e.g., "users", "quotes", "products")
      const arrayKey = Object.keys(json).find(key => Array.isArray(json[key]));

      if (arrayKey) {
        onDataLoaded(json[arrayKey]);
        setStatus({ type: 'success', msg: `Data found in "${arrayKey}" (${json[arrayKey].length} items).` });
      } else {
        onDataLoaded([json]); // Fallback: wrap single object
        setStatus({ type: 'success', msg: 'Single record detected.' });
      }
      return;
    }
    setStatus({ type: 'error', msg: 'No valid data structure found.' });
  };

  const handleUrlFetch = async () => {
    if (!url) return;
    setLoading(true);
    setStatus({ type: 'info', msg: 'Fetching...' });
    
    try {
      /**
       * TASK#250326P0920.3: Dynamic URL Construction
       * Appends limit and skip parameters properly
       */
      const separator = url.includes('?') ? '&' : '?';
      const finalUrl = `${url}${separator}limit=${limit}&skip=${skip}`;

      const res = await fetch(finalUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      processData(json);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        processData(JSON.parse(ev.target?.result as string));
      } catch {
        setStatus({ type: 'error', msg: 'Invalid JSON file.' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Globe size={16} /> Data Feed Controls (TAG-CASE#4)
        </h2>
        {loading && <span className="text-xs text-indigo-600 animate-pulse font-medium">Processing...</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* URL Input Box */}
        <div className="lg:col-span-6 space-y-2">
          <label className="text-xs font-medium text-slate-600">Online JSON URL</label>
          <input 
            type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://dummyjson.com/users"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Limit Dropdown */}
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-medium text-slate-600">Limit</label>
          <select 
            value={limit} onChange={(e) => setLimit(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer"
          >
            {[0, 10, 100, 500, 1000].map(val => (
              <option key={val} value={val}>{val === 0 ? '0 (All)' : val}</option>
            ))}
          </select>
        </div>

        {/* Skip Dropdown */}
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-medium text-slate-600">Skip</label>
          <select 
            value={skip} onChange={(e) => setSkip(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer"
          >
            {[0,10, 25, 50, 100, 500].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-2 flex gap-2">
          <button 
            onClick={handleUrlFetch} 
            disabled={loading || !url} 
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Fetch
          </button>
          
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            title="Upload JSON File"
          >
            <FileJson size={20} />
          </button>
        </div>
      </div>

      {status.msg && (
        <div className={`text-xs p-2 rounded border flex items-center gap-2 ${
          status.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 
          status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
          'bg-blue-50 border-blue-100 text-blue-700'
        }`}>
          <span className="font-bold uppercase">[{status.type}]</span> {status.msg}
        </div>
      )}
    </section>
  );
}