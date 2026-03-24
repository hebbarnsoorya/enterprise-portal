"use client";

import React, { useEffect } from 'react';
import { X, Mail, Shield, Calendar, MapPin, User, Phone, Globe } from 'lucide-react';

interface ProfileDrawerProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ user, isOpen, onClose }: ProfileDrawerProps) => {
  // Prevent scrolling the background table when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!user) return null;

  return (
    <>
      {/* 1. BACKDROP: Smooth fade-in with blur */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. DRAWER PANEL: Slide from right with spring-like easing */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-[-20px_0_25px_-5px_rgba(0,0,0,0.1)] z-[70] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          
          {/* HEADER SECTION */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">User Details</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"
            >
              <X size={22} />
            </button>
          </div>

          {/* MAIN CONTENT (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Profile Hero */}
            <div className="p-8 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
              <div className="w-24 h-24 bg-white border-4 border-white shadow-xl rounded-3xl flex items-center justify-center text-3xl font-bold text-blue-600 mb-4 animate-in zoom-in duration-500">
                {user.name?.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-500 font-medium mb-3">{user.email}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {user.status}
              </span>
            </div>

            {/* Information Grid */}
            <div className="p-8 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account Overview</h4>
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem icon={<Shield size={16}/>} label="Assigned Role" value={user.role} />
                  <InfoItem icon={<Calendar size={16}/>} label="Member Since" value={user.createdAt} />
                  <InfoItem icon={<Phone size={16}/>} label="Phone Number" value="+1 (555) 000-0000" />
                  <InfoItem icon={<Globe size={16}/>} label="Timezone" value="GMT +5:30 (India)" />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500 italic">
                  Last login recorded 2 hours ago from Chrome (macOS).
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Edit Profile
            </button>
            <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Sub-component for clean mapping
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);