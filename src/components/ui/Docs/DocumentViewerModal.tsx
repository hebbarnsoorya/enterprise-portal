"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModal({ filename, isOpen, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // The static URL provided for the GDoc
  // In a dynamic system, this would come from your documentService via Google Drive API
 // const googleDocUrl = "https://docs.google.com/document/d/1Loch7R_NO3OPIXZkibYkjfzP_Q80CQYLBmm-Cg8D_Sw/edit?usp=embed";
//
  const googleDocUrl = "https://docs.google.com/document/d/1TQt7wopE2_ndORxkDVedae5XVfCpEe9s/edit?usp=drive_link&ouid=107549260534815927505&rtpof=true&sd=true";

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-white w-[95vw] h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-300">
        
        {/* Header: Senior Architect Branding & Actions */}
        <header className="px-6 py-3 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-200">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight flex items-center gap-2">
                {filename}
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">LIVE EDITOR</span>
              </h2>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Auto-saving to Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={googleDocUrl.replace('?usp=embed', '')} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all text-xs font-semibold"
            >
              <ExternalLink size={14} />
              Open in New Tab
            </a>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all text-slate-400"
            >
              <X size={22} />
            </button>
          </div>
        </header>
        
        {/* Iframe Body: Google Native Workspace */}
        <div className="flex-1 bg-slate-100 relative group">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Initializing Google Workspace...</p>
            </div>
          )}
          
          <iframe
            src={googleDocUrl}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            allow="autoplay"
            title="Google Doc Editor"
          />
        </div>

        {/* Footer Info */}
        <footer className="px-6 py-2 bg-slate-50 border-t flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <p>Powered by Google Drive API • Enterprise Content Management</p>
          <p>Changes are captured in real-time under your Google Identity</p>
        </footer>
      </div>
    </div>
  );
}