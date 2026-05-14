"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserById } from '@/services/api.service';
import { EmployeeFormData } from '@/app/(dashboard)/employees/schemas/employeeSchema';
import { 
  ArrowLeft, Edit, Mail, Phone, Calendar, 
  MapPin, Award, Briefcase, User, Droplets, Info 
} from 'lucide-react';
import dayjs from 'dayjs';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // TAG-CASE#5: Fetch specific employee record
        const response = await getUserById(Number(id));
        setEmployee(response.data as unknown as EmployeeFormData);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!employee) return <div className="p-6 text-rose-500 font-bold">Employee not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/employees')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Registry</span>
        </button>
        <button 
          onClick={() => router.push(`/employees/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-all shadow-md shadow-amber-500/20"
        >
          <Edit size={18} />
          Edit Profile
        </button>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-blue-50">
          {employee?.firstName?.[0]}{employee?.lastName?.[0]}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{employee?.firstName} {employee?.lastName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-slate-500 flex items-center gap-2">
            <Briefcase size={16} /> {employee?.gender} • {employee?.yearsOfExp} Years Experience
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
              <Mail size={14} /> {employee?.email || "No Email"}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
              <Phone size={14} /> {employee?.mobile}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <User size={16} /> Personal
          </h3>
          <div className="space-y-3">
            <DetailItem label="Date of Birth" value={employee?.dob ? dayjs(employee.dob).format('DD MMM YYYY') : 'N/A'} />
            <DetailItem label="Age" value={`${employee?.age} Years`} />
            <DetailItem label="Blood Group" value={employee?.bloodGroup} icon={<Droplets size={14} className="text-rose-500"/>} />
          </div>
        </section>

        {/* Academic & Professional */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Award size={16} /> Professional
          </h3>
          <div className="space-y-3">
            <DetailItem label="Last Degree %" value={`${employee?.securedPecentageInLastDegree}%`} />
            <DetailItem label="Experience" value={`${employee?.yearsOfExp} Yrs`} />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {employee?.skills?.map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                    {skill}
                  </span>
                )) || "None listed"}
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <MapPin size={16} /> Address
          </h3>
          <div className="space-y-3">
            <DetailItem label="City" value={employee?.city} />
            <DetailItem label="Postal Code" value={employee?.postalCode} />
            <DetailItem label="Country" value={employee?.country} />
            <DetailItem label="Full Address" value={employee?.address} isFullWidth />
          </div>
        </section>

        {/* Secondary Contact Info (Full Width) */}
        <section className="md:col-span-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Info size={16} /> Emergency & Secondary Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DetailItem label="Alt Mobile" value={employee?.altMobile} />
            <DetailItem label="Alt Email" value={employee?.altEmail} />
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Reusable Mini-Component for layout consistency
 */
const DetailItem = ({ label, value, icon, isFullWidth = false }: any) => (
  <div className={isFullWidth ? "col-span-full" : ""}>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
      {icon} {value || "—"}
    </p>
  </div>
);