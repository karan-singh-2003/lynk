'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { getBgColor, getTextColor } from '@/utils/generateColor'
import { ChevronDown, Check, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useQueryData } from '@/hooks/useQueryData'
import { useState, useEffect } from 'react'
import { getUserWorkspaces } from '@/actions/workspace'
import { Skeleton } from '../ui/skeleton'
import { FetchedWorkspace, Workspace } from '@/types'
import { useWorkspace } from '@/lib/context/workspace-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserPlan } from '@/actions/user'

const WorkspaceMenu = () => {
  const router = useRouter()
  const [plan, setPlan] = useState('')
  const { workspace } = useWorkspace()
  const workspaceName = workspace?.name || 'Default Workspace'

  const workspaceBg = getBgColor(workspaceName)
  const workspaceText = getTextColor(workspaceName)

  const [yourWorkspaces, setYourWorkspaces] = useState<FetchedWorkspace[]>([])
  const [memberWorkspaces, setMemberWorkspaces] = useState<FetchedWorkspace[]>(
    []
  )

  const { data, isPending } = useQueryData<Workspace>(
    ['userWorkspaces'],
    getUserWorkspaces,
    true
  )
  console.log('Workspace Data:', data)

  useEffect(() => {
    if (data) {
      setYourWorkspaces(data.yourWorkspaces)
      setMemberWorkspaces(data.memberWorkspaces)
    }
  }, [data])
  useEffect(() => {
    const fetchPlan = async () => {
      const userPlan = await getCurrentUserPlan()
      setPlan(userPlan.currentPlan)
    }

    fetchPlan()
  }, [])

  console.log('Your Workspaces:', yourWorkspaces)
  console.log('Member Workspaces:', memberWorkspaces)
  if (isPending) {
    return (
      <div className="flex justify-center items-center  mx-2 pr-2">
        <div className="w-full mt-4">
          <div className="flex items-center gap-x-2  px-2 py-1">
            <Skeleton className="w-9 h-9 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 bg-gray-300 rounded-none" />
              <Skeleton className="h-3 w-16 bg-gray-300 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center items-center  mx-2 pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="mt-4 rounded-none flex items-center justify-between  w-full hover:bg-[#F0F0F0] dark:hover:bg-[#292929] border-none">
            <div className="flex items-center gap-x-2 px-2 py-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                style={{ backgroundColor: workspaceBg, color: workspaceText }}
              >
                {workspaceName.trim().slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col  max-w-[120px] overflow-hidden">
                <h1
                  className="text-[14px] text-left dark:text-white text-[#0e0e0e] font-semibold truncate"
                  title={workspaceName}
                >
                  {workspaceName}
                </h1>
                <h1 className="font-medium text-[12px] text-left text-muted-foreground ">
                  {plan}
                </h1>
              </div>
            </div>
            <ChevronDown size={20} className="ml-1" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="min-w-[300px] py-2 ml-10"
          >
            <div className="px-4 py-1 text-xs text-muted-foreground font-medium">
              Your All Workspaces
            </div>

            <div className="max-h-[100px] overflow-y-auto scrollbar-hide dark-scrollbar  pr-1 py-1 ">
              {yourWorkspaces.map((item) => (
                <DropdownMenuItem
                  key={item.name}
                  className="flex justify-between items-center cursor-pointer text-sm hover:bg-[#f0f0f0] dark:hover:bg-[#292929] "
                >
                  <Link
                    href={`/${item.slug}`}
                    className="flex items-center gap-x-2 px-2 "
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center  text-white font-semibold text-xs"
                      style={{
                        backgroundColor: getBgColor(item.name),
                        color: getTextColor(item.name),
                      }}
                    >
                      {item.name.trim().slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[180px] overflow-hidden">
                      <h1
                        className="text-[13px] font-semibold truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h1>
                      <h1 className="font-normal text-[13px] text-left text-black dark:text-white">
                        {item.members} <span>members</span>
                      </h1>
                    </div>
                  </Link>
                  {item.current && <Check size={16} className="text-black" />}
                </DropdownMenuItem>
              ))}
            </div>
            {memberWorkspaces.length > 0 && (
              <div className="px-4 py-2 mt-1 text-xs text-muted-foreground font-medium">
                Member Workspaces
              </div>
            )}
            <div className="max-h-[110px] py-1 overflow-y-auto scrollbar-hide dark-scrollbar  pr-1">
              {memberWorkspaces.map((item) => (
                <DropdownMenuItem
                  key={item.name}
                  className="flex justify-between items-center cursor-pointer text-sm hover:bg-[#f0f0f0] dark:hover:bg-[#292929] "
                >
                  <Link
                    href={`/${item.slug}`}
                    className="flex items-center gap-x-2 px-2 "
                  >
                    <div className="flex items-center gap-x-2  ">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center  text-white font-semibold text-xs"
                        style={{
                          backgroundColor: getBgColor(item.name),
                          color: getTextColor(item.name),
                        }}
                      >
                        {item.name.trim().slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col max-w-[180px] overflow-hidden">
                        <h1
                          className="text-[13px] font-semibold truncate"
                          title={item.name}
                        >
                          {item.name}
                        </h1>
                        <h1 className="font-normal text-[13px] text-left ">
                          {item.members} <span>members</span>
                        </h1>
                      </div>
                    </div>
                  </Link>
                  {item.current && (
                    <Check size={16} className="text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-sm py-2.5 flex items-center gap-2 text-primary font-medium">
              <Button
                className="w-full rounded-none bg-[#246EFF] hover:bg-[#246EFF]/90"
                onClick={() => {
                  router.push('/create-workspace')
                }}
              >
                {' '}
                <Plus size={16} className="text-white" />
                <span className="text-white ">Create Workspace</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default WorkspaceMenu
