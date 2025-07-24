'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBgColor, getTextColor } from '@/utils/generateColor'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { authClient } from '../../../auth-client'
import { getUserInfo, updateUserInfo } from '@/actions/user'
import { UserProfile } from '@/types'

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const bgColor = getBgColor(email || 'defaultUser')
  const textColor = getTextColor(email || 'defaultUser')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [editingField, setEditingField] = useState<
    null | 'firstName' | 'lastName'
  >(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const session = await authClient.getSession()
        setEmail(session?.data?.user?.email || '')

        const getUser: UserProfile = await getUserInfo()
        setFirstName(getUser?.firstName)
        setLastName(getUser?.lastName)
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleBlur = async () => {
    try {
      await updateUserInfo({ firstName, lastName })
      console.log('User info updated')
    } catch (err) {
      console.error('Failed to update user info:', err)
    } finally {
      setEditingField(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          style={{ fontFamily: 'var(--font-poppins)' }}
          className="lg:text-2xl text-xl font-semibold text-[#0e0e0e] dark:text-white"
        >
          Profile
        </h1>
        <p className="text-sm text-muted-foreground font-medium mt-0.5">
          Put a face to your name, edit your login details, and set preferences.
        </p>
      </div>

      {/* Avatar & Email */}
      <div className="flex items-center justify-between gap-x-4 border-b pb-6">
        <div className="flex items-center lg:gap-x-4 gap-x-2">
          {isLoading ? (
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          ) : (
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {email.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            {isLoading ? (
              <div className="h-4 w-32 bg-muted rounded-sm animate-pulse mb-1" />
            ) : (
              <Link
                href="/settings/account/profile"
                className="block text-sm font-semibold text-[#333] dark:text-white"
              >
                {email}
              </Link>
            )}
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max size: 256x256px
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-full px-6 text-xs"
          disabled={isLoading}
        >
          Upload Picture
        </Button>
      </div>

      {/* User Info */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[15px]">User Information</h2>

        <div className="gap-y-5 flex flex-col text-sm">
          {/* First Name */}
          <div>
            <h1 className="font-semibold text-sm">First Name</h1>
            <p className="text-[14px] lg:text-[14px] my-1 mb-2.5 font-medium text-muted-foreground">
              This is your first name visible on your profile.
            </p>
            {editingField === 'firstName' ? (
              <Input
                className="rounded-none text-[14px] lg:text-[15px] border border-black  focus-visible:ring-0 py-1 focus-visible:ring-offset-0"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div
                className="text-[14px] lg:text-[15px] font-semibold my-0.5 text-[#3d3d3d] dark:text-white dark:border-[#444444] cursor-pointer border border-gray-300 px-3 py-1.5 rounded-none"
                onClick={() => setEditingField('firstName')}
              >
                {firstName || 'Click to add'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <h1 className="font-semibold text-sm">Last Name</h1>
            <p className="text-[14px] lg:text-[14px] my-1 mb-2.5 font-medium text-muted-foreground">
              This is your last name visible on your profile.
            </p>
            {editingField === 'lastName' ? (
              <Input
                className="rounded-none text-[14px] lg:text-[15px] border border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div
                className="text-[14px] lg:text-[15px] font-semibold my-0.5 text-[#3d3d3d] dark:text-white dark:border-[#444444] cursor-pointer border border-gray-300 px-3 py-2 rounded-none"
                onClick={() => setEditingField('lastName')}
              >
                {lastName || 'Click to add'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="space-y-3 border-t pt-6">
        <h2 className="font-semibold text-red-500 text-[15px]">
          Delete Profile
        </h2>
        <div className="flex items-center justify-between gap-x-4">
          <p className="lg:text-sm text-[13px]">
            This action will erase your profile and all associated data. Once
            deleted, it cannot be recovered.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-6 text-xs bg-red-500  border-red-400 text-white hover:bg-red-50 hover:text-red-500"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
