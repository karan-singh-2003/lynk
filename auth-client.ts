import { createAuthClient } from 'better-auth/react'
import { magicLinkClient } from 'better-auth/client/plugins'
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000/api/auth',
  plugins: [magicLinkClient()],
})

export type Session = typeof authClient.$Infer.Session
