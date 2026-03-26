"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ProfileDrawer } from '@/components/ui/UserProfile/ProfileDrawer';
import { UserData } from '@/services/mockService';
import { Edit, Trash, Eye, CheckCircle, XCircle, Plus, PackageOpen, SearchX, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

import { useDataTable } from '@/hooks/useDataTable';
import { getUsers, createUser } from '@/services/api.service';
import { DataTableV7 } from '@/components/ui/DataTableV7/DataTable';
import { GlobalErrorBoundary } from '@/components/shared/ErrorBoundary/GlobalErrorBoundary';

/**
 * TAG-CASE#1: Column Definitions
 */
const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onClick={(e) => e.stopPropagation()} 
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: "User Name",
    cell: (info) => <span className="font-semibold text-slate-900">{info.getValue() as string}</span>,
  },
  { accessorKey: "email", header: "Email Address" },
  { 
    accessorKey: "role", 
    header: "User Role",
    cell: (info) => <span className="capitalize text-slate-600">{info.getValue() as string}</span>
  },
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
      const isActive = status === 'Active';
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${
          isActive 
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
            : 'bg-rose-50 text-rose-700 ring-rose-600/20'
        }`}>
          {isActive ? <CheckCircle size={12}/> : <XCircle size={12}/>}
          {status}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button title="View" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"><Eye size={16}/></button>
        <button title="Edit" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"><Edit size={16}/></button>
        <button title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash size={16}/></button>
      </div>
    )
  }
];

/**
 * TAG-CASE#5: Content Component
 * Wrapped by ErrorBoundary to catch API/Render failures.
 */
function RegistryV7Content() {
  const [mounted, setMounted] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. Fix: Ensure hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Fix: Memoize fetcher to prevent infinite loops in useDataTable
  const fetcher = useCallback((params: any) => getUsers(params), []);

  const {
    data = [], // Explicit fallback
    loading = true,
    pageCount = 0,
    pagination, setPagination,
    sorting, setSorting,
    globalFilter, setGlobalFilter
  } = useDataTable(fetcher);

  const handleRowClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  // Safe UI checks
  const isActuallyEmpty = !loading && Array.isArray(data) && data.length === 0;

  // Render a minimal shell while mounting to prevent white screen hydration mismatch
  if (!mounted) {
    return (
      <div className="p-6 min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );
  }

  const handleAddUser = async () => {
  // Define the payload for our H2/Spring Boot backend
  const newUser: Partial<UserData> = {
    name: "New Enterprise User",
    email: `test-${Date.now()}@enterprise.com`,
    role: "Editor",
    status: "Active"
  };

  try {
    // This call now works because of the import fix above
        await createUser(newUser as UserData);

    
    // Optional: Add a small alert or toast here
    //alert("User successfully saved to Database!");
        console.info("User successfully saved to Database!");

    // Hard refresh to show the new data in the table
    window.location.reload(); 
  } catch (err) {
    console.error("TAG-CASE#5 Error:", err);
    //alert("Failed to save user. Check if Spring Boot is running on port 8080.");
  }
};

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Registry</h1>
          <p className="text-slate-500 text-sm">TAG-CASE#5: Server-side Pagination with PostgreSQL</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">
            PostgreSQL Connected
          </span>
         <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg..."
        >
          <Plus size={18} /> Add User
        </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
        {isActuallyEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-50 rounded-full mb-4">
              {globalFilter ? <SearchX size={48} className="text-slate-300" /> : <PackageOpen size={48} className="text-slate-300" />}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-700">
                {globalFilter ? 'No matches found' : 'Registry is empty'}
              </h3>
              <p className="text-sm max-w-xs mx-auto text-slate-500">
                {globalFilter 
                  ? `We couldn't find anything matching "${globalFilter}".` 
                  : 'No records found in the database. Please add a user or check your connection.'}
              </p>
              {globalFilter && (
                <button 
                   onClick={() => setGlobalFilter('')} 
                   className="mt-4 text-indigo-600 text-sm font-bold hover:underline"
                >
                  Clear search filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <DataTableV7 
            columns={columns}
            data={data}
            loading={loading}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      <ProfileDrawer 
        user={selectedUser} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}

/**
 * 3. Fix: Final export wrapper with Boundary
 */
export default function RegistryV7Page() {
  return (
    <GlobalErrorBoundary>
      <RegistryV7Content />
    </GlobalErrorBoundary>
  );
}