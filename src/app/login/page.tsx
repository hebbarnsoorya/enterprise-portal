"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senior Architect Note: In production, this would be an API call to get a JWT.
    // For now, we set a dummy cookie to satisfy our proxy.ts
    document.cookie = "auth-token=dummy-jwt-token; path=/";
    
    // Redirect to dashboard/home
    router.push('/');
    router.refresh(); // Force refresh to let proxy re-evaluate
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-slate-500 mb-8">Enter your credentials to access the portal.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}