'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '../../auth'
import { headers } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import { sendInviteEmail } from '@/actions/email'
import type { MemberWithUser } from '@/types'
import type { Workspace } from '@/types'
import { createNotification } from './user'

export async function getUserLastWorkspaceSlug(email: string) {
  console.log('Finding last active workspace for email:', email)

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      lastActiveWorkspace: true, // 👈 make sure relation is loaded
    },
  })

  // Optional: fallback to recent membership if no lastActiveWorkspaceId
  if (!user?.lastActiveWorkspaceId) {
    const fallback = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          orderBy: { joinedAt: 'desc' },
          take: 1,
          include: { workspace: true },
        },
      },
    })
    return fallback?.memberships[0]?.workspace.slug ?? null
  }

  // If lastActiveWorkspaceId exists, fetch slug
  const workspace = await prisma.workspace.findUnique({
    where: { id: user.lastActiveWorkspaceId },
  })

  return workspace?.slug ?? null
}
export const createWorkspace = async (data: {
  workspacename: string
  workspaceslug: string
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    const user = session?.user
    if (!user) {
      return { status: 401, data: 'Unauthorized' }
    }

    // Check for existing name or slug
    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        OR: [{ name: data.workspacename }, { slug: data.workspaceslug }],
      },
    })

    if (existingWorkspace) {
      return {
        status: 400,
        data: 'Workspace name or slug already exists. Try something else.',
      }
    }

    // Create workspace and member in one go
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: data.workspacename,
        slug: data.workspaceslug,
        createdById: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
            joinedAt: new Date(),
          },
        },
      },
    })

    console.log('Workspace created:', newWorkspace)

    // Set last active workspace for the user
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveWorkspaceId: newWorkspace.id },
    })
    console.log('User last active workspace updated:', user.id)
    // Create a welcome notification for the user
    await createNotification({
      userId: user.id,
      message: `Welcome to your new workspace: ${newWorkspace.name}! 🎉`,
      workspaceId: newWorkspace.id,
    })

    return {
      status: 200,
      data: newWorkspace,
    }
  } catch (error) {
    console.error('Error creating workspace:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const verifyInviteLink = async (token: string) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { workspace: true },
  })

  if (!invite) {
    return { status: 404, data: 'Invite not found' }
  }

  if (invite.expiresAt < new Date()) {
    return { status: 400, data: 'Invite link has expired' }
  }

  if (invite.approved === false && invite.approvalRequired) {
    return { status: 403, data: 'Invite requires approval' }
  }

  return {
    status: 200,
    data: {
      workspaceName: invite.workspace.name,
      role: invite.role,
    },
  }
}

export const createInviteLink = async ({
  workspaceSlug,
  role = 'MEMBER',
  approvalRequired = false,
}: {
  workspaceSlug: string
  role?: 'OWNER' | 'ADMIN' | 'MEMBER'
  approvalRequired?: boolean
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    const user = session?.user

    if (!user) {
      return { status: 401, data: 'Unauthorized' }
    }

    // Get the workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    const alreadyInviteLinkExists = await prisma.invite.findFirst({
      where: {
        workspaceId: workspace.id,
        role,
        approvalRequired,
      },
    })
    console.log(
      'Already existing invite link in create link server action:',
      alreadyInviteLinkExists
    )
    if (alreadyInviteLinkExists) {
      return {
        status: 200,
        data: {
          inviteLink: `http://localhost:3000/invite/${alreadyInviteLinkExists.token}`,
          expiresAt: alreadyInviteLinkExists.expiresAt,
          role: alreadyInviteLinkExists.role,
          workspaceName: workspace.name,
        },
      }
    } else {
      // Create unique token
      const token = uuidv4()

      // Set expiry (7 days from now)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Create the invite
      await prisma.invite.create({
        data: {
          token,
          role,
          workspaceId: workspace.id,
          invitedById: user.id,
          expiresAt,
          approvalRequired,
        },
      })

      const inviteLink = `https://localhost:3000/invite/${token}`

      return {
        status: 200,
        data: {
          inviteLink,
          expiresAt,
          role,
          workspaceName: workspace.name,
        },
      }
    }
  } catch (error) {
    console.error('Error creating invite link:', error)
    return {
      status: 500,
      data: 'Something went wrong while creating the invite link',
    }
  }
}

export const sendWorkspaceInvites = async ({
  emails,
  role,
  workspaceSlug,
}: {
  emails: string[]
  role: 'ADMIN' | 'MEMBER' | 'OWNER'
  workspaceSlug: string
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const user = session?.user
    if (!user) {
      return { status: 401, data: 'Unauthorized' }
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }

    const results = []

    for (const email of emails) {
      const token = uuidv4()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await prisma.invite.create({
        data: {
          token,
          role,
          workspaceId: workspace.id,
          invitedById: user.id,
          approvalRequired: false,
          expiresAt,
        },
      })

      const inviteLink = `http://localhost:3000/invite/${token}`

      // Send the invite email
      await sendInviteEmail({
        to: email,
        inviteLink,
        workspaceName: workspace.name,
      })

      results.push({ email, inviteLink })
    }

    return { status: 200, data: results }
  } catch (error) {
    console.error('Error sending workspace invites:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const getInviteWorkspace = async (token: string) => {
  try {
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    if (!invite || !invite.workspace) {
      return { status: 404, data: 'Workspace not found for this invite token' }
    }

    return {
      status: 200,
      data: {
        workspace: invite.workspace,
        approvalRequired: invite.approvalRequired,
      },
    }
  } catch (error) {
    console.error('Error fetching workspace from invite token:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const findAllJoinRequests = async ({
  workspaceId,
}: {
  workspaceId: string
}) => {
  try {
    const requests = await prisma.joinRequest.findMany({
      where: { workspaceId },
      include: {
        user: true, // includes name, email, etc. of the requesting user
      },
    })

    return {
      status: 200,
      data: requests,
    }
  } catch (error) {
    console.error('Error fetching join requests:', error)
    return {
      status: 500,
      data: 'Internal server error',
    }
  }
}

export const approveJoinRequest = async ({
  userId,
  workspaceId,
  role,
}: {
  userId: string
  workspaceId: string
  role?: 'MEMBER' | 'ADMIN'
}) => {
  try {
    // 1. Delete from JoinRequest
    await prisma.joinRequest.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    })

    // 2. Create in Member
    await prisma.member.create({
      data: {
        userId,
        workspaceId,
        role,
      },
    })

    // 3. Fetch workspace and adminId
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          where: { role: 'OWNER' },
          select: { userId: true },
        },
      },
    })
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    const adminId = workspace.members[0]?.userId
    if (!adminId) {
      throw new Error('Admin not found for this workspace')
    }
    const findUserWhoJoined = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })
    if (!findUserWhoJoined) {
      throw new Error('User not found')
    }
    const user = findUserWhoJoined
    // 3. Add Notification for the user
    await createNotification({
      userId, // notify the new member
      message: `Welcome to ${workspace.name}! 🎉`,
      workspaceId,
    })

    await createNotification({
      userId: adminId,
      message: `${user.email} joined your workspace.`,
      workspaceId,
    })

    return { success: true }
  } catch (error) {
    console.error('Approve Join Request Error:', error)
    return { success: false, message: 'Failed to approve request.' }
  }
}

export const rejectJoinRequest = async ({
  userId,
  workspaceId,
}: {
  userId: string
  workspaceId: string
}) => {
  try {
    await prisma.joinRequest.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    })

    // Optionally, you can notify the user about rejection
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })
    if (!user) {
      throw new Error('User not found')
    }
    await createNotification({
      userId,
      message: `Your join request to the workspace has been rejected.`,
      workspaceId,
    })
    console.log(
      `Join request for user ${userId} in workspace ${workspaceId} rejected.`
    )
    return { success: true }
  } catch (error) {
    console.error('Reject Join Request Error:', error)
    return { success: false, message: 'Failed to reject request.' }
  }
}

export const getWorkspaceBySlug = async (slug: string) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!workspace) {
      return null
    }

    return workspace
  } catch (error) {
    console.error('Error fetching workspace by slug:', error)
    return null
  }
}

export async function getWorkspaceBySlugWithMembers(
  slug: string
): Promise<MemberWithUser[]> {
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  })

  if (!workspace) throw new Error('Workspace not found')
  return workspace.members as MemberWithUser[]
}

export const getUserWorkspaces = async (): Promise<Workspace> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

  // Workspaces where user is the owner
  const yourWorkspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      members: true,
    },
  })

  // Workspaces where user is a member (not owner)
  const memberWorkspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
          NOT: {
            role: 'OWNER',
          },
        },
      },
    },
    include: {
      members: true,
    },
  })

  return {
    yourWorkspaces: yourWorkspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      members: ws.members.length,
      current: false,
      slug: ws.slug,
    })),
    memberWorkspaces: memberWorkspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      members: ws.members.length,
      current: false,
      slug: ws.slug,
    })),
  }
}

export async function updateWorkspace(
  workspaceId: string,
  data: Partial<{ name: string; slug: string }>
) {
  const updated = await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  })
  return updated
}

export const updateMemberRole = async ({
  userId,
  workspaceId,
  role,
}: {
  userId: string
  workspaceId: string
  role: 'MEMBER' | 'ADMIN'
}) => {
  try {
    await prisma.member.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    })
    console.log(
      `Member role updated: ${userId} to ${role} in workspace ${workspaceId}`
    )
    // Optionally, you can create a notification for the user
    await createNotification({
      userId,
      message: `Your role has been updated to ${role} in the workspace.`,
      workspaceId,
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating member role:', error)
    return { success: false, message: 'Failed to update role' }
  }
}

export const removeMemberFromWorkspace = async ({
  userId,
  workspaceId,
}: {
  userId: string
  workspaceId: string
}) => {
  try {
    await prisma.member.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error removing member:', error)
    return { success: false, message: 'Failed to remove member' }
  }
}
