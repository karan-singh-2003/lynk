import React from 'react'
import Sidebar from '@/components/Settings/Sidebar'

interface SidebarLayoutProps {
  children: React.ReactNode
}
const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className=" px-10 py-5 w-[800px] mt-16 lg:mt-0 ">{children}</div>
    </div>
  )
}

export default SidebarLayout
