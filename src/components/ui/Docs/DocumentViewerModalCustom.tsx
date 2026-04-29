"use client";

import React, { useEffect, useState, useRef } from 'react';
import { documentService } from '@/services/api.service';
import { Save, X, Loader2, Highlighter, Tag, Bell } from 'lucide-react';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModalCustom({ filename, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && filename) {
      loadDocumentAsHtml();
    }
  }, [isOpen, filename]);

  /**
   * 1. VIEW: Fetch HTML export from Spring Boot (which fetched from Google API)
   */
  const loadDocumentAsHtml = async () => {
    setIsLoading(true);
    try {
      // Logic: Spring Boot calls Google Drive API: files.export(mimeType='text/html')
      const response = await documentService.fetchDocumentAsHtml(filename!);
      setHtmlContent(response.html); 
    } catch (err) {
      console.error("Conversion failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 2. EDIT/SAVE: Send modified HTML back to Spring Boot
   */
  const handleSave = async () => {
  if (!filename || !editorRef.current) return;
  
  setIsSaving(true);
  try {
    // 1. Capture the HTML structure (crucial for POI mapping)
    const updatedHtml = editorRef.current.innerHTML; 
    
    // 2. Call the service
    await documentService.saveHtmlAsDocx(updatedHtml, filename);
    
    alert(`TAG-CASE#1: ${filename} synced successfully.`);
    onClose();
  } catch (error) {
    console.error("Round-trip failed", error);
    alert("Error syncing to Google Drive. Check console.");
  } finally {
    setIsSaving(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Advanced Tooling Header */}
        <header className="px-6 py-3 border-b flex justify-between items-center bg-slate-50">
          <div className="flex flex-col">
            <h2 className="font-bold text-slate-800 uppercase text-sm">Custom Editor: {filename}</h2>
            <div className="flex gap-4 mt-1">
               <button className="flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700">
                 <Highlighter size={12}/> MARK COLOR
               </button>
               <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700">
                 <Tag size={12}/> TAG-CASE#1
               </button>
               <button className="flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-700">
                 <Bell size={12}/> SET REMINDER
               </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save & Sync
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
              <X size={20} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-8 bg-slate-200 overflow-auto flex justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-slate-500 font-bold">Converting Google Doc to HTML...</p>
            </div>
          ) : (
            <div 
              className="w-[8.5in] min-h-[11in] bg-white shadow-xl p-16 border border-slate-300 rounded-sm"
            >
              {/* The "Custom" Interface */}
              <div
                ref={editorRef}
                contentEditable={true}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose prose-slate max-w-none min-h-full focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}