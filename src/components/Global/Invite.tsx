'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import BadgeInput from '@/components/Global/BadgeInput'
import { Button } from '@/components/ui/button'
import { createInviteLink } from '@/actions/workspace'
import { sendWorkspaceInvites } from '@/actions/workspace'
import { useWorkspace } from '@/lib/context/workspace-context'
import { useSearchParams } from 'next/navigation'

const InviteMembersPage = () => {
  const [inviteLink, setInviteLink] = useState('')
  const [approvalRequired, setApprovalRequired] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [role, setRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER'>('MEMBER')
  const [copyClicked, setCopyClicked] = useState(false)
  const searchParams = useSearchParams()

  const { workspace } = useWorkspace()

  const workspaceslug = workspace?.slug || searchParams.get('slug') || ''
  const fetchInviteLink = async (approval: boolean) => {
    try {
      const res = await createInviteLink({
        workspaceSlug: workspaceslug,
        role: 'MEMBER',
        approvalRequired: approval,
      })

      if (
        res.status === 200 &&
        typeof res.data === 'object' &&
        res.data !== null &&
        'inviteLink' in res.data
      ) {
        setInviteLink((res.data as { inviteLink: string }).inviteLink)
      } else {
        console.error('Invalid response:', res.data)
      }
    } catch (error) {
      console.error('Failed to create invite link:', error)
    }
  }

  useEffect(() => {
    fetchInviteLink(approvalRequired)
  }, [approvalRequired])

  const handleToggle = () => {
    setApprovalRequired((prev) => !prev)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  console.log('Current workspace slug:', workspaceslug)
  const handleSendInviteButtonClick = async () => {
    if (!emails.length) return
    if (!role) return
    const res = await sendWorkspaceInvites({
      emails,
      role,
      workspaceSlug: workspaceslug, // or get from context
    })

    if (res.status === 200) {
      console.log('Invites sent:', res.data)
    } else {
      console.error('Invite error:', res.data)
    }
  }

  return (
    <div className="">
      <h1 className="text-[#313131] dark:text-white font-semibold lg:text-[15px] ">
        Invite Link
      </h1>
      <h1 className="text-[15px] lg:text-[15px]  font-medium text-muted-foreground mt-1 mb-2">
        This link will invite members as default role Member and will expire in
        7 days
      </h1>

      <div className="relative w-full my-2">
        <div className="flex justify-end">
          <div
            className="flex items-center gap-x-1 cursor-pointer"
            onClick={handleCopy}
          >
            <Copy size={12} className="text-[#747474]" />
            <span className="text-[10px] font-medium text-[#8D8D8D]">
              {copyClicked ? 'Copied' : 'Copy Link'}
            </span>
          </div>
        </div>

        <div className="mt-1">
          <Input
            placeholder="Invite link"
            value={inviteLink}
            readOnly
            className="text-black placeholder:text-[16px] dark:text-white placeholder:text-[#696969] lg:text-[16px]
              border border-[#dadada] dark:border-[#252525] dark:bg-[#252525]
              rounded-none px-4 w-full lg:h-12 h-11
              placeholder:font-medium focus:border-black focus:border-[1.8px] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between my-5 mb-8">
        <div className="flex flex-col">
          <h1 className="text-[#313131] dark:text-white text-[15px] font-semibold">
            Require Approval
          </h1>
          <h1 className="text-sm text-muted-foreground">
            {' '}
            Review members before they join
          </h1>
        </div>
        <Switch
          id="invite-toggle"
          checked={approvalRequired}
          onCheckedChange={handleToggle}
        />
      </div>
      <hr className="border-t dark:border-[#484848] " />

      <h1 className="text-[#313131] dark:text-white font-semibold lg:text-[15px] mt-8 mb-2">
        Invite your coworkers
      </h1>
      <h1 className="text-[15px] lg:text-[15px]  font-medium text-muted-foreground mt-1 mb-4">
        This will send an invite link to email you entered. With that link
        person can join the workspace{' '}
      </h1>
      <BadgeInput
        emails={emails}
        setEmail={setEmails}
        role={role}
        setRole={setRole}
      />
      <Button
        className="rounded-none dark:text-white bg-[#246EFF] mt-5 w-full"
        onClick={() => handleSendInviteButtonClick()}
      >
        Send Invite
      </Button>
    </div>
  )
}

export default InviteMembersPage
