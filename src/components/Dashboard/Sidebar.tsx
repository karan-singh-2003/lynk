'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cog, Bell, Menu, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import ProfileMenu from './ProfileMenu'
import WorkspaceMenuResponsive from './WorkspaceMenuResponsive'
import { useWorkspace } from '@/lib/context/workspace-context'

interface SidebarProps {
  hasUnread: boolean
}

const Sidebar = ({ hasUnread }: SidebarProps) => {
  const pathname = usePathname()
  const { workspace } = useWorkspace()
  const slug = workspace?.slug || 'default-workspace'

  const tabs = [
    {
      name: 'Notifications',
      href: `/${slug}/notifications`,
      logo: <Bell size={20} />,
      badge: hasUnread ? (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      ) : null,
    },
    {
      name: 'Settings',
      href: `/${slug}/settings`,
      logo: <Cog size={20} />,
    },
  ]

  const currentTab = tabs.find((tab) => pathname === tab.href)

  const breadcrumbs = currentTab
    ? [
        { name: 'Dashboard', href: `/${slug}` },
        { name: currentTab.name, href: currentTab.href },
      ]
    : [{ name: 'Dashboard', href: `/${slug}` }]

  const sidebarSection = (
    <div className="h-[100vh] flex flex-col bg-[#F5F5F5] dark:bg-[#222222] w-[244px] overflow-hidden mx-1">
      <div className="flex items-center justify-between mt-4 px-2">
        <h1
          className="text-[20px] lg:text-[22px] ml-2 font-bold leading-none"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Lynk
        </h1>
        <div className="flex items-center gap-x-2 pr-1">
          <ProfileMenu />
        </div>
      </div>

      <WorkspaceMenuResponsive />

      <div className="flex flex-col mt-4">
        {tabs.map((tab) => (
          <a
            key={tab.name}
            href={tab.href}
            className="flex items-center gap-x-3 px-4 py-[6px] text-[14px] lg:text-[15px] font-medium text-[#555555] hover:bg-[#f0f0f0] dark:text-white dark:hover:bg-[#292929] rounded-none relative"
          >
            <span className="relative">
              {tab.logo}
              {tab.badge}
            </span>
            <span>{tab.name}</span>
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#222222] border-b border-[#d4d4d4] dark:border-[#2c2c2c] px-3 py-2">
        <div className="flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-none p-2">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-fit h-full p-0">
              <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
              {sidebarSection}
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-1 flex-1 ml-3 overflow-hidden">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <ChevronRight
                    size={14}
                    className="text-[#8D8D8D] flex-shrink-0"
                  />
                )}
                <Link
                  href={item.href}
                  className={`truncate text-[14px] font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-black dark:text-white'
                      : 'text-[#8D8D8D] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-[56px]" />

      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebarSection}</div>
    </div>
  )
}

export default Sidebar
