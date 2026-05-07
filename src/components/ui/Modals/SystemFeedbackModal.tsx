"use client";
import React from 'react';
import { X, CheckCircle2, AlertTriangle, Terminal, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export const SystemFeedbackModal = ({ isOpen, type, title, message, onClose }: Props) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Terminal Header */}
        <div className={`px-4 py-2 flex justify-between items-center ${isSuccess ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase">
            <Terminal size={14} />
            System Message :: Output_Log
          </div>
          <button onClick={onClose} className="hover:bg-black/10 rounded-md p-1 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-8 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isSuccess ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
          </div>
          
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg 
              ${isSuccess 
                ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-emerald-500/20' 
                : 'bg-slate-900 text-white hover:bg-rose-600 shadow-rose-500/20'}`}
          >
            Acknowledge & Continue <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};