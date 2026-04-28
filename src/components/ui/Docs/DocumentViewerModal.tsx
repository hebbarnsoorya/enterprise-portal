"use client";

import React, { useState } from 'react';
import { documentService } from '@/services/api.service';
import { Save, X, Loader2 } from 'lucide-react';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModal({ filename, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!filename) return;
    setIsSaving(true);
    try {
      // Logic to get editor content as blob goes here
      const mockBlob = new Blob(["Updated Content"], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      await documentService.saveDocument(mockBlob, filename);
      alert(`${filename} saved successfully.`);
      onClose();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 uppercase tracking-tight">Editing: {filename}</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save to Server
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-8 bg-slate-100 overflow-auto flex justify-center">
          <div className="w-[8.5in] min-h-[11in] bg-white shadow-md p-12 border">
            <p className="text-slate-400 italic">.docx Editor Canvas for {filename}</p>
          </div>
        </div>
      </div>
    </div>
  );
}