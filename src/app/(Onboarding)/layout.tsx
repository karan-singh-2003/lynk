'use client' // 👈 IMPORTANT

import React from 'react'
import useSession from '@/hooks/useSession' // your hook
import PageLoader from '@/components/Global/PageLoader'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const { session, loading } = useSession()
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string | undefined

  const email = session?.data?.user?.email || 'Not logged in'

  useEffect(() => {
    if (!loading && (!session || !session.data?.user?.email)) {
      console.log('No session or user email found, redirecting to sign-in.')

      if (token) {
        localStorage.setItem('pending_invite_token', token)
        router.replace(`/sign-in?redirect=/invite/${token}`)
      } else {
        router.replace('/sign-in')
      }
    }
  }, [session, loading, token, router])

  if (loading || !session || !session.data?.user?.email) {
    return <PageLoader title="Loading" />
  }
  return (
    <div>
      <div className="lg:w-[1300px] mx-auto px-3 py-4 ">
        <div className="flex justify-between">
          <div>
            <h1
              style={{ fontFamily: 'var(--font-poppins)' }}
              className="lg:text-3xl text-2xl font-bold"
            >
              Lynk
            </h1>
          </div>
          <div className="flex flex-col leading-tight">
            <div>
              <h1 className="text-[#3d3d3d] text-[13px] lg:text-[14px] font-medium">
                email
              </h1>
            </div>
            <div>
              <h1 className="text-[#818181] text-[13px] lg:text-[14px] font-medium">
                {email}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[500px] w-full px-4 mx-auto ">{children}</div>
    </div>
  )
}

export default Layout
