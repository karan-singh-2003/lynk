'use client'

import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { getUserNotifications } from '@/actions/user'
import { useWorkspace } from '@/lib/context/workspace-context'

const SidebarWrapper = () => {
  const { workspace } = useWorkspace()
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (workspace?.id) {
        const { hasUnread } = await getUserNotifications(workspace.id)
        setHasUnread(hasUnread)
      }
    }
    fetchNotifications()
  }, [workspace?.id])

  return <Sidebar hasUnread={hasUnread} />
}

export default SidebarWrapper
