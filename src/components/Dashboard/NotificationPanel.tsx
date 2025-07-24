'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationPanel() {
  const [activeTab, setActiveTab] = useState('inbox')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full px-0 md:px-0 flex justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-black rounded-none border border-gray-200 dark:border-[#2b2b2b] overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b text-center">
          {['inbox', 'archive'].map((tab) => (
            <button
              key={tab}
              className={`w-1/2 py-3 text-sm md:text-sm font-medium relative transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-black dark:text-white'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-[#292929]" />
              )}
            </button>
          ))}
        </div>

        {/* Notification content */}
        <div className="p-4 sm:p-6 min-h-64">
          {/* Gray notification - works in both modes */}
          <div className="mb-4 border border-[#8B8B8B] dark:border-[#444] rounded px-3 py-3 flex items-start sm:items-center">
            <div className="bg-[#8B8B8B] dark:bg-[#444] rounded-full w-8 h-8 flex items-center justify-center text-white shrink-0">
              <Bell className="p-1" />
            </div>
            <div className="ml-3 space-y-2 w-full">
              <div className="bg-[#8B8B8B] dark:bg-[#444] h-3 w-3/4 rounded"></div>
              <div className="bg-[#8B8B8B] dark:bg-[#444] h-3 w-2/3 rounded"></div>
            </div>
          </div>

          {/* Bell notification - light and dark mode adjusted */}
          <div className="mb-8 border border-gray-200 dark:border-[#333] rounded px-3 py-3 flex items-start sm:items-center">
            <div className="bg-[#ffffff] dark:bg-[#1E1E1E] rounded-full w-8 h-8 flex items-center justify-center text-black dark:text-white shrink-0">
              <Bell className="p-1" />
            </div>
            <div className="ml-3 space-y-2 w-full">
              <div className="bg-[#F3F2F2] dark:bg-[#333] h-3 w-4/5 rounded"></div>
              <div className="bg-[#F3F2F2] dark:bg-[#333] h-3 w-3/4 rounded"></div>
            </div>
          </div>

          {/* Empty state */}
          <div
            className={`text-center mt-8 transform transition-all duration-500 ease-out ${
              showContent
                ? 'translate-y-0 opacity-100'
                : 'translate-y-6 opacity-0'
            }`}
          >
            <h3 className="text-lg md:text-lg font-semibold text-black dark:text-white">
              You don&apos;t have any notifications
            </h3>
            <p className="text-xs md:text-xs text-gray-500 dark:text-white">
              We&apos;ll notify you about important updates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
