"use client";
import React, { useState } from 'react';
import { X, Upload, FileCheck, Loader2 } from 'lucide-react';
import { documentService } from '@/services/api.service';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const ManualUploadModal = ({ filename, isOpen, onClose, onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !filename) return null;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // Reusing the service but targeting the manual-upload endpoint
      await documentService.manualUpload(file, filename); 
      onUploadSuccess();
      onClose();
    } catch (error) {
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Manual Version Upload</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center gap-3">
            <Upload className="text-blue-500" size={32} />
            <input 
              type="file" 
              accept=".docx" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-[10px] text-slate-400">Target File: <span className="font-mono text-blue-600">{filename}</span></p>
          </div>

          <button
            disabled={!file || uploading}
            onClick={handleUpload}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:bg-slate-200 transition-all shadow-lg shadow-blue-500/20"
          >
            {uploading ? <Loader2 className="animate-spin" size={18}/> : <FileCheck size={18}/>}
            {uploading ? 'Synchronizing...' : 'Update Production Version'}
          </button>
        </div>
      </div>
    </div>
  );
};