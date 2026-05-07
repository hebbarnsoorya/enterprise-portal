"use client";

import { DataTableV2 } from '@/components/ui/DataTableV2/DataTable';
import { fetchMockData, UserData } from '@/services/mockService';
import { useEffect, useState } from 'react';

export default function UserSetting() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

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
      <p>This is User Setting Components</p>
    </div>
  );
}