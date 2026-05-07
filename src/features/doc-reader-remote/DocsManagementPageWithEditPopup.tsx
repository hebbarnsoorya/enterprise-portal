"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { ProfileDrawer } from '@/components/ui/UserProfile/ProfileDrawer';
import { UserEditModal } from '@/components/ui/UserProfile/UserEditModal'; // New Import
import { fetchMockData, UserData } from '@/services/mockService';
import { Edit, Trash, Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
import dayjs from 'dayjs';

export default function DocsManagementPageWithEditPopup() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // DRAWER & MODAL STATE
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleRowClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (id: number) => {
    setEditUserId(id);
    setIsEditModalOpen(true);
  };

  // Define columns inside useMemo to allow passing the handleEditClick function
  const columns = useMemo<ColumnDef<UserData>[]>(() => [
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
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
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
      accessorKey: "status", 
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const isActive = status === 'Active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${
            isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-rose-600/20'
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
          
          {/* TAG-CASE#5: Call handleEditClick with User ID */}
          <button 
            onClick={() => handleEditClick(row.original.id)}
            title="Edit" 
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
          >
            <Edit size={16}/>
          </button>
          
          <button title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash size={16}/></button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-lowercase">User Management</h1>
          <p className="text-slate-500 text-sm">Monitor system access and user roles across the organization.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing User Data...</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            onRowClick={handleRowClick} 
          />
        )}
      </div>

      {/* Side Drawer for Quick View */}
      <ProfileDrawer 
        user={selectedUser} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* TAG-CASE#5: Centered Popup for Editing via Spring Boot API */}
      <UserEditModal 
        userId={editUserId} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}