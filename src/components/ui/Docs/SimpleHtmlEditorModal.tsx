"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Save, Loader2, Bold, Italic, List, Heading2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DocumentData, documentService } from '@/services/api.service';

interface Props {
  document: DocumentData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleHtmlEditorModal({ document, isOpen, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>('');

const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  // FIX: This prevents the SSR mismatch error
  immediatelyRender: false, 
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[500px]',
    },
  },
  onUpdate: ({ editor }) => {
    if (status === 'CREATED' || status === 'INITIATED') {
      setStatus('PROGRESS');
    }
  },
});

// 1. Add this state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// 2. Wrap your EditorContent in the return statement
{mounted && <EditorContent editor={editor} />}



  // Load content when modal opens
  useEffect(() => {
    if (isOpen && document && editor) {
      editor.commands.setContent(document.htmlContent || '<p>Enter technical specifications here...</p>');
      setStatus(document.status);
    }
  }, [isOpen, document, editor]);

  const handleSave = async () => {
    if (!document || !editor) return;
    setIsSaving(true);
    try {
      const html = editor.getHTML();
      // Service call to Spring Boot
      await documentService.saveHtmlContent(document.id, html, status);
      alert(`TAG-CASE#1: Document saved in ${status} status.`);
      onClose();
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-[94vw] h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header Section */}
        <header className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 tracking-tight flex items-center gap-3">
                {document.fileName}
                <span className="text-[10px] py-0.5 px-2 bg-blue-100 text-blue-700 rounded-full ring-1 ring-blue-600/20">
                  {status}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Enterprise Spec Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
              SYNC CHANGES
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Editor Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          
          {/* Native Toolbar */}
          <div className="px-4 py-2 border-b bg-white flex items-center gap-2">
            <ToolbarButton 
              onClick={() => editor?.chain().focus().toggleBold().run()} 
              isActive={editor?.isActive('bold')} 
              icon={<Bold size={16} />} 
            />
            <ToolbarButton 
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
              isActive={editor?.isActive('heading', { level: 2 })} 
              icon={<Heading2 size={16} />} 
            />
            <ToolbarButton 
              onClick={() => editor?.chain().focus().toggleBulletList().run()} 
              isActive={editor?.isActive('bulletList')} 
              icon={<List size={16} />} 
            />
          </div>

          {/* Scrollable Document Canvas */}
          <div className="flex-1 overflow-y-auto p-10 flex justify-center">
            <div className="w-full max-w-4xl bg-white min-h-full shadow-2xl shadow-slate-200/50 border border-slate-200 p-16 prose prose-slate max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="px-6 py-2 border-t bg-white flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase">
          <p>Task System: 290426A1157.4 Implementation</p>
          <p className="text-emerald-600">● Live Preview Active</p>
        </footer>
      </div>
    </div>
  );
}

// Small Helper Component for Toolbar
const ToolbarButton = ({ onClick, isActive, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded transition-colors ${isActive ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-600/30' : 'hover:bg-slate-100 text-slate-600'}`}
  >
    {icon}
  </button>
);