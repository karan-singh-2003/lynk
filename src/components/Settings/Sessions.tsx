import React from 'react'

import { Button } from '@/components/ui/button'
import { useQueryData } from '@/hooks/useQueryData'
import { fetchUserSession } from '@/actions/user'

import { useState, useEffect } from 'react'
import { Session } from '@/types'
import { revokeSession } from '@/actions/user'

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([])

  const { data } = useQueryData(['session'], () => fetchUserSession(), true)

  console.log('Fetched Sessions:', data)
  useEffect(() => {
    if (data) {
      setSessions(data)
    }
  }, [data])

  return (
    <div>
      {/* Header */}
      <div>
        <h1
          style={{ fontFamily: 'var(--font-poppins)' }}
          className="text-2xl font-semibold text-[#0e0e0e] dark:text-white"
        >
          Sessions
        </h1>
        <p className="text-sm text-muted-foreground font-medium mt-0.5">
          Manage devices where you’re signed in
        </p>
      </div>
      <div className="my-4 ">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex justify-between items-center border-b py-4 last:border-b-0"
          >
            <div className="flex items-center gap-x-3">
              <div className="text-muted-foreground">
                {session.device === 'mobile' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Phone-Mobile-Phone--Streamline-Core"
                    height={16}
                    width={16}
                    className="dark:text-[#ffffff] text-black "
                  >
                    <desc>
                      {
                        '\n    Phone Mobile Phone Streamline Icon: https://streamlinehq.com\n  '
                      }
                    </desc>
                    <g id="phone-mobile-phone--android-phone-mobile-device-smartphone-iphone">
                      <path
                        id="Vector"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 0.5h-7c-0.55228 0 -1 0.447715 -1 1v11c0 0.5523 0.44772 1 1 1h7c0.5523 0 1 -0.4477 1 -1v-11c0 -0.552285 -0.4477 -1 -1 -1Z"
                        strokeWidth={1}
                      />
                      <path
                        id="Vector_2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.5 11h1"
                        strokeWidth={1}
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Screen-1--Streamline-Core"
                    height={14}
                    width={14}
                    className="dark:text-[#ffffff] text-black "
                  >
                    <desc>
                      {
                        '\n    Screen 1 Streamline Icon: https://streamlinehq.com\n  '
                      }
                    </desc>
                    <g id="screen-1--screen-device-electronics-monitor-diplay-computer">
                      <path
                        id="Vector"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 2H1c-0.276142 0 -0.5 0.22386 -0.5 0.5v8c0 0.2761 0.223858 0.5 0.5 0.5h12c0.2761 0 0.5 -0.2239 0.5 -0.5v-8c0 -0.27614 -0.2239 -0.5 -0.5 -0.5Z"
                        strokeWidth={1.2}
                      />
                      <path
                        id="Vector_2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 11 -1 2.5"
                        strokeWidth={1}
                      />
                      <path
                        id="Vector_3"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8 11 1 2.5"
                        strokeWidth={1}
                      />
                      <path
                        id="Vector_4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 13.5h6"
                        strokeWidth={1}
                      />
                    </g>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#0e0e0e] dark:text-white">
                  {session.device === 'mobile'
                    ? `mobile (${session.os})`
                    : session.os}
                  <span className="ml-1 text-muted-foreground">
                    {session.browser}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.current ? 'Current' : session.lastActive}
                </p>
              </div>
            </div>

            {!session.current && (
              <Button
                variant="outline"
                className="rounded-full px-4 py-1 text-xs font-medium"
                onClick={async () => {
                  try {
                    await revokeSession(session.id)
                    setSessions((prev) =>
                      prev.filter((s) => s.id !== session.id)
                    )
                  } catch (err) {
                    console.error('Failed to revoke session:', err)
                    // Optionally show a toast
                  }
                }}
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sessions
