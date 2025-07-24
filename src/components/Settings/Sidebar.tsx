'use client'

import React from 'react'
import {
  CircleUserRound,
  TicketSlash,
  Layers,
  ArrowLeft,
  UsersRound,
  Menu,
  ChevronRight,
} from 'lucide-react'
import { useWorkspace } from '@/lib/context/workspace-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const { workspace } = useWorkspace()
  const workspaceSlug = workspace?.slug || ''
  const pathname = usePathname()

  // Move these inside the component after slug is available
  const SidebarAccountTabs = [
    {
      name: 'Personal Details',
      href: `/${workspaceSlug}/settings`,
      logo: (
        <CircleUserRound
          size={18}
          className="dark:text-[#e4e4e4] text-[#555555]"
        />
      ),
    },
    {
      name: 'Sessions',
      href: `/${workspaceSlug}/settings/sessions`,
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
          id="Screen-Curve--Streamline-Core"
          height={14}
          width={14}
          className="dark:text-[#e4e4e4] text-[#555555]"
        >
          <desc>
            {'\n    Screen Curve Streamline Icon: https://streamlinehq.com\n  '}
          </desc>
          <g id="screen-curve--screen-curved-device-electronics-monitor-diplay-computer">
            <path
              id="Vector"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12.93 11.34c-3.93352 -0.56 -7.92652 -0.56 -11.86002 0 -0.070446 0.01 -0.14221 0.0048 -0.210495 -0.0152 -0.068284 -0.02 -0.131516 -0.0543 -0.185471 -0.1007 -0.053954 -0.0464 -0.097388 -0.1038 -0.1274 -0.1683 -0.030011 -0.0645 -0.045909 -0.1347 -0.046631 -0.2058V2.48999c-0.000963 -0.07167 0.013809 -0.14268 0.043274 -0.20801 0.029465 -0.06534 0.072905 -0.12342 0.127258 -0.17015 0.054352 -0.04672 0.118293 -0.08095 0.187315 -0.10028 0.069021 -0.01932 0.141441 -0.02327 0.21215 -0.01156 3.93421 0.55001 7.9258 0.55001 11.86002 0 0.0699 -0.01157 0.1414 -0.00784 0.2097 0.01091s0.1317 0.05208 0.1859 0.09771c0.0542 0.04562 0.0978 0.10245 0.1279 0.16656 0.0301 0.06412 0.046 0.13399 0.0465 0.20482V10.84c0.0007 0.072 -0.0142 0.1433 -0.0435 0.209 -0.0294 0.0657 -0.0727 0.1243 -0.1268 0.1718 -0.0541 0.0475 -0.1178 0.0827 -0.1868 0.1033 -0.069 0.0205 -0.1416 0.026 -0.2129 0.0159v0Z"
              strokeWidth={1}
            />
            <path
              id="Vector_2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 10.9199v2.5"
              strokeWidth={1}
            />
            <path
              id="Vector_3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 13.4199h5"
              strokeWidth={1}
            />
          </g>
        </svg>
      ),
    },
    {
      name: 'Billing',
      href: `/${workspaceSlug}/settings/billing`,
      logo: (
        <TicketSlash size={18} className="dark:text-[#e4e4e4] text-[#555555]" />
      ),
    },
  ]

  const SidebarWorkspaceTabs = [
    {
      name: 'Workspace',
      href: `/${workspaceSlug}/settings/workspace`,
      logo: <Layers size={18} className="dark:text-[#e4e4e4] text-[#555555]" />,
    },
    {
      name: 'Members',
      href: `/${workspaceSlug}/settings/members`,
      logo: (
        <UsersRound size={18} className="dark:text-[#e4e4e4] text-[#555555]" />
      ),
    },
  ]

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    // Just the root settings page
    if (pathname === `/${workspaceSlug}/settings`) {
      return [
        {
          name: 'Profile Settings',
          href: pathname,
          icon: null,
        },
      ]
    }

    // You're on a deeper settings route like /settings/members
    const allTabs = [...SidebarAccountTabs, ...SidebarWorkspaceTabs]
    const currentTab = allTabs.find((tab) => tab.href === pathname)

    if (currentTab) {
      return [
        {
          name: 'Settings',
          href: `/${workspaceSlug}/settings`,
          icon: null,
        },
        {
          name: currentTab.name,
          href: currentTab.href,
          icon: null,
        },
      ]
    }

    return []
  }

  const breadcrumbs = generateBreadcrumbs()

  const sidebarSection = (
    <div className="h-[100vh] flex flex-col bg-[#F5F5F5] dark:bg-[#222222] w-[244px] overflow-hidden mx-1">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 px-2">
        <h1 className="text-[20px] lg:text-[13px] ml-2 mt-1.5 font-medium leading-none">
          <Link
            href={`/${workspaceSlug}`}
            className="flex items-center gap-x-1"
          >
            <ArrowLeft strokeWidth={1.5} size={16} />
            <span className="text-[14px]">Back to dashboard</span>
          </Link>
        </h1>
      </div>

      <div className="mx-4 mt-6">
        <h1 className="font-medium text-[15px] mb-2 text-black dark:text-white">
          Account
        </h1>
        <div className="flex flex-col px-1">
          {SidebarAccountTabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-x-3  py-[6px] text-[15px] font-medium text-[#555555] hover:bg-[#f0f0f0] dark:text-[#e4e4e4] dark:hover:bg-[#292929]"
            >
              {tab.logo}
              {tab.name}
            </a>
          ))}
        </div>

        <h1 className="font-medium text-[15px] my-2 mt-3 text-black dark:text-white">
          Workspace
        </h1>
        <div className="flex flex-col px-1">
          {SidebarWorkspaceTabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-x-3 py-[6px] text-[15px] font-medium text-[#555555] hover:bg-[#f0f0f0] dark:text-white dark:hover:bg-[#292929]"
            >
              {tab.logo}
              {tab.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-fit">
      {/* Mobile Top Bar with Breadcrumbs */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#222222] border-b border-[#d4d4d4] dark:border-[#2c2c2c] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Button */}
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

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-1 ml-3 overflow-hidden">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && (
                  <ChevronRight
                    size={14}
                    className="text-[#8D8D8D] flex-shrink-0"
                  />
                )}
                <Link
                  href={breadcrumb.href}
                  className={`flex items-center gap-1 text-sm font-medium truncate ${
                    index === breadcrumbs.length - 1
                      ? 'text-black dark:text-white'
                      : 'text-[#8D8D8D] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {breadcrumb.icon && (
                    <span className="flex-shrink-0">{breadcrumb.icon}</span>
                  )}
                  <span className="truncate text-[15px] font-semibold">
                    {breadcrumb.name}
                  </span>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Add top padding for mobile content to account for fixed header */}
      <div className="md:hidden h-[60px]"></div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">{sidebarSection}</div>
    </div>
  )
}

export default Sidebar
