'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../auth'
import { headers } from 'next/headers'
import { parseUserAgent } from '@/utils/parse-user-agent'
import { formatDistanceToNow } from 'date-fns'
import { UserProfile } from '@/types'
import { Session } from '@/types'
import type { NotificationsResponse } from '@/types'

export const checkIfUserExists = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return !!user
  } catch (error) {
    console.error('Error checking if user exists:', error)
    return false
  }
}

type ProfileInput = {
  userId: string
  firstName: string
  lastName: string
  role: string
  teamSize: string
  industry: string
}

export const submitProfileSetup = async (data: ProfileInput) => {
  try {
    const { userId, firstName, lastName, role, teamSize, industry } = data

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        workType: role,
        companySize: teamSize,
        industry,
      },
    })

    console.log(' Profile updated successfully')

    return { success: true }
  } catch (error) {
    console.error(' Error updating profile:', error)
    return {
      success: false,
      message: 'Something went wrong while updating profile',
    }
  }
}

export const fetchUserSession = async (): Promise<Session[]> => {
  try {
    const user = await auth.api.getSession({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')
    console.log('User session:', user)

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const currentSessionToken = await user.session.token

    return sessions.map((session) => {
      const { device, os, browser } = parseUserAgent(session.userAgent ?? '')

      return {
        id: session.id,
        device,
        browser,
        os,
        lastActive: formatDistanceToNow(new Date(session.updatedAt), {
          addSuffix: true,
        }),
        current: session.token === currentSessionToken,
      }
    })
  } catch (err) {
    console.error('[FETCH_SESSIONS_ERROR]', err)
    return []
  }
}

export async function getUserInfo(): Promise<UserProfile> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  if (!user) throw new Error('User not found')

  return {
    email: user.email,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
  }
}

export async function revokeSession(sessionId: string) {
  return await prisma.session.delete({
    where: { id: sessionId },
  })
}

export async function updateUserInfo({
  firstName,
  lastName,
}: {
  firstName: string
  lastName: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  console.log('Updating user info:', { firstName, lastName })
  console.log('Session:', session)
  const userId = session?.user?.id

  if (!userId) throw new Error('User not authenticated')

  return await prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
    },
  })
}

export async function getCurrentUserPlan() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const email = session?.user?.email

  if (!email) return { currentPlan: 'FREE', nextBillingDate: null }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { currentPeriodEnd: 'desc' },
        take: 1,
      },
    },
  })

  const plan = user?.currentPlan || 'FREE'
  const nextBillingDate = user?.subscriptions[0]?.currentPeriodEnd ?? null

  return {
    currentPlan: plan,
    nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : null,
  }
}

export const createNotification = async ({
  userId,
  message,
  workspaceId,
}: {
  userId: string
  message: string
  workspaceId?: string
}) => {
  return prisma.notification.create({
    data: {
      userId,
      message,
      workspaceId,
    },
  })
}

export async function getUserNotifications(
  workspaceId: string
): Promise<NotificationsResponse> {
  if (!workspaceId) {
    return { notifications: [], hasUnread: false }
  }

  console.log('Fetching notifications for workspace:', workspaceId)
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { notifications: [], hasUnread: false }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, workspaceId },
    orderBy: { createdAt: 'desc' },
  })

  const hasUnread = await prisma.notification.count({
    where: {
      userId: session.user.id,
      workspaceId,
      read: false,
    },
  })

  return { notifications, hasUnread: hasUnread > 0 }
}

export async function getWorkspaceBySlugForUser(
  workspaceSlug: string,
  userEmail: string
) {
  return prisma.workspace.findFirst({
    where: {
      slug: workspaceSlug,
      OR: [
        {
          createdBy: {
            email: userEmail,
          },
        },
        {
          members: {
            some: {
              user: {
                email: userEmail,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdById: true,
      members: true,
    },
  })
}

export const markNotificationsAsRead = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: {
      read: true,
    },
  })
}
