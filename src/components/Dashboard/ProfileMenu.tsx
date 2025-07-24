'use client'

import React from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useRouter } from 'next/navigation'
import { authClient } from '../../../auth-client'
import { useEffect, useState } from 'react'
import { getBgColor, getTextColor } from '@/utils/generateColor'
import { Skeleton } from '../ui/skeleton'
import { getUserInfo } from '@/actions/user'

const ProfileMenu = () => {
  const router = useRouter()

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in') // redirect to login page
        },
      },
    })
  }
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)
      const { data, error } = await authClient.getSession()

      const getUserName = await getUserInfo()
      setName(getUserName?.firstName + ' ' + getUserName?.lastName)
      console.log('User Name:', getUserName?.firstName, getUserName?.lastName)
      if (error) console.error('Error fetching session:', error)
      setEmail(data?.user?.email || '')

      setIsLoading(false)
    }

    fetchSession()
  }, [])
  const bgColor = getBgColor(name || 'defaultUser')
  const textColor = getTextColor(name || 'defaultUser')
  if (isLoading) {
    return (
      <div className="flex justify-center items-center sm:mr-7  lg:mr-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center rounded-none  outline-none border-none">
            <Skeleton className="w-7 h-7 rounded-full mr-7 lg:mr-0  bg-gray-300" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-[230px] p-4 rounded-none ml-1 mt-1">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[140px] bg-gray-300 rounded-none" />
                <Skeleton className="h-3 w-[100px] bg-gray-300 rounded-none" />
              </div>
            </div>

            <DropdownMenuSeparator className="mt-4 h-[1px] bg-gray-200 dark:bg-[#2c2c2c]" />

            <div className="pt-3">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center mr-7 lg:mr-0 ">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center rounded-none  outline-none border-none">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {name.trim().slice(0, 2).toUpperCase()}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="min-w-[230px] p-0 rounded-none ml-1 mt-1"
        >
          <div className="flex items-center justify-center  px-3">
            <div
              className=" w-fit text-xs px-2.5 py-2.5 font-bold rounded-full mt-1.5"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="px-3 mt-2">
                <Link
                  href="/settings/account/profile"
                  className="text-[#5B5B5B] dark:text-white text-[13px] font-semibold"
                >
                  {name || 'Unnamed User'}
                </Link>
              </div>
              <div className="px-3 mb-1.5 dark:text-[#ffffff] text-[#777777] text-[13px] font-medium">
                {email}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="mt-2 h-[1px] bg-gray-200 dark:bg-[#2c2c2c]" />

          <DropdownMenuItem
            className="flex items-center gap-2 text-xs px-5  text-gray-700 dark:text-[#999999] my-2 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-none"
            onClick={handleLogOut}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 17"
              id="Logout-1--Streamline-Core"
              height={10}
              width={10}
              className="dark:text-white text-[#777777]"
            >
              <desc>
                {'\n    Logout 1 Streamline Icon: https://streamlinehq.com\n  '}
              </desc>
              <g id="logout-1--arrow-exit-frame-leave-logout-rectangle-right">
                <path
                  id="Vector"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 10.5v2c0 0.2652 -0.10536 0.5196 -0.29289 0.7071 -0.18754 0.1875 -0.44189 0.2929 -0.70711 0.2929h-7c-0.26522 0 -0.51957 -0.1054 -0.707107 -0.2929C0.605357 13.0196 0.5 12.7652 0.5 12.5v-11c0 -0.26522 0.105357 -0.51957 0.292893 -0.707107C0.98043 0.605357 1.23478 0.5 1.5 0.5h7c0.26522 0 0.51957 0.105357 0.70711 0.292893C9.39464 0.98043 9.5 1.23478 9.5 1.5v2"
                  strokeWidth={1.8}
                />
                <path
                  id="Vector_2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.5 7h7"
                  strokeWidth={1.8}
                />
                <path
                  id="Vector_3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.5 5 2 2 -2 2"
                  strokeWidth={1.8}
                />
              </g>
            </svg>
            <span className="dark:text-white ">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProfileMenu
