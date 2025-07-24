'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import PageLoader from '@/components/Global/PageLoader'
import useSession from '@/hooks/useSession'
import WorkspaceDescription from '@/components/Global/WorkspaceDescription'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/Global/Spinner'
import {
  getUserLastWorkspaceSlug,
  getUserWorkspaces,
} from '@/actions/workspace'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { session, loading } = useSession()

  const token = params?.token as string | undefined

  const [error, setError] = useState<string | null>(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [sessionUser, setSessionUser] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inviteResponse, setInviteResponse] = useState<string | null>(null)

  useEffect(() => {
    if (loading || !token) return

    const checkUserAndRedirect = async () => {
      const isUserInWorkspace = await getUserWorkspaces()
      console.log('User Workspaces:', isUserInWorkspace)

      if (!session || !session.data?.user?.email) {
        console.log('No session or user email found, redirecting to sign-in.')
        localStorage.setItem('pending_invite_token', token)
        router.replace(`/sign-in?redirect=/invite/${token}`)
        return
      }

      const hasPendingToken =
        token || localStorage.getItem('pending_invite_token')

      if (hasPendingToken) {
        setSessionUser(true)
        return
      } else {
        try {
          console.log(
            'Fetching last active workspace slug for user:',
            session.data.user.email
          )
          const lastActiveWorkspace = await getUserLastWorkspaceSlug(
            session.data.user.email
          )

          if (lastActiveWorkspace) {
            router.replace(`/${lastActiveWorkspace}`)
          }
        } catch (err) {
          console.error('Error fetching last active workspace:', err)
          setError('Failed to fetch workspace information.')
        }
      }
    }

    checkUserAndRedirect()
  }, [session, loading, token, router])

  const handleAcceptInvite = async () => {
    if (!token) return
    setIsSubmitting(true)

    try {
      const res = await axios.post('/api/invite/accept', { token })
      console.log('Accept invite response:', res)
      if (res.status === 200) {
        localStorage.removeItem('pending_invite_token')
        const redirectTo =
          typeof res.data?.redirectTo === 'string'
            ? res.data.redirectTo
            : '/dashboard'

        router.replace(redirectTo)
      } else {
        const message =
          typeof res.data === 'string'
            ? res.data
            : res.data?.message || 'Something went wrong.'
        setInviteResponse(message)
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>
      console.error('Error accepting invite:', axiosErr)
      const message =
        (axiosErr?.response?.data || {}).message || 'Failed to accept invite.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <PageLoader title="Loading" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-center">
        <p className="text-red-500 font-medium text-sm">{error}</p>
      </div>
    )
  }

  return (
    <>
      {sessionUser && (
        <div className="h-[300px] w-[350px] mx-auto mt-[50px] flex flex-col items-center justify-center">
          <WorkspaceDescription setIsPrivate={setIsPrivate} />

          <h1 className="text-center font-medium text-[#696767] text-[15px] mb-4">
            {isPrivate
              ? 'Only selected members can access this workspace. Please request permission from the owner to join.'
              : 'Anyone can join this workspace and become a member instantly.'}
          </h1>

          {inviteResponse ? (
            <p className="text-center text-green-700 font-medium text-sm mb-4">
              {inviteResponse}
            </p>
          ) : (
            <Button
              className="bg-[#246EFF] rounded-none"
              onClick={handleAcceptInvite}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : 'Send Join Request'}
            </Button>
          )}
        </div>
      )}
    </>
  )
}
