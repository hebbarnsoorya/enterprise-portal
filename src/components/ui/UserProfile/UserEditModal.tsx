"use client";

import React, { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { UserData } from '@/services/mockService';
// TAG-CASE#5: Import the centralized service
import { getUserById } from '@/services/api.service'; 

interface UserEditModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditModal = ({ userId, isOpen, onClose }: UserEditModalProps) => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isOpen || !userId) return;
      
      setLoading(true);
      try {
        /**
         * TAG-CASE#5: Using Centralized API Service
         * We call the axios wrapper instead of native fetch.
         */
        const response = await getUserById(userId);
        
        // Since axios returns the body in .data
        setUserInfo(response.data); 
      } catch (error) {
        console.error("API Error - Failed to fetch user details:", error);
        // Optional: Add a toast notification here
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-900">Edit User Profile</h2>
            {userInfo && (
              <span className="text-[10px] text-slate-400 font-mono uppercase">Reference: TAG-CASE#5</span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm text-slate-500 font-medium">Connecting to Spring Boot Service...</p>
            </div>
          ) : userInfo ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={userInfo.name} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={userInfo.email}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  readOnly // Typically emails are locked in edit mode
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Role</label>
                <select defaultValue={userInfo.role} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-rose-500 font-medium">User record not found.</p>
              <button onClick={onClose} className="mt-2 text-sm text-blue-600 underline">Close Modal</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
            Cancel
          </button>
          <button 
            disabled={loading || !userInfo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save size={16} />
            Update User
          </button>
        </div>
      </div>
    </div>
  );
};