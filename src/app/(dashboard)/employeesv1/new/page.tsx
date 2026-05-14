"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, UserPlus } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm';

/**
 * TAG-CASE#5: Employee Onboarding Page
 * Entry point for creating new employee records in the Registry.
 */
export default function NewEmployeePage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Breadcrumb / Navigation Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/employees')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Return to Registry"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard Staff</h1>
            <p className="text-slate-500 text-sm italic">Enter details to create a new employee profile</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          <UserPlus size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-[10px]">New Record</span>
        </div>
      </div>

      {/* Reusable Form Component */}
      <main className="pb-12">
        <EmployeeForm />
      </main>
      
      {/* Footer Info */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          Enterprise Billing & Registry System • SECURE-NODE-2026
        </p>
      </div>
    </div>
  );
}