"use client";

import React, { useState, useRef } from 'react';
import { 
  X, Upload, FileCheck, Loader2, 
  FileWarning, HardDriveUpload, CheckCircle2 
} from 'lucide-react';
import { documentService } from '@/services/api.service';
import { toast } from 'sonner'; // Assuming you use Sonner or similar for notifications

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const ManualUploadModal = ({ filename, isOpen, onClose, onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !filename) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith('.docx')) {
      setFile(selected);
    } else {
      toast.error("Invalid format. Please select a .docx file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    try {
      await documentService.manualUpload(file, filename);
      toast.success("Version Synchronized Successfully", {
        description: `Archive created for ${filename}`
      });
      onUploadSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Synchronization Failed", {
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resetAndClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={resetAndClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
              <HardDriveUpload size={18} className="text-blue-600" />
              Manual Version Sync
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Internal Reference: TAG-CASE#1</p>
          </div>
          <button 
            onClick={resetAndClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* File Target Info */}
          <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-md">
              <FileCheck size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Target Filename</p>
              <p className="text-sm font-mono font-semibold text-slate-700 truncate">{filename}</p>
            </div>
          </div>

          {/* Upload Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              const dropped = e.dataTransfer.files[0];
              if (dropped?.name.endsWith('.docx')) setFile(dropped);
            }}
            className={`
              relative cursor-pointer group py-10 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-3
              ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
              ${file ? 'border-emerald-400 bg-emerald-50/30' : ''}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".docx" 
              onChange={handleFileChange}
            />
            
            <div className={`p-4 rounded-full transition-all ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:scale-110 group-hover:text-blue-500'}`}>
              {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">
                {file ? file.name : "Select Manually Edited Docx"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Drag and drop or click to browse"}
              </p>
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex gap-3 items-start p-4 bg-amber-50 rounded-lg border border-amber-100">
            <FileWarning size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Warning:</strong> Uploading will move the current version to the <span className="font-bold underline">history</span> folder. This action is tracked under production audit logs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={resetAndClose}
              className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!file || uploading}
              onClick={handleUpload}
              className={`
                flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                ${!file || uploading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25 active:scale-[0.98]'}
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Pushing to Production...</span>
                </>
              ) : (
                <>
                  <FileCheck size={18} />
                  <span>Apply New Version</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};