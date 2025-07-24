'use client'
import { useState, useEffect } from 'react'
import WorkspaceDrawer from './WorkspaceMenuDrawer'

import WorkspaceMenu from './WorkspaceMenu'

export default function WorkspaceMenuResponsive({}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    setIsMobile(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isMobile ? <WorkspaceDrawer /> : <WorkspaceMenu />
}
