"use client";

import { DataTableV5 } from '@/components/ui/DataTableV5/DataTable';
import { fetchMockData, UserData } from '@/services/mockService';
import { useEffect, useState } from 'react';

export default function RegistryV4Page() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Overriding ONLY the status column to show a Badge
  const myOverrides = [
    {
      accessorKey: "status",
      header: "Current Status",
      cell: (info: any) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
          {info.getValue()}
        </span>
      )
    }
  ];

    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await fetchMockData();
          setData(result);
        } catch (error) {
          console.error("Failed to load data", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, []);

  return (
    <div className="p-6">
      <DataTableV5 
          data={data} 
          conditions={{
            idRange: { min: 5, max: 25 },
            nameContains: 'User'
            /* ,
            status: true,
            dojRange: { start: '2025-01-01', end: '2026-01-01' }
              */
          }}
        />
    </div>
  );
}