import { z } from 'zod';

// src/app/(dashboard)/employees/schemas/employeeSchema.ts
export const employeeSchema = z.object({
  // Use coerce to handle string/number mixing from backend/form
  id: z.coerce.number().min(1, "ID is required"),
  
  firstName: z.string().min(2, "First name is required"),
  
  // .nullable() handles backend nulls; .or(z.literal("")) handles empty form inputs
  lastName: z.string().nullable().optional().or(z.literal("")),
  
  mobile: z.string().min(10, "Valid mobile required"),
  
  // Email is tricky; only validate format if value is actually provided
  email: z.preprocess((val) => val === "" ? undefined : val, 
    z.string().email().nullable().optional()
  ),

  age: z.coerce.number().min(18, "Min 18").default(18),
  
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  
  skills: z.array(z.string()).default([]),
  
  yearsOfExp: z.coerce.number().min(0).default(0),
  securedPecentageInLastDegree: z.coerce.number().min(0).max(100).default(0),
  
  // Apply this pattern to all other optional strings
  address: z.string().nullable().optional().or(z.literal("")),
  city: z.string().nullable().optional().or(z.literal("")),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;