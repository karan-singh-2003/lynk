// hooks/useSession.ts
'use client'

import { useEffect, useState } from 'react'
import { authClient } from '../../auth-client'

const useSession = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession()
        setSession(session)
      } catch (error) {
        console.error('Failed to get session', error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { session, loading }
}

export default useSession
