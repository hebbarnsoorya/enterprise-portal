"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, FilePlus, Save, Loader2, 
  Terminal, ShieldCheck, Info, CheckCircle2 
} from 'lucide-react';
import { documentService } from '@/services/api.service';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDocModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({ 
    fileName: '', 
    status: 'INITIATED', 
    htmlContent: '<p>Initial Document Structure</p>' 
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on filename for faster workflow
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
  // Senior Architect Standard: Prevent Windows reserved characters
  // Illegal: \ / : * ? " < > |
  const sanitized = val.replace(/[\\/:*?"<>|]/g, "");
  setFormData({ ...formData, fileName: sanitized });
};

const handleBlur = () => {
  let name = formData.fileName.trim();
  if (name.length === 0) return;

  // Auto-append extension if missing
  if (!name.toLowerCase().endsWith('.docx')) {
    name = `${name}.docx`;
  }
  
  setFormData(prev => ({ ...prev, fileName: name }));
};

  const handleSave = async () => {
  // Final validation before commit
  if (!formData.fileName || formData.fileName === '.docx') {
    toast.error("Validation Error", { description: "Filename cannot be empty." });
    return;
  }

  setLoading(true);
  try {
    await documentService.createNewDocument(formData);
    toast.success("Artifact Committed", {
      description: `Synchronized ${formData.fileName} to DB and Storage.`
    });
    onSuccess();
    onClose();
  } catch (error: any) {
    toast.error("System Error", { description: error.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Heavy Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header - Terminal Style */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/40">
              <FilePlus size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">Initialization Protocol</h3>
              <p className="text-[10px] text-slate-400 font-mono">ID: {`DOC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Main Body */}
        <div className="p-8 space-y-6">
          
          {/* Filename Input Group */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Terminal size={12} /> Target File Descriptor
              </label>
              {formData.fileName.endsWith('.docx') && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-in slide-in-from-right-2">
                  <CheckCircle2 size={12} /> FORMAT VALID
                </span>
              )}
            </div>
            <div className="space-y-2">
  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
    Target File Descriptor
  </label>
           <div className="relative">
            <input 
                ref={inputRef}
                className={`
                w-full px-4 py-3.5 bg-slate-50 border-2 rounded-xl font-mono text-sm outline-none transition-all pr-16
                ${formData.fileName.toLowerCase().endsWith('.docx') 
                    ? 'border-emerald-200 focus:border-emerald-500 bg-emerald-50/20' 
                    : 'border-slate-100 focus:border-blue-500 focus:bg-white'}
                `}
                placeholder="internal_system_spec"
                value={formData.fileName}
                onBlur={handleBlur} // Auto-appends .docx if missing
                onChange={(e) => handleNameChange(e.target.value)}
            />
            
           <p className="text-[9px] text-slate-400 italic">
    * Extension .docx is enforced. Avoid special characters: \ / : * ? " &lt; &gt; |
  </p>
</div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Operational Status</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="CREATED">CREATED</option>
                <option value="INITIATED">INITIATED</option>
                <option value="PROGRESS">PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Access Scope</label>
              <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-700 flex items-center gap-2">
                <ShieldCheck size={16} />
                ADMIN_RESTRICTED
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-3">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px] text-slate-700 font-bold">Automatic Versioning Enabled</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Submitting this form will allocate space in the <strong>Windows storage pool</strong> and create a corresponding metadata entry in the <strong>MySQL cluster</strong>.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all uppercase tracking-widest"
            >
              Abort
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !formData.fileName}
              className={`
                flex-[2] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl
                ${!formData.fileName || loading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18}/>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save size={18}/>
                  <span>Commit Record</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};