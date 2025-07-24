import { ReactNode } from 'react'
import { redirect, notFound } from 'next/navigation'

import { auth } from '../../../../auth'
import { getWorkspaceBySlugForUser } from '@/actions/user'
import WorkspaceLayoutClient from './WorkspaceLayoutClient'
import { ThemeProvider } from '@/providers/ThemeProvide'
import { headers } from 'next/headers'

type Props = {
  children: ReactNode
  params: { workspaceSlug: string }
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { workspaceSlug } = await params

  const user = await auth.api.getSession({
    headers: await headers(),
  })

  console.log('User Session:', user)
  if (!user) redirect('/login')

  const workspace = await getWorkspaceBySlugForUser(
    workspaceSlug,
    user.user.email
  )

  if (!workspace) {
    notFound()
  }

  return (
    <WorkspaceLayoutClient workspaceSlug={workspaceSlug}>
      <ThemeProvider>{children}</ThemeProvider>
    </WorkspaceLayoutClient>
  )
}
