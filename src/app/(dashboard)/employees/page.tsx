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
    <div className="p-6 space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Registry</h1>
          <p className="text-slate-500 text-sm">Manage staff records and billing associations</p>
        </div>
        <button 
          onClick={() => router.push('/employees/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Onboard Staff</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-400 text-sm font-medium">Syncing Registry...</p>
          </div>
        ) : data.length > 0 ?(
          <DataTable columns={columns} data={data} />
        ): (
          /* TASK#070526A1157.2: No Data Handle */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 text-center animate-in zoom-in-95">
             <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100">
                <SearchX size={48} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No Employees Detected</h3>
             <p className="text-slate-500 text-sm max-w-[280px] mt-2 leading-relaxed">
                The Employee Registry is currently empty. Initialize a new onboard Staff using the button above..
             </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AlertDialog open={!!deleteId} onOpenChange={() => !isDeleting && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">Archive Record?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              This will move the employee to the inactive registry. Billing data remains preserved for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent modal from closing immediately
                handleArchive();
              }}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
              disabled={isDeleting}
            >
              {isDeleting ? "Archiving..." : "Yes, Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}