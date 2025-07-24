'use client'

import { useEffect } from 'react'
import { useWorkspace } from '@/lib/context/workspace-context'
import { getWorkspaceBySlug } from '@/actions/workspace'
import PageLoader from '@/components/Global/PageLoader'
import { useQueryData } from '@/hooks/useQueryData'

export default function WorkspaceLayoutClient({
  children,
  workspaceSlug,
}: {
  children: React.ReactNode
  workspaceSlug: string
}) {
  const { setWorkspace } = useWorkspace()

  const { data: workspace, isPending } = useQueryData(
    ['workspace', workspaceSlug],
    () => getWorkspaceBySlug(workspaceSlug)
  )

  useEffect(() => {
    if (workspace) {
      setWorkspace({
        id: workspace.id,
        slug: workspace.slug,
        name: workspace.name,
      })
    }
  }, [workspace, setWorkspace])

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <PageLoader title="Loading " />
      </div>
    )

  return <>{children}</>
}
