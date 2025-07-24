import SidebarWrapper from '@/components/Dashboard/SidebarWrapper'

interface WorkspacePageProps {
  children: React.ReactNode
}

export default function WorkspacePage({ children }: WorkspacePageProps) {
  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Fixed Sidebar */}
      <div className="lg:w-64 w-0 h-full  dark:border-[#2c2c2c]">
        <SidebarWrapper />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:pt-1">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
