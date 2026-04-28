"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { ProfileDrawer } from '@/components/ui/UserProfile/ProfileDrawer'; 
import { DocumentViewerModal } from '@/components/ui/Docs/DocumentViewerModal'; // Updated naming
import { documentService, DocumentData } from '@/services/api.service';
import { Edit, Trash, Eye, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import dayjs from 'dayjs';

export default function DocsManagementPage() {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE MANAGEMENT matching your standards
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [editDocName, setEditDocName] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await documentService.fetchDocuments();
        setData(result);
      } catch (error) {
        console.error("Failed to load documents", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRowClick = (doc: DocumentData) => {
    setSelectedDoc(doc);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (filename: string) => {
    setEditDocName(filename);
    setIsEditModalOpen(true);
  };

  const columns = useMemo<ColumnDef<DocumentData>[]>(() => [
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
    {
      accessorKey: "fileName",
      header: "Document Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-blue-500" />
          <span className="font-semibold text-slate-900">{info.getValue() as string}</span>
        </div>
      ),
    },
    { 
      accessorKey: "lastModified", 
      header: "Last Saved", 
      cell: (info) => dayjs(info.getValue() as string).format('MMM D, YYYY HH:mm')
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const isTagged = status === 'TAG-CASE#1';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${
            isTagged ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
          }`}>
            {isTagged ? <CheckCircle size={12}/> : <Clock size={12}/>}
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
          {/* Eye Button: Opens Side Drawer (Read-Only) */}
          <button 
            title="View" 
            onClick={() => handleRowClick(row.original)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
          >
            <Eye size={16}/>
          </button>
          
          {/* Edit Button: Opens DocumentViewerModal (Edit Mode) */}
          <button 
            onClick={() => handleEditClick(row.original.fileName)}
            title="Edit" 
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
          >
            <Edit size={16}/>
          </button>
          
          <button title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all">
            <Trash size={16}/>
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Docs Management</h1>
          <p className="text-slate-500 text-sm">Manage and version production-grade documents (TAG-CASE#1).</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
          <Plus size={18} />
          <span>Add New Doc</span>
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Fetching Documents...</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            onRowClick={handleRowClick} 
          />
        )}
      </div>

      {/* Side Drawer for Quick View Metadata */}
      <ProfileDrawer 
        user={selectedDoc as any} // Reusing your existing Drawer
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Centered Modal for Editing .docx via API */}
      <DocumentViewerModal 
        filename={editDocName} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}