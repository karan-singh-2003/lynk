'use client'

import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

interface BadgeInputProps {
  emails: string[]
  setEmail: (emails: string[]) => void
  role?: 'OWNER' | 'ADMIN' | 'MEMBER'
  setRole?: (role: 'OWNER' | 'ADMIN' | 'MEMBER') => void
}

const BadgeInput = ({
  emails,
  setEmail,
  role = 'MEMBER',
  setRole,
}: BadgeInputProps) => {
  const [inputValue, setInputValue] = useState<string>('')

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addEmail = (email: string) => {
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmail([...emails, email])
      setInputValue('')
    }
  }

  const removeEmail = (index: number) => {
    const updatedEmails = emails.filter((_, i) => i !== index)
    setEmail(updatedEmails)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail(inputValue.trim())
    }

    if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      removeEmail(emails.length - 1)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue.trim())
    }
  }

  const handleRoleChange = (value: 'OWNER' | 'ADMIN' | 'MEMBER') => {
    if (setRole) setRole(value)
  }

  return (
    <div className="flex items-center gap-2 w-full border border-[#dadada] dark:border-[#484848]">
      <div className="flex flex-wrap w-full items-center pl-3 py-1 border-r border-[#dadada] dark:border-[#484848] focus-within:border-[#464646] transition-colors">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center bg-[#DEE9FF]/80 dark:text-[#95b7fd] dark:bg-[#041c4bc0] text-[#246EFF] ml-1 my-1 px-2 py-2 w-fit rounded-none text-sm "
          >
            <span>{email}</span>
            <button
              type="button"
              className="ml-1 text-[#246EFF] dark:text-[#95b7fd] hover:text-gray-700 font-medium"
              onClick={() => removeEmail(index)}
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          placeholder={emails.length === 0 ? 'Enter emails here' : ''}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="h-12 flex-grow outline-none pl-1.5 text-[15px] placeholder-[#696767] placeholder:font-medium"
        />
      </div>

      <div>
        <Select defaultValue={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-14 rounded-none border-none bg-transparent text-sm">
            <SelectValue placeholder={role} />
          </SelectTrigger>

          <SelectContent className="w-[240px]">
            <SelectItem value="ADMIN">Admin</SelectItem>
            <p className="text-[#8D8D8D] text-[12px] px-2 -mt-1 mb-2">
              Can manage links, members, and delete workspace
            </p>

            <SelectItem value="MEMBER">Member</SelectItem>
            <p className="text-[#8D8D8D] text-[12px] px-2 mt-1 mb-2">
              Can create/edit links, but not manage members or delete workspace
            </p>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default BadgeInput
