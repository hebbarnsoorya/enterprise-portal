"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Edit3, Loader2 } from 'lucide-react';
import EmployeeForm from '../../components/EmployeeForm';
import { employeeService } from '@/services/api.service';
import { EmployeeFormData } from '../../schemas/employeeSchema';

/**
 * TAG-CASE#5: Employee Edit Orchestrator
 * Fetches existing record by ID and hydrates the EmployeeForm.
 */
export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<EmployeeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        // TAG-CASE#5: Fetch record from Spring Boot via ID
        const response = await employeeService.getEmployeeById(Number(id));
        setInitialData(response.data);
      } catch (err) {
        console.error("Failed to load employee for editing:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Retrieving Profile...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">Failed to load employee record.</h2>
        <button 
          onClick={() => router.push('/employees')}
          className="text-blue-600 font-medium hover:underline"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header section */}
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Update Profile</h1>
            <p className="text-slate-500 text-sm italic">Modifying record for ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
          <Edit3 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-[10px]">Edit Mode</span>
        </div>
      </div>

      {/* Hydrated Form */}
      <main className="pb-12">
        <EmployeeForm initialData={initialData} isEdit={true} />
      </main>
    </div>
  );
}