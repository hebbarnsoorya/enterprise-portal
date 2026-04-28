"use client";

import React, { useEffect, useState, useRef } from 'react';
import { documentService } from '@/services/api.service';
import { Save, X, Loader2, FileWarning } from 'lucide-react';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModalV0({ filename, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to the editable div for capturing changes
  const editorRef = useRef<HTMLDivElement>(null);

  // TASK#2804260759.3: Read file from server when modal opens
  useEffect(() => {
    if (isOpen && filename) {
      fetchAndRenderDocument();
    }
  }, [isOpen, filename]);

  const fetchAndRenderDocument = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await documentService.fetchDocumentContent(filename!);
      
      // For a Senior Architect implementation, we convert the Blob to text or HTML
      // Note: In production, use a library like 'mammoth' or 'react-doc-viewer'
      const text = await blob.text(); 
      
      if (editorRef.current) {
        editorRef.current.innerText = text; // Populating the editor
      }
    } catch (err) {
      setError("Failed to stream document from C:\\sn\\work-docs\\uploads");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // TASK#2804260759.5: Save edited content back to the specific server folder
  const handleSave = async () => {
    if (!filename || !editorRef.current) return;
    
    setIsSaving(true);
    try {
      const updatedContent = editorRef.current.innerText;
      
      // Constructing the blob from the edited content
      const editedBlob = new Blob([updatedContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      await documentService.saveDocument(editedBlob, filename);
      alert(`Success: ${filename} saved to server storage.`);
      onClose();
    } catch (error) {
      console.error("Save operation failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header Section */}
        <header className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span className="p-1 bg-blue-100 text-blue-600 rounded">DOCX</span>
              {filename}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Location: C:\sn\work-docs\uploads
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>
        </header>
        
        {/* Editor Body */}
        <div className="flex-1 p-8 bg-slate-200 overflow-auto flex justify-center custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-slate-600 font-bold animate-pulse uppercase tracking-tighter">Streaming from C:\sn\...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-rose-500 gap-4">
              <FileWarning size={64} />
              <p className="text-lg font-bold">{error}</p>
              <button onClick={fetchAndRenderDocument} className="text-sm underline">Retry Connection</button>
            </div>
          ) : (
            <div 
              className="w-[8.5in] min-h-[11in] bg-white shadow-2xl p-16 border border-slate-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              {/* TASK#2804260759.4: Editable Area */}
              <div
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="prose prose-slate max-w-none min-h-full font-serif text-lg leading-relaxed focus:outline-none"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {/* File content will be injected here via useEffect */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}