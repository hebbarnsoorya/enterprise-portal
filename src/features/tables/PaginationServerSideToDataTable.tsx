"use client"; // Required because we use state/hooks

import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { fetchMockData, UserData } from '@/services/mockService';
import { Edit, Trash, Eye, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

// Define Columns here or in a separate config file
const columns: ColumnDef<UserData>[] = [
  {
  id: "select", // This ID must match our check in DataTable.tsx
  header: ({ table }) => (
    <input
      type="checkbox"
      className="form-checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={table.getToggleAllPageRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()} // This triggers the state update
    />
  ),
},
  { 
    accessorKey: "id",
  header: "ID",
  meta: { align: 'center' } // You can check for this in DataTable.tsx
   },
  
  {
    accessorKey: "name",
    header: "User Name",
    cell: (info) => <span className="font-medium text-gray-900">{info.getValue() as string}</span>,
    enableSorting: false, // Disable sorting for name column to demonstrate flexibility
  },
  { accessorKey: "email", header: "Email Address" },
  { accessorKey: "role", header: "User Role" },
   { 
    
    accessorKey: "createdAt", 
    
    header: "Join Date", 

    cell: (info) => dayjs(info.getValue() as string).format('MMM D, YYYY')
   },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as string;
      return (
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold w-fit ${
          status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status === 'Active' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
          {status}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-3">
        <button title="View" className="text-gray-500 hover:text-blue-600 transition-colors"><Eye size={18}/></button>
        <button title="Edit" className="text-gray-500 hover:text-amber-600 transition-colors"><Edit size={18}/></button>
        <button title="Delete" className="text-gray-500 hover:text-red-600 transition-colors"><Trash size={18}/></button>
      </div>
    )
  }
];

export default function PaginationServerSideToDataTable() {
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
    <main className="p-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm">Manage enterprise users and permissions.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </main>
  );
}