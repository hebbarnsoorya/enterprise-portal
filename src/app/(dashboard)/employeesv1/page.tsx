"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import { employeeService } from '@/services/api.service';
import { EmployeeFormData } from '@/app/(dashboard)/employees/schemas/employeeSchema';
import { 
  Plus, 
  Mail, 
  Phone, 
  Edit, 
  Trash, 
  Loader2, 
  SearchX
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EmployeeRegistryPage() {
  const router = useRouter();
  const [data, setData] = useState<EmployeeFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // TAG-CASE#5: Data synchronization
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeService.getEmployees({ page: 0, size: 100 });
        const content = response.content || response;
        setData(content);
      } catch (error) {
        toast.error("Failed to sync registry with server");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  // TAG-CASE#5: Safe Archiving Logic
  const handleArchive = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(deleteId);
      setData(prev => prev.filter(emp => emp.id !== deleteId));
      toast.success("Employee record archived successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Could not archive record. Check server logs.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<EmployeeFormData>[]>(() => [
    {
      accessorKey: "firstName",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 leading-tight">
            {row.original.firstName} {row.original.lastName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ID: {row.original.id}
          </span>
        </div>
      )
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail size={12} className="text-slate-400" />
            {row.original.email || 'N/A'}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Phone size={12} className="text-slate-400" />
            {row.original.mobile}
          </div>
        </div>
      )
    },
    {
      accessorKey: "yearsOfExp",
      header: "Experience",
      cell: (info) => (
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
          {info.getValue() as number} YRS
        </span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => router.push(`/employees/${row.original.id}/edit`)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
            title="Edit Profile"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => setDeleteId(row.original.id)} // Open Modal
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Archive Record"
          >
            <Trash size={16} />
          </button>
        </div>
      )
    }
  ], [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
  <div className="max-w-7xl mx-auto space-y-6">

    {/* Header Section */}
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/40">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-transparent to-indigo-50/40 pointer-events-none"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase">
            Employee Management System
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
            Employee Registry -V1
          </h1>

          <p className="text-slate-500 text-sm lg:text-base leading-relaxed max-w-2xl">
            Manage employee records, workforce information, billing associations,
            and operational registry activities through a centralized production-ready dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/employees/new')}
            className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-300/40 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Onboard Staff</span>
          </button>
        </div>
      </div>
    </div>

    {/* Analytics / Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Employees</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">
              {data.length}
            </h3>
          </div>

          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Plus size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Registry Status</p>
            <h3 className="text-xl font-black text-emerald-600 mt-2">
              Active
            </h3>
          </div>

          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Synchronization</p>
            <h3 className="text-xl font-black text-blue-600 mt-2">
              Live Sync
            </h3>
          </div>

          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Loader2 size={18} className="text-indigo-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Table Section */}
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/30">

      {/* Table Top Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Employee Directory
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Operational employee records and onboarding management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Production Ready UI
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="relative">

        {loading ? (
          <div className="h-[420px] flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-white to-slate-50">

            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-200 blur-2xl opacity-40 animate-pulse"></div>

              <div className="relative h-20 w-20 rounded-full border border-blue-100 bg-white shadow-lg flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={36} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-base font-bold text-slate-700">
                Synchronizing Employee Registry
              </p>

              <p className="text-sm text-slate-400">
                Please wait while we fetch the latest workforce records...
              </p>
            </div>
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-hidden">
            <DataTable columns={columns} data={data} />
          </div>
        ) : (
          /* TASK#070526A1157.2: No Data Handle */
          <div className="relative flex flex-col justify-center items-center py-28 px-6 text-center bg-gradient-to-b from-white to-slate-50 animate-in zoom-in-95">

            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50/30 to-transparent"></div>

            <div className="relative bg-white shadow-xl shadow-slate-200/40 p-7 rounded-full mb-6 border border-slate-100">
              <SearchX size={52} className="text-slate-300" />
            </div>

            <div className="relative space-y-3 max-w-md">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                No Employees Detected
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                The Employee Registry is currently empty.
                Initialize and onboard a new employee record to activate
                workforce tracking and operational management.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => router.push('/employees/new')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:scale-[1.02]"
                >
                  <Plus size={18} />
                  <span>Create First Employee</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Confirmation Modal */}
    <AlertDialog
      open={!!deleteId}
      onOpenChange={() => !isDeleting && setDeleteId(null)}
    >
      <AlertDialogContent className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 p-0 overflow-hidden">

        <div className="bg-gradient-to-r from-rose-50 to-red-50 border-b border-rose-100 px-6 py-5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              Archive Employee Record?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-600 text-sm leading-relaxed mt-2">
              This action will move the employee into the inactive registry.
              Billing and audit history will remain preserved for compliance
              and operational traceability.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 mb-6">
            <p className="text-xs font-semibold text-amber-700 leading-relaxed">
              Warning: Archived employee records may impact active workforce visibility
              and operational assignment mapping.
            </p>
          </div>

          <AlertDialogFooter className="flex gap-3">

            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 font-semibold"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent modal from closing immediately
                handleArchive();
              }}
              className="rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-xl shadow-rose-200 px-5 py-2.5 font-bold transition-all"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Archiving...</span>
                </div>
              ) : (
                "Yes, Archive"
              )}
            </AlertDialogAction>

          </AlertDialogFooter>
        </div>

      </AlertDialogContent>
    </AlertDialog>

  </div>
</div>
  );
}