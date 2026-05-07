"use client";

import UserSetting from '@/components/ui/settings/UserSettings';
import { fetchMockData, UserData } from '@/services/mockService';
import { useEffect, useState } from 'react';

export default function UserSettingFeaturesPage() {
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
      <UserSetting></UserSetting>
    </div>
  );
}