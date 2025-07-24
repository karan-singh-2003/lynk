import { prisma } from '@/lib/prisma'
import { auth } from '../../../../../auth' // your session fetcher
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'

const bodySchema = z.object({
  token: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    console.log('Processing invite accept request...')
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json('Unauthorized. Please sign in.', { status: 401 })
    }

    const { token } = bodySchema.parse(await req.json())
    console.log('Invite token received:', token)

    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        workspace: true,
      },
    })
    console.log('Invite details in api:', invite)
    if (!invite) {
      return NextResponse.json('Invalid or expired invite link.', {
        status: 404,
      })
    }

    // Check expiration
    if (invite.expiresAt < new Date()) {
      return NextResponse.json('This invite link has expired.', { status: 410 })
    }

    // Check if user already in the workspace
    const existingMember = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        workspaceId: invite.workspaceId,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { redirectTo: `/${invite.workspace.slug}` },
        { status: 200 }
      )
    }

    // if approval required, don't add to member, add join request
    if (invite.approvalRequired) {
      console.log('Approval required for this invite:', invite.approvalRequired)
      const existingRequest = await prisma.joinRequest.findFirst({
        where: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
        },
      })
      console.log('Existing join request:', existingRequest)

      if (existingRequest) {
        return NextResponse.json(
          'You’ve already requested to join. Please wait for approval.',
          { status: 500 }
        )
      }

      await prisma.joinRequest.create({
        data: {
          userId: session.user.id,
          workspaceId: invite.workspaceId,
          role: invite.role,
        },
      })
      //send notification to workspace owner
      await prisma.notification.create({
        data: {
          userId: invite.workspace.createdById,
          message: `${session.user.name} has requested to join your workspace "${invite.workspace.name}".`,
          workspaceId: invite.workspaceId,
        },
      })

      return NextResponse.json('Your join request has been sent.', {
        status: 202,
      })
    }

    // Add user to workspace
    await prisma.member.create({
      data: {
        userId: session.user.id,
        workspaceId: invite.workspaceId,
        role: invite.role,
      },
    })
    console.log('User added to workspace:', invite.workspaceId)

    // show notification to owner of workspace that user has joined
    await prisma.notification.create({
      data: {
        userId: invite.workspace.createdById,
        message: `${session.user.name} has joined your workspace "${invite.workspace.name}".`,
        workspaceId: invite.workspaceId,
      },
    })

    return NextResponse.json(
      {
        redirectTo: `/${invite.workspace.slug}`,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Invite Accept Error:', err)
    return NextResponse.json('Server error. Please try again.', { status: 500 })
  }
}
