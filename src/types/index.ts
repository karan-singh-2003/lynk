// types/index.ts (or wherever you store types)
// ✅ A single member object
export type MemberWithUser = {
  id: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  userId: string
  user: {
    id: string
    name: string | null
    email: string
    firstName?: string | null
    lastName?: string | null
  }
  joinedAt: Date
  workspaceId: string
}

// ✅ A separate type for the array
export type MemberWithUserList = MemberWithUser[]

// types/workspace.ts
export type WorkspaceType = {
  id: string
  slug: string
  name: string
}

/** ---------- Types ---------- **/

export type User = {
  id: string
  name: string
  email: string
  companySize?: string | number | null

  currentPlan?: string
  emailVerified?: boolean
  createdAt: string | Date
  firstName?: string | null
  lastName?: string | null

  provider?: string | null
  updatedAt: string | Date
  worktype?: string
  lastActiveWorkspaceId?: string | null
}

export type Member = {
  id: string
  userId: string
  workspaceId?: string
  joinedAt?: string | Date
  role?: string
  user: User
}

export type WorkspaceData = {
  approvalRequired: boolean
  workspace: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    createdAt: string | Date
    members: Member[]
    allowAutoJoin: boolean
    createdById?: string
  }
}

export type InviteWorkspaceResponse = {
  status: number
  data: WorkspaceData | string
}

export type UserProfile = {
  firstName: string
  lastName: string
  email: string
}
export type FetchedWorkspace = {
  name: string
  members: number
  current: boolean
  id: string
  slug: string
}
export type Workspace = {
  memberWorkspaces: FetchedWorkspace[]
  yourWorkspaces: FetchedWorkspace[]
}

export type Session = {
  browser: string
  current: boolean
  device: string
  id: string
  lastActive: string
  os: string
}

export type Notification = {
  id: string
  message: string
  createdAt: Date
  read: boolean
  userId: string
  workspaceId: string | null
}

export type NotificationsResponse = {
  notifications: Notification[]
  hasUnread: boolean
}

export type MemberStatus = 'active' | 'pending'

export type TransformedMember = {
  id: string
  name: string
  email: string
  userId: string
  role: string
  joinedAt?: Date
  workspaceId: string
  you: boolean
  status: MemberStatus
}

export type InvitedTransformedMember = {
  id: string
  name: string
  email: string
  userId: string
  role: string
  workspaceId: string
  status: 'pending'
}
