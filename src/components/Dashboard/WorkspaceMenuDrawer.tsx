'use client'

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerPortal,
} from '@/components/ui/drawer'
import { Plus, Check, ChevronDown } from 'lucide-react'

import { useState, useEffect } from 'react'
import { getBgColor, getTextColor } from '@/utils/generateColor'
import { useQueryData } from '@/hooks/useQueryData'
import { getUserWorkspaces } from '@/actions/workspace'
import { useWorkspace } from '@/lib/context/workspace-context'
import type { FetchedWorkspace, Workspace } from '@/types'
import { Skeleton } from '../ui/skeleton'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function WorkspaceDrawer() {
  const plan = 'Free'
  const { workspace, setWorkspace } = useWorkspace()
  const router = useRouter()

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

  useEffect(() => {
    if (data) {
      setYourWorkspaces(data.yourWorkspaces)
      setMemberWorkspaces(data.memberWorkspaces)
    }
  }, [data])

  const handleWorkspaceSelect = (item: FetchedWorkspace) => {
    setWorkspace({
      id: item.id,
      name: item.name,
      slug: item.slug,
    })
    router.push(`/dashboard/${item.slug}`)
  }

  const handleCreateNewWorkspace = () => {
    router.push('/create-workspace')
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center mx-2 pr-2">
        <div className="w-full mt-4">
          <div className="flex items-center gap-x-2 px-2 py-1">
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
    <Drawer>
      <DialogTitle></DialogTitle>
      <DrawerTrigger asChild>
        <div className="mt-4 flex items-center justify-between px-2 py-1 rounded-none cursor-pointer hover:bg-muted transition">
          <div className="flex items-center gap-x-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ backgroundColor: workspaceBg, color: workspaceText }}
            >
              {workspaceName.trim().slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col max-w-[140px] overflow-hidden">
              <span
                className="text-sm font-medium truncate"
                title={workspaceName}
              >
                {workspaceName}
              </span>
              <span className="text-xs text-muted-foreground">{plan}</span>
            </div>
          </div>
          <ChevronDown size={18} />
        </div>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent className="min-w-[260px] max-h-[90vh] overflow-hidden border border-border ml-1 rounded-none p-0 bg-background">
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-1 py-2 scrollbar-hide dark-scrollbar">
              {yourWorkspaces.length > 0 && (
                <div className="px-4 mt-2 text-sm font-semibold text-muted-foreground">
                  Your Workspaces
                </div>
              )}
              {yourWorkspaces.map((item) => (
                <Link
                  href={`/${item.slug}/links`}
                  key={item.id}
                  onClick={() => handleWorkspaceSelect(item)}
                  className="flex justify-between items-center cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground transition rounded-none px-3 py-2 mt-1"
                >
                  <div className="flex items-center gap-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                      style={{
                        backgroundColor: getBgColor(item.name),
                        color: getTextColor(item.name),
                      }}
                    >
                      {item.name.trim().slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[160px] overflow-hidden">
                      <span
                        className="text-sm font-medium truncate"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.members} members
                      </span>
                    </div>
                  </div>
                  {item.current && <Check size={16} className="text-primary" />}
                </Link>
              ))}

              {memberWorkspaces.length > 0 && (
                <div className="px-4 mt-4 text-sm font-semibold text-muted-foreground">
                  Member Workspaces
                </div>
              )}
              {memberWorkspaces.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleWorkspaceSelect(item)}
                  className="flex justify-between items-center cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground transition rounded-md px-3 py-2 mt-1"
                >
                  <div className="flex items-center gap-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                      style={{
                        backgroundColor: getBgColor(item.name),
                        color: getTextColor(item.name),
                      }}
                    >
                      {item.name.trim().slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[160px] overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.members} members
                      </span>
                    </div>
                  </div>
                  {item.current && (
                    <Check size={16} className="text-green-600" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t mb-4 border-border">
              <Button
                className="w-full bg-[#2563EB] rounded-none text-white hover:bg-primary/90"
                onClick={handleCreateNewWorkspace}
              >
                <Plus size={16} className="mr-1" />
                Create Workspace
              </Button>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  )
}
