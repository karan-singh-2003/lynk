'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getColorForString } from '@/utils/getColorFromString'
import { getInviteWorkspace } from '@/actions/workspace'
import { Skeleton } from '@/components/ui/skeleton'
import { InviteWorkspaceResponse, Member } from '@/types'
import { useParams } from 'next/navigation'

interface WorkspaceDescriptionProps {
  isPrivate?: boolean
  setIsPrivate?: (isPrivate: boolean) => void
}

/** ---------- Helper ---------- **/

const getInitials = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/** ---------- Component ---------- **/

const WorkspaceDescription: React.FC<WorkspaceDescriptionProps> = ({
  setIsPrivate,
}) => {
  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [members, setMembers] = useState<Member[]>([])

  const visibleMembers = members.slice(0, 5)
  const remainingCount = members.length - visibleMembers.length
  const params = useParams()

  useEffect(() => {
    let token = localStorage.getItem('pending_invite_token') || params?.token
    if (Array.isArray(token)) {
      token = token[0]
    }
    if (!token) return

    const fetchWorkspaceName = async () => {
      setIsLoading(true)

      try {
        const res: InviteWorkspaceResponse = await getInviteWorkspace(token)
        console.log('Fetched workspace response:', res)
        if (res.status === 200 && typeof res.data !== 'string') {
          setWorkspaceName(res.data.workspace.name)
          setMembers(res.data.workspace.members)

          if (setIsPrivate) {
            setIsPrivate(res.data.approvalRequired)
          }
        } else if (typeof res.data === 'string') {
          setWorkspaceName(res.data)
        } else {
          console.error('Unexpected response:', res.data)
          setWorkspaceName('Error loading workspace')
        }
      } catch (error) {
        console.error('Error fetching workspace:', error)
        setWorkspaceName('Error fetching workspace')
      }

      setIsLoading(false)
    }

    fetchWorkspaceName()
  }, [setIsPrivate])

  return (
    <div className="space-y-6 p-6 rounded-lg flex flex-col items-center justify-center">
      {/* Workspace Logo or Fallback */}
      <div className="flex flex-col items-center justify-center gap-y-2">
        {isLoading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : (
          <div className="p-4 text-lg rounded-full bg-green-200 text-green-600 w-fit font-semibold">
            {workspaceName.trim().slice(0, 2).toUpperCase() || '??'}
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-6 w-48 rounded-none" />
        ) : (
          <h1 className="font-semibold text-2xl text-center">
            Join {workspaceName}
          </h1>
        )}
      </div>

      {/* Members */}
      {isLoading ? (
        <div className="flex items-center -space-x-3">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex items-center -space-x-3">
          {visibleMembers.map((member) => (
            <Avatar key={member.id} className="ring-2 ring-white w-10 h-10">
              <AvatarFallback
                style={{ backgroundColor: getColorForString(member.user.name) }}
                className="text-[#444444] font-semibold"
              >
                {getInitials(member.user.name)}
              </AvatarFallback>
            </Avatar>
          ))}

          {remainingCount > 0 && (
            <div className="h-10 w-fit flex items-center justify-center text-sm font-medium ml-5">
              +{remainingCount} <span className="ml-1">more</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkspaceDescription
