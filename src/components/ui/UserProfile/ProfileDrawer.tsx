"use client";

import React from 'react';
import { X, Mail, Shield, Calendar, MapPin } from 'lucide-react';

interface ProfileDrawerProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ user, isOpen, onClose }: ProfileDrawerProps) => {
  if (!user) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mt-2 uppercase tracking-wider">
                {user.status || 'Active'}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Mail size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Email Address</p>
                  <p className="text-sm font-medium text-slate-700">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Shield size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Role & Permissions</p>
                  <p className="text-sm font-medium text-slate-700">{user.role || 'Standard User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/20">
              Edit Details
            </button>
            <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-lg hover:bg-slate-100 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};