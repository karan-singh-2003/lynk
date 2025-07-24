'use client'
import { createContext, useContext, useState } from 'react'

type Workspace = {
  id: string
  slug: string
  name: string
}

const WorkspaceContext = createContext<{
  workspace: Workspace | null
  setWorkspace: (ws: Workspace) => void
}>({
  workspace: null,
  setWorkspace: () => {},
})

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => useContext(WorkspaceContext)
