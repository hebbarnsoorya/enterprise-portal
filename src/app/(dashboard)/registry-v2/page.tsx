"use client";

import { DataTableV2 } from '@/components/ui/DataTableV2/DataTable';
import { fetchMockData, UserData } from '@/services/mockService';
import { useEffect, useState } from 'react';

export default function RegistryV2Page() {
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
      <DataTableV2
        data={data} 
        //overrideColumns={myOverrides} // Optional! If removed, it auto-generates 'status'
      />
    </div>
  );
}