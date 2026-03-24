"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Delay
    setTimeout(() => {
      // 1. Set the 'auth-token' (Requirement #7)
      // In production, 'value' would be the real JWT from your backend
      Cookies.set('auth-token', 'TAG-CASE-1-SESSION-TOKEN', { expires: 7 });

      // 2. Redirect to the Dashboard Root
      router.push('/');
      router.refresh(); // Forces middleware to re-evaluate
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-300">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-slate-500 mb-8 text-sm">Please enter your details to sign in.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="admin@portal.exe" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}