"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, UserPlus, ArrowLeft, RefreshCw } from 'lucide-react';
import { employeeSchema, EmployeeFormData } from '@/app/(dashboard)/employees/schemas/employeeSchema';
import { employeeService } from '@/services/api.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  isEdit?: boolean;
}

export default function EmployeeForm({ initialData, isEdit = false }: EmployeeFormProps) {
  const router = useRouter();





  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange", // This helps see errors in real-time
    defaultValues: {
      gender: "MALE",
      skills: [],
      yearsOfExp: 0
    }
  });
  
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    console.error("ZOD VALIDATION FAILED:", errors);
  }
}, [errors]);




  // Hydrate form when initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData); 
    }
  }, [initialData, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      console.log("ID Type:", typeof initialData?.id)
      if (isEdit) {
        // Architect Note: Always trust the prop-passed ID for updates 
        // to avoid form-state hydration desyncs.
        const employeeId = initialData?.id; 
        
        if (!employeeId) {
          toast.error("Critical Error: No Employee ID found for update.");
          return;
        }

        // TAG-CASE#5: Explicitly use the ID from props
        await employeeService.updateEmployee(employeeId, data);
        toast.success("Employee profile updated successfully");
      } else {
        await employeeService.createEmployee(data);
        toast.success("New employee onboarded successfully");
      }
      
      router.push('/employees');
      router.refresh(); 
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Failed to save employee data. Please check backend logs.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {isEdit ? <RefreshCw className="text-blue-600" size={24} /> : <UserPlus className="text-blue-600" size={24} />}
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {isEdit ? "Update Employee Profile" : "Employee Registration"}
          </h2>
        </div>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* --- SECTION: BASIC INFO --- */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identity</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Employee ID *</label>
            <input 
              {...register("id", { valueAsNumber: true })} 
              type="number" 
              //readOnly={isEdit} // IDs are typically immutable in enterprise systems
              className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm transition-all outline-none ${isEdit ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500/20'} ${errors.id ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Enter numeric ID"
            />
            {errors.id && <p className="text-red-500 text-[10px] font-medium">{errors.id.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">First Name *</label>
            <input 
              {...register("firstName")} 
              className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-slate-200'}`}
            />
            {errors.firstName && <p className="text-red-500 text-[10px] font-medium">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Gender</label>
            <select 
              {...register("gender")} 
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </section>

        {/* --- SECTION: CONTACT --- */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
            <input 
              {...register("mobile")} 
              placeholder="+91 XXXXX XXXXX"
              className={`w-full p-2.5 border rounded-lg text-sm outline-none ${errors.mobile ? 'border-red-500' : 'border-slate-200'}`}
            />
            {errors.mobile && <p className="text-red-500 text-[10px] font-medium">{errors.mobile.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input 
              {...register("email")} 
              type="email" 
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none"
            />
          </div>
        </section>

        {/* --- SECTION: PROFESSIONAL --- */}
        <section className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Metrics & Professional</h3>
          </div>
           
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Experience (Years)</label>
            <input 
              {...register("yearsOfExp", { valueAsNumber: true })} 
              type="number" 
              step="0.1" 
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Current Age</label>
            <input 
              {...register("age", { valueAsNumber: true })} 
              type="number" 
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Last Degree %</label>
            <input 
              {...register("securedPecentageInLastDegree", { valueAsNumber: true })} 
              type="number" 
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none" 
            />
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            <>
              <Save size={18} /> 
              <span>{isEdit ? "Update Record" : "Complete Onboarding"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}