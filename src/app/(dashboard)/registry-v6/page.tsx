"use client";

import { useState } from 'react';
import { DataTableV6 } from '@/components/ui/DataTableV6/DataTable';
import { DataFeedManager } from '@/components/ui/DataFeeder/DataFeedManager';
import { PackageOpen } from 'lucide-react'; // Added for empty state icon

/**
 * Registry V6 - TAG-CASE#4 Implementation
 * Features: Auto-discovering JSON arrays from URL or File Upload
 */

export default function RegistryV6Page() {
  const [data, setData] = useState<any[]>([]);
  // Changed default to false because we removed the initial mock fetch
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Componentized Data Feed (TASK#250326P0920.4) */}
      <DataFeedManager 
        onDataLoaded={(newData) => setData(newData)} 
        loading={loading}
        setLoading={setLoading}
      />

      {/* Table Section */}
      <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        
        {/* TASK#250326P0920.4: Show Loading Overlay ONLY when loading is true AND data exists */}
        {loading && data.length > 0 && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* NEW: Empty State UI 
          Displayed when not loading and no data has been fetched yet 
        */}
        {!loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 p-8 space-y-4">
            <div className="p-4 bg-slate-50 rounded-full">
              <PackageOpen size={48} className="text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-600">No Data Available</h3>
              <p className="text-sm max-w-xs mx-auto">
                Please upload a JSON file or paste an API URL in the controls above to populate the registry.
              </p>
            </div>
          </div>
        ) : (
          /* Render the DataTable only when data is present */
          <DataTableV6 data={data} loading={loading} />
        )}
      </div>
    </div>
  );
}