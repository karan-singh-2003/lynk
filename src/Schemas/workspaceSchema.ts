import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  workspacename: z.string().min(3).max(30),
  workspaceslug: z.string().min(0).max(30),
})
