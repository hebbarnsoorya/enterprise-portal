"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevention of Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-slate-50 h-screen w-screen" />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. Sidebar - Collapsible Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        
        {/* 2. Global Header - i18n & Profile */}
        <Header isSidebarOpen={isSidebarOpen} />

        {/* 3. Main Viewport */}
        <main className="flex-1 overflow-y-auto relative p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Your TAG-CASE#1 DataTable renders here */}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop: 
        Only visible on small screens when the sidebar is forcing its way over the content.
        Note: Adjust logic based on how your Sidebar component handles mobile 'isOpen'.
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}