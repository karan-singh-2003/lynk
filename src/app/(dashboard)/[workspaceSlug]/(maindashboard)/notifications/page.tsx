'use client'

import { getUserNotifications, markNotificationsAsRead } from '@/actions/user'
import { formatDistanceToNow } from 'date-fns'
import { useQueryData } from '@/hooks/useQueryData'
import { useEffect, useState } from 'react'
import type { Notification, NotificationsResponse } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspace } from '@/lib/context/workspace-context'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { workspace } = useWorkspace()
  const workspaceId = workspace?.id || ''

  const { data: fetchedNotifications, isPending } =
    useQueryData<NotificationsResponse>(
      ['notifications', workspaceId],
      () => getUserNotifications(workspaceId),
      !!workspaceId
    )

  useEffect(() => {
    if (fetchedNotifications?.notifications?.length) {
      setNotifications(fetchedNotifications.notifications)

      if (fetchedNotifications.hasUnread) {
        markNotificationsAsRead().catch((err) =>
          console.error('Failed to mark notifications as read', err)
        )
      }
    }
  }, [fetchedNotifications, workspaceId])

  return (
    <div className="p-4 mt-1">
      <h1 className="text-2xl font-bold mb-8 text-foreground">Notifications</h1>

      {isPending ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx}>
              <Skeleton className="h-5 w-3/4 mb-2 rounded-none" />
              <Skeleton className="h-4 w-1/4 rounded-none" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notify, index) => (
            <li key={notify.id} className="bg-background">
              <p className="font-medium text-foreground">{notify.message}</p>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(notify.createdAt))} ago
              </span>
              {index < notifications.length - 1 && (
                <hr className="my-4 border-t border-gray-200 dark:border-[#414141]" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotificationsPage
