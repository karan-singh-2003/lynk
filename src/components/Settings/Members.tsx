'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Ellipsis } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import CustomDialog from '../Global/CustomModal'
import { getBgColor, getTextColor } from '@/utils/generateColor'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  approveJoinRequest,
  findAllJoinRequests,
  getWorkspaceBySlugWithMembers,
  rejectJoinRequest,
  removeMemberFromWorkspace,
  updateMemberRole,
} from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'

import { authClient } from '../../../auth-client'
import { MemberWithUser } from '@/types'
import InviteMembersPage from '../Global/Invite'
import { useWorkspace } from '@/lib/context/workspace-context'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '../ui/skeleton'
import type { TransformedMember, InvitedTransformedMember } from '@/types'

const MembersList = () => {
  const [displayRemoveDialog, setDisplayRemoveDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<TransformedMember[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [invitedMembers, setInvitedMembers] = useState<
    InvitedTransformedMember[]
  >([])
  const [selectedMemberForRemoval, setSelectedMemberForRemoval] =
    useState<TransformedMember | null>(null)

  // Combine active members and invited members for display
  const allMembers: TransformedMember[] = [
    ...members,
    ...invitedMembers.map((invited) => ({
      ...invited,
      you: false,
      joinedAt: undefined,
    })),
  ]

  const filteredMembers = allMembers.filter((member) =>
    `${member.name} ${member.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const { workspace } = useWorkspace()
  const workspaceSlug = workspace?.slug || ''
  const { data, isPending } = useQueryData<MemberWithUser[]>(
    ['workspaceMembers', workspaceSlug],
    () => getWorkspaceBySlugWithMembers(workspaceSlug),
    true
  )

  useEffect(() => {
    const fetchMembers = async () => {
      const session = await authClient.getSession()
      const userEmail = session?.data?.user?.email

      if (data && userEmail) {
        const transformed: TransformedMember[] = data.map((member) => ({
          id: member.id,
          name:
            [member.user.firstName, member.user.lastName]
              .filter(Boolean)
              .join(' ') || 'Unknown',
          email: member.user.email,
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          workspaceId: member.workspaceId,
          you: member.user.email === userEmail,
          status: 'active' as const,
        }))
        setMembers(transformed)
      }
    }

    fetchMembers()
  }, [data])

  const { data: invitedmembers } = useQueryData(
    ['workspace-join-requests', workspace?.id],
    () => findAllJoinRequests({ workspaceId: workspace?.id || '' }),
    !!workspace?.id
  )

  useEffect(() => {
    if (invitedmembers && Array.isArray(invitedmembers.data)) {
      const invitedTransformed: InvitedTransformedMember[] =
        invitedmembers.data.map((member) => ({
          id: member.id,
          name: member.user.firstName + ' ' + member.user.lastName,
          email: member.user.email,
          userId: member.userId,
          role: member.role,
          workspaceId: member.workspaceId,
          status: 'pending' as const,
        }))
      setInvitedMembers(invitedTransformed)
    }
  }, [invitedmembers])

  const confirmRemoveMember = async (member: TransformedMember) => {
    if (selectedMemberForRemoval) {
      // Add your remove logic here
      console.log('Member removed!', selectedMemberForRemoval)
      const res = await removeMemberFromWorkspace({
        userId: selectedMemberForRemoval.userId,
        workspaceId: selectedMemberForRemoval.workspaceId,
      })

      console.log('member:', member)
      if (res.success) {
        // ✅ Remove from members list by userId
        setMembers((prev) =>
          prev.filter((m) => m.userId !== selectedMemberForRemoval.userId)
        )
      } else {
        console.error('Failed to remove member')
        // Optionally toast here
      }

      setDisplayRemoveDialog(false)
      setSelectedMemberForRemoval(null)
    }
  }

  const handleapproveJoinRequest = async (member: InvitedTransformedMember) => {
    const res = await approveJoinRequest({
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role as 'MEMBER' | 'ADMIN',
    })

    if (res.success) {
      console.log('Join request approved:', res)

      // 1. Remove from invited list
      setInvitedMembers((prev) =>
        prev.filter((m) => m.userId !== member.userId)
      )

      // 2. Add to members list
      const newMember: TransformedMember = {
        ...member,
        joinedAt: new Date(),
        you: false, // optionally check via email if current user
        status: 'active',
      }

      setMembers((prev) => [...prev, newMember])
    } else {
      console.error('Failed to approve join request')
    }
  }

  const handleRejectJoinRequest = async (member: InvitedTransformedMember) => {
    const res = await rejectJoinRequest({
      userId: member.userId,
      workspaceId: member.workspaceId,
    })

    if (res.success) {
      console.log('Join request approved:', res)

      // Optionally filter out the approved member from the invited list
      setInvitedMembers((prev) =>
        prev.filter((m) => m.userId !== member.userId)
      )
    } else {
      console.error('Failed to approve join request')
    }
  }

  const handleRoleChange = async (
    userId: string,
    workspaceId: string,
    newRole: 'MEMBER' | 'ADMIN'
  ) => {
    const res = await updateMemberRole({ userId, workspaceId, role: newRole })

    if (res.success) {
      // ✅ update local state
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId ? { ...member, role: newRole } : member
        )
      )
    } else {
      console.error('Failed to update role')
      // Optionally toast here
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8 ">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="text-sm text-muted-foreground my-1">
          Invite a member to start collaborating on Lynk. Manage members and set
          their access level.{' '}
          <a href="#" className="underline">
            Learn more about inviting members
          </a>
        </p>
      </div>

      {/* Search + Invite */}
      <div className="flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Search members by name or email"
          className="max-w-sm rounded-none h-11 flex items-center"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="rounded-full" onClick={() => setIsDialogOpen(true)}>
          Invite members
        </Button>
      </div>

      {/* Invite Members Dialog */}
      {isDialogOpen && (
        <CustomDialog
          title="Invite Members"
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          className="w-[480px] h-auto"
        >
          <InviteMembersPage />
        </CustomDialog>
      )}

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-2 gap-x-2 bg-transparent text-[#696767]">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="Invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          {/* Member list */}
          <div className="text-sm mt-4">
            <p className="text-muted-foreground mb-4">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 && 's'}
            </p>
            <div className="space-y-4">
              {isPending
                ? Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-center items-center   animate-pulse"
                      >
                        <div className="w-full ">
                          <div className="flex items-center gap-x-2  py-1">
                            <Skeleton className="w-9 h-9 rounded-full bg-gray-300" />
                            <div className="flex flex-col gap-y-1">
                              <Skeleton className="h-4 w-[140px] bg-gray-300 rounded-none" />
                              <Skeleton className="h-4 w-[180px] bg-gray-300 rounded-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                : filteredMembers.map((member) => {
                    const isOwner = member.role.toUpperCase() === 'OWNER'

                    return (
                      <div
                        key={member.id}
                        className="flex items-center border-b pb-4 justify-between"
                      >
                        {/* LEFT: Avatar + Name + Email */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              style={{
                                backgroundColor: getBgColor(member.name),
                                color: getTextColor(member.name),
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex gap-1 font-medium text-sm items-center">
                              {member.name}
                              {member.you && (
                                <span className="text-muted-foreground ml-1">
                                  (You)
                                </span>
                              )}
                              {member.status === 'pending' && (
                                <span className="text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded-full ml-1">
                                  Pending invitation
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground font-medium text-[13px]">
                              {member.email}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Role + Ellipsis */}
                        <div className="flex items-center gap-12">
                          {isOwner ? (
                            <div className="text-sm font-medium text-muted-foreground capitalize mr-7">
                              owner
                            </div>
                          ) : (
                            <Select
                              value={member.role}
                              onValueChange={(val) =>
                                handleRoleChange(
                                  member.userId,
                                  member.workspaceId,
                                  val.toUpperCase() as 'MEMBER' | 'ADMIN'
                                )
                              }
                            >
                              <SelectTrigger className="border-none text-[13px] font-medium rounded-full hover:bg-gray-100 transition">
                                <SelectValue>
                                  {member.role.toLowerCase()}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent side="right" className="w-[240px]">
                                <SelectItem value="Admin">Admin</SelectItem>
                                <p className="text-muted-foreground text-[12px] px-2 -mt-1 mb-2">
                                  Can manage links, members, and delete
                                  workspace
                                </p>
                                <SelectItem value="Member">Member</SelectItem>
                                <p className="text-muted-foreground text-[12px] px-2 mt-1 mb-2">
                                  Can create/edit links, but not manage members
                                  or delete workspace
                                </p>
                              </SelectContent>
                            </Select>
                          )}

                          {isOwner ? (
                            <Ellipsis className="h-4 text-gray-300 cursor-not-allowed" />
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Ellipsis className="h-4 cursor-pointer text-muted-foreground" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMemberForRemoval(member)
                                    setDisplayRemoveDialog(true)
                                  }}
                                >
                                  {member.status === 'pending'
                                    ? 'Cancel invitation'
                                    : 'Remove from workspace'}
                                </DropdownMenuItem>
                                {member.status === 'active' && (
                                  <DropdownMenuItem
                                    onClick={async () => {
                                      const fakeUserId = `user_${member.email.split('@')[0]}`
                                      await navigator.clipboard.writeText(
                                        fakeUserId
                                      )
                                    }}
                                  >
                                    Copy user ID
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    )
                  })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Invitations">
          <div className="p-4">
            <div className="mt-2 space-y-4">
              {invitedMembers?.length > 0 ? (
                invitedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center border-b pb-4 justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          style={{
                            backgroundColor: getBgColor(member.name || ''),
                            color: getTextColor(member.name || ''),
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex gap-1 font-medium text-sm">
                          {member.name}
                        </div>
                        <div className="text-muted-foreground font-medium text-[13px]">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Requested role: {member.role}
                    </div>
                    <div className="flex items-center gap-x-0.5">
                      <Button
                        className="rounded-full"
                        variant="ghost"
                        onClick={() => handleapproveJoinRequest(member)}
                      >
                        Accept
                      </Button>

                      <Button
                        className="rounded-full text-red-500 hover:bg-red-400 hover:text-white text-sm"
                        variant="ghost"
                        onClick={() => handleRejectJoinRequest(member)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No pending requests.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Remove Member Dialog */}
      {displayRemoveDialog && selectedMemberForRemoval && (
        <CustomDialog
          title={`Are you sure you want to ${
            selectedMemberForRemoval.status === 'pending'
              ? 'cancel the invitation for'
              : 'remove'
          } ${selectedMemberForRemoval.name}?`}
          isOpen={displayRemoveDialog}
          onClose={() => {
            setDisplayRemoveDialog(false)
            setSelectedMemberForRemoval(null)
          }}
          className="w-[700px] h-auto"
        >
          <p className="text-sm text-muted-foreground mt-4">
            {selectedMemberForRemoval.status === 'pending' ? (
              <>
                This will cancel the invitation for{' '}
                <strong>{selectedMemberForRemoval.name}</strong> and they will
                no longer be able to join this workspace using the current
                invitation.
              </>
            ) : (
              <>
                This will remove{' '}
                <strong>{selectedMemberForRemoval.name}</strong> from this
                workspace and permanently delete all their associated data —
                including shortened links, custom domains, analytics, and
                integrations. Any shared links will be transferred to the
                workspace owner.
              </>
            )}
          </p>

          <div className="flex justify-end gap-2 mt-5">
            <Button
              variant="ghost"
              className="rounded-full border-none"
              onClick={() => {
                setDisplayRemoveDialog(false)
                setSelectedMemberForRemoval(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive rounded-full text-white hover:bg-destructive/90"
              onClick={() => confirmRemoveMember(selectedMemberForRemoval)}
            >
              {selectedMemberForRemoval.status === 'pending'
                ? `Yes, cancel invitation`
                : `Yes, remove ${selectedMemberForRemoval.name}`}
            </Button>
          </div>
        </CustomDialog>
      )}
    </div>
  )
}

export default MembersList
