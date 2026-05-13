import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { employeeSchema, EmployeeFormData } from '@/app/(dashboard)/employees/schemas/employeeSchema';
import { employeeService} from '@/services/api.service';

/**
 * TAG-CASE#5: Custom Hook for Employee Form Logic
 * Handles validation, submission, and routing transitions.
 */
export const useEmployeeForm = (initialData?: Partial<EmployeeFormData>) => {
  const router = useRouter();

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      gender: "MALE",
      skills: [],
      yearsOfExp: 0,
      age: 18,
      securedPecentageInLastDegree: 0,
      ...initialData,
    },
  });

  const onSubmit = methods.handleSubmit(async (data: EmployeeFormData) => {
    try {
      // Determine if we are updating or creating based on initialData presence
      if (initialData?.id) {
        await employeeService.updateEmployee(initialData.id, data);
      } else {
        await employeeService.createEmployee(data);
      }
      
      // Success: Route back to the registry list
      router.push('/employees');
      router.refresh(); // Refresh the server components to show new data
    } catch (error) {
      console.error("Employee Submission Error:", error);
      // In a production app, you would trigger a Toast notification here
    }
  });

  return {
    ...methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
    errors: methods.formState.errors,
  };
};