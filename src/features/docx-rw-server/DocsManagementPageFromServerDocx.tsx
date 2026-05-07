"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { ProfileDrawer } from '@/components/ui/UserProfile/ProfileDrawer'; 
import { documentService, DocumentData } from '@/services/api.service';
import { Edit, Trash, Eye, CheckCircle, Clock, Plus, FileText, Upload, DatabaseZap, SearchX } from 'lucide-react';
import dayjs from 'dayjs';
import { DocumentViewerModalServerDOCX } from '@/components/ui/docsx/DocumentViewerModalServerDOCX';
import { ManualUploadModal } from '@/components/ui/Docs/ManualUploadModal';
import { CreateDocModal } from '@/components/ui/Docs/CreateDocModal';
import { SystemFeedbackModal } from '@/components/ui/Modals/SystemFeedbackModal';

export default function DocsManagementPageFromServerDocx() {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editDocName, setEditDocName] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // SYSTEM FEEDBACK STATE
  const [feedback, setFeedback] = useState<{isOpen: boolean; type: 'success' | 'error'; title: string; message: string}>({
    isOpen: false, type: 'success', title: '', message: ''
  });

  const refreshData = async () => {
    try {
      const result = await documentService.fetchDocuments();
      const activeDocs = result.filter((doc: DocumentData) => doc.status !== 'DELETED');
      setData(activeDocs);
    } catch (err) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Network Sync Error',
        message: 'Unable to synchronize with the Document Registry. Please check your service connection.'
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (doc: DocumentData) => {
    // Note: In a true production spec, we would replace window.confirm 
    // with a "ConfirmationModal", but for now we focus on the result message.
    const confirmed = window.confirm(`Initiate decommissioning for ${doc.fileName}?`);
    if (confirmed && doc.id) {
      try {
        await documentService.softDelete(doc.id);
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Lifecycle Updated',
          message: `${doc.fileName} has been moved to the isolated quarantine directory and flagged as DELETED.`
        });
        refreshData();
      } catch (error) {
        setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Protocol Failed',
          message: 'The system encountered an error while attempting to decommission the artifact.'
        });
      }
    }
  };

  const columns = useMemo<ColumnDef<DocumentData>[]>(() => [
    // ... select column remains same ...
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 rounded border-slate-300 text-blue-600"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 rounded border-slate-300 text-blue-600"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: "fileName",
      header: "Document Name",
      cell: (info) => {
        const fname = info.getValue() as string;
        return (
          <div className="flex items-center justify-between w-full group">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              <span className="font-semibold text-slate-900">{fname}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setUploadTarget(fname);
                setIsUploadModalOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-[10px] font-bold rounded transition-all"
            >
              <Upload size={10}/> UPLOAD
            </button>
          </div>
        );
      },
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
          <button title="View" onClick={() => { setSelectedDoc(row.original); setIsDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"><Eye size={16}/></button>
          <button title="Edit-.Docx" onClick={() => { setEditDocName(row.original.fileName); setIsEditModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"><Edit size={16}/></button>
          <button title="Delete" onClick={() => handleDelete(row.original)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash size={16}/></button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase flex items-center gap-2">
             <DatabaseZap size={24} className="text-blue-600" /> DocXs Management
          </h1>
          <p className="text-slate-500 text-sm">Cluster Management & Artifact Lifecycle (TAG-CASE#1).</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus size={18} />
          <span>New DocX Artifact</span>
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Scanning Registry...</p>
          </div>
        ) : data.length > 0 ? (
          <DataTable columns={columns} data={data} onRowClick={(doc) => { setSelectedDoc(doc); setIsDrawerOpen(true); }} />
        ) : (
          /* TASK#070526A1157.2: No Data Handle */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 text-center animate-in zoom-in-95">
             <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100">
                <SearchX size={48} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No Artifacts Detected</h3>
             <p className="text-slate-500 text-sm max-w-[280px] mt-2 leading-relaxed">
                The document registry is currently empty. Initialize a new artifact using the button above.
             </p>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      <SystemFeedbackModal 
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
      />

      <ProfileDrawer user={selectedDoc as any} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <DocumentViewerModalServerDOCX filename={editDocName} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <ManualUploadModal filename={uploadTarget} isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={refreshData} />
      <CreateDocModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={refreshData} />
    </div>
  );
}