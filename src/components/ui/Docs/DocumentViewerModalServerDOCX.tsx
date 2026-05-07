"use client";

import React, { useEffect, useState, useRef } from 'react';
import { documentService } from '@/services/api.service';
import { Save, X, Loader2, FileWarning, Download, HardDrive } from 'lucide-react';
import mammoth from "mammoth";
import { SystemFeedbackModal } from '@/components/ui/Modals/SystemFeedbackModal';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModalServerDOCX({ filename, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>(""); 
  const editorRef = useRef<HTMLDivElement>(null);

  // SYSTEM FEEDBACK STATE
  const [feedback, setFeedback] = useState<{
    isOpen: boolean; 
    type: 'success' | 'error'; 
    title: string; 
    message: string;
    shouldCloseOnAcknowledge: boolean; // Strategic addition
  }>({
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '',
    shouldCloseOnAcknowledge: false
  });

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
      if (!blob || blob.size === 0) throw new Error("File empty or not found.");
      
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.value.trim().length < 50) {
        const rawResult = await mammoth.extractRawText({ arrayBuffer });
        const formattedText = rawResult.value.split('\n').map(line => `<p>${line}</p>`).join('');
        setContent(formattedText);
      } else {
        setContent(result.value);
      }
    } catch (err) {
      setError("Technical Error: Failed to parse .docx stream.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!filename || !editorRef.current) return;
    setIsSaving(true);
    try {
      const updatedHTML = editorRef.current.innerHTML;
      const blob = new Blob([updatedHTML], { type: 'text/html' });

      await documentService.saveDocument(blob, filename); 
      
      // SUCCESS STATE: Set feedback and flag to close main modal on ack
      setFeedback({
        isOpen: true,
        type: 'success',
        title: 'Artifact Synchronized',
        message: `TAG-CASE#1: The binary stream for ${filename} has been persisted to the Windows Storage Pool successfully.`,
        shouldCloseOnAcknowledge: true
      });

    } catch (error) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Persistence Failure',
        message: 'The local storage volume returned an IO error. Ensure write permissions are active for C:\\sn\\work-docs\\uploads.',
        shouldCloseOnAcknowledge: false
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackClose = () => {
    const wasSuccessful = feedback.shouldCloseOnAcknowledge;
    setFeedback(prev => ({ ...prev, isOpen: false }));
    
    // If it was a successful save, close the editor now that the user clicked "Acknowledge"
    if (wasSuccessful) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-6xl h-[94vh] rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Advanced Header */}
        <header className="px-8 py-5 border-b flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg">
              <HardDrive size={22} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 uppercase tracking-tight text-lg flex items-center gap-3">
                {filename}
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black border border-blue-200">DOCX_CORE</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                VOL_MOUNT: <span className="text-slate-600 font-bold underline">C:\sn\work-docs\uploads</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
              className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl hover:shadow-emerald-500/20 disabled:bg-slate-300"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Commit Changes
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
          </div>
        </header>
        
        {/* Editor Container */}
        <div className="flex-1 p-10 bg-slate-100 overflow-auto flex justify-center custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <Loader2 className="animate-spin text-blue-600" size={56} />
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Decoding Binary Stream...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-rose-500 gap-4">
              <FileWarning size={64} className="animate-bounce" />
              <p className="text-lg font-black tracking-tight">{error}</p>
            </div>
          ) : (
            <div className="w-[8.5in] min-h-[11in] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] p-[1in] border border-slate-200 rounded-sm mb-20 animate-in slide-in-from-bottom-5">
              <div 
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="prose prose-slate max-w-none text-slate-900 w-full min-h-[800px] outline-none font-serif text-[11pt] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content || "<p>Parsing internal registry...</p>" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* FEEDBACK OVERLAY (High Z-Index) */}
      <SystemFeedbackModal 
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={handleFeedbackClose}
      />
    </div>
  );
}