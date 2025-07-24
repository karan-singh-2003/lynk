'use client'
import InviteMembersPage from '@/components/Global/Invite'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Spinner from '@/components/Global/Spinner'
const InvitePage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <h1 className="font-bold text-[15px] mb-3 mt-4 text-[#5c5c5c]">
        Workspace setup
      </h1>
      <h1 className="text-[#3b3b3b] font-semibold text-[20px]">
        Invite Members to your Workspace
      </h1>
      <h1 className="font-semibold text-[14px] mb-5 lg:text-[15px] text-[#575757]">
        Add teammates to get things done together. You can always update
        permissions later
      </h1>

      <InviteMembersPage />
      <Button
        variant="outline"
        className="rounded-none w-full mt-2"
        disabled={loading}
        onClick={() => {
          setLoading(true)
          router.push('/profile-setup')
        }}
      >
        {loading ? <Spinner /> : 'Continue'}
      </Button>
    </div>
  )
}

export default InvitePage
