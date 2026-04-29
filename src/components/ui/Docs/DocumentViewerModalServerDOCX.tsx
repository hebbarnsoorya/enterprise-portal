"use client";

import React, { useEffect, useState, useRef } from 'react';
import { documentService } from '@/services/api.service';
import { Save, X, Loader2, FileWarning, Download } from 'lucide-react';
import mammoth from "mammoth";

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModalServerDOCX({ filename, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>(""); // Core state for HTML
  const editorRef = useRef<HTMLDivElement>(null);

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
      
      if (!blob || blob.size === 0) {
        throw new Error("File is empty or not found on server.");
      }

      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      
      // Fallback for tricky documents
      if (result.value.trim().length < 50) {
        const rawResult = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        const formattedText = rawResult.value
          .split('\n')
          .map(line => `<p>${line}</p>`)
          .join('');
        setContent(formattedText);
      } else {
        setContent(result.value);
      }

      console.log("Render successful. HTML Length:", result.value.length);
    } catch (err) {
      setError("Technical Error: Could not parse the .docx binary.");
      console.error("Extraction Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if(!filename) return;
    try {
      const response = await fetch(`http://localhost:8080/api/docs/download/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleSave = async () => {
    if (!filename || !editorRef.current) return;
    setIsSaving(true);
    try {
      // Grabbing the edited HTML directly from the DOM via Ref
      const updatedHTML = editorRef.current.innerHTML;
      const editedBlob = new Blob([updatedHTML], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      await documentService.saveDocument(editedBlob, filename);
      alert(`TAG-CASE#1: ${filename} versioned and saved.`);
      onClose();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        <header className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span className="p-1 bg-blue-100 text-blue-600 rounded text-xs">DOCX</span>
                {filename}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Storage: C:\sn\work-docs\uploads
              </p>
            </div>
            <button 
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
            >
              <Download size={14} /> Download for Word
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Sync Changes
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-8 bg-slate-200 overflow-auto flex justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-slate-600 font-bold animate-pulse uppercase tracking-tighter">
                Converting Binary Stream...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-rose-500 gap-4">
              <FileWarning size={64} />
              <p className="text-lg font-bold">{error}</p>
            </div>
          ) : (
            /* The "Page" container */
            <div className="w-[8.5in] min-h-[11in] bg-white shadow-2xl p-16 border border-slate-300 rounded-sm mb-10">
              <div 
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="prose prose-slate max-w-none text-slate-900 w-full min-h-[600px] outline-none"
                style={{ 
                  display: 'block',
                  visibility: 'visible',
                  backgroundColor: '#ffffff',
                }}
                dangerouslySetInnerHTML={{ __html: content || "<p>Parsing content...</p>" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}