"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { documentService, DocumentData } from '@/services/api.service';
import { Edit, Trash, FileText } from 'lucide-react';
import { SimpleHtmlEditorModal } from '@/components/ui/Docs/SimpleHtmlEditorModal';

export default function DocsManagementPageHTMLEditor() {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await documentService.fetchMockDocuments();
        setData(result);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEditClick = (doc: DocumentData) => {
    setActiveDoc(doc);
    setIsEditModalOpen(true);
  };

  const columns = useMemo<ColumnDef<DocumentData>[]>(() => [
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
      accessorKey: "status", 
      header: "Status",
      cell: (info) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 uppercase">
          {info.getValue() as string}
        </span>
      )
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditClick(row.original)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all border border-transparent hover:border-amber-200"
          >
            <Edit size={16}/>
          </button>
          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all">
            <Trash size={16}/>
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 uppercase">Document Lifecycle Editor</h1>
        <p className="text-slate-500 text-sm italic">Production Grade Hybrid Content Management</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-20 text-center animate-pulse">Loading Document Registry...</div> : (
          <DataTable columns={columns} data={data} />
        )}
      </div>

      <SimpleHtmlEditorModal 
        document={activeDoc} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}