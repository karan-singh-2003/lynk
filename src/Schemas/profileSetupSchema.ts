// src/Schemas/profileSetupSchema.ts
import { z } from 'zod'

export const profileSetupSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  workType: z.string().optional(),
  role: z.string().optional(),
  companySize: z.string().optional(),
})
