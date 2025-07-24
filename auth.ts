import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { PrismaClient } from '@/generated/prisma'
import { openAPI } from 'better-auth/plugins'

import { sendEmail } from '@/actions/email'

const prisma = new PrismaClient()
import { magicLink } from 'better-auth/plugins'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [
    openAPI(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const magicLinkUrl = url
        await sendEmail({
          to: email,
          subject: 'Your Magic Link',
          text: `Click the link to sign in: ${magicLinkUrl}`,
        })
      },
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
