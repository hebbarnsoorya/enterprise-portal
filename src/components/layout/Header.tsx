"use client";

import React from 'react';
import { Bell, Globe, UserCircle } from 'lucide-react';

export const Header = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Enterprise Portal
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* i18n Switcher Button (Requirement #7) */}
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex items-center gap-2">
          <Globe size={18} />
          <span className="text-xs font-medium">EN</span>
        </button>

        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400 mt-1">Super Administrator</p>
          </div>
          <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold border border-blue-200 shadow-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};