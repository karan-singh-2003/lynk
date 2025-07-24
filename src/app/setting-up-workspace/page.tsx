'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '../../../auth-client'
import {
  getInviteWorkspace,
  getUserLastWorkspaceSlug,
} from '@/actions/workspace'
import PageLoader from '@/components/Global/PageLoader'

const SettingUpWorkspacePage = () => {
  console.log('SettingUpWorkspacePage rendered')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirectToWorkspace = async () => {
      try {
        const session = await authClient.getSession()
        const userEmail = session?.data?.user?.email

        if (!userEmail) {
          setError('No session found. Please log in again.')
          return
        }

        const localSlug = localStorage.getItem('pending_invite_token')

        if (localSlug) {
          const localSlug = localStorage.getItem('pending_invite_token')
          if (localSlug) {
            const response = await getInviteWorkspace(localSlug)
            let workspaceSlug: string | undefined = undefined
            if (
              response &&
              typeof response.data === 'object' &&
              response.data !== null &&
              'slug' in response.data
            ) {
              workspaceSlug = (response.data as { slug: string }).slug
            }

            localStorage.removeItem('pending_invite_token') // cleanup
            if (workspaceSlug) {
              router.replace(`/${workspaceSlug}`)
            } else {
              setError('Invalid invite token or workspace not found.')
            }
            return
          }
        }

        // Fallback to backend logic
        const slug = await getUserLastWorkspaceSlug(userEmail)

        if (!slug) {
          setError('No active workspace found.')
          return
        }

        router.replace(`/${slug}`)
      } catch (err) {
        console.error(err)
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    redirectToWorkspace()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {loading ? (
        <>
          <PageLoader title="Setting Up Workspace" />
        </>
      ) : error ? (
        <p className="text-red-500 font-medium text-sm">{error}</p>
      ) : null}
    </div>
  )
}

export default SettingUpWorkspacePage
