'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Badge from '@/components/Onboarding/Badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { submitProfileSetup } from '@/actions/user'
import { authClient } from '../../../../auth-client'
import { useRouter } from 'next/navigation'

const options = [
  'Marketing & Branding',
  'Product & Tech',
  'Content Creators',
  'Design & Creative',
  'Startup & Solopreneurs',
  'Business & Sales',
]

const sizeContents = [
  'Only me,',
  '2-10 members',
  '11-50 members',
  '51-200 members',
  '201+ members',
]

const bgColors = [
  '#F6F6F6', // Neutral
  '#E8F0FE', // Light Blue
  '#FFF3E0', // Soft Orange
  '#E8F5E9', // Light Green
  '#FFEBEE', // Soft Red
  '#F3E5F5', // Lavender
  '#E1F5FE', // Sky Blue
  '#FCE4EC', // Light Pink
  '#FFF9C4', // Pale Yellow
  '#E0F2F1', // Mint
  '#F8BBD0', // Baby Pink
  '#D7CCC8', // Soft Coffee
  '#DCEDC8', // Light Lime
  '#FFE0B2', // Peach
  '#D1C4E9', // Soft Purple
  '#C8E6C9', // Green Tint
  '#B3E5FC', // Cyan Tint
  '#FFCCBC', // Coral Tint
]

const getRandomColor = () =>
  bgColors[Math.floor(Math.random() * bgColors.length)]

const ProfileSetupPage = () => {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [badgeColor, setBadgeColor] = useState<string>('#F6F6F6')
  const [textColor, setTextColor] = useState<string>('#000000')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [customIndustry, setCustomIndustry] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState('Only me,')
  const [userId, setUserId] = useState<string | null>(null)
  const [inviteFlow, setInviteFlow] = useState(false)

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await authClient.getSession()
      const hasPendingToken = localStorage.getItem('pending_invite_token')
      if (hasPendingToken) {
        setInviteFlow(true)
      }

      if (session?.data?.user?.id) {
        setUserId(session.data.user.id)
        console.log('User ID:', session.data.user.id)
      } else {
        // User is not logged in
        console.log('User not logged in')
      }
    }
    fetchUserId()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const industry = selected || customIndustry

    if (!userId) return alert('User not logged in')

    const res = await submitProfileSetup({
      userId,
      firstName,
      lastName,
      role,
      teamSize,
      industry,
    })
    if (inviteFlow) {
      router.push(`/invite/${localStorage.getItem('pending_invite_token')}`)
      localStorage.removeItem('pending_invite_token')
    } else {
      if (res.success) {
        router.push('/create-workspace?onboarding=true')
      } else {
        alert(res.message || 'Something went wrong')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h1 className="font-bold text-[15px] mb-3 text-[#888888]">Your setup</h1>
      <h1 className="text-[#696767] font-semibold text-[20px]">
        Tell us more about yourself
      </h1>
      <h1 className="font-semibold text-[14px] text-[#525252]">
        Set up your profile to make it yours. You can tweak things anytime later
      </h1>

      {/* First and Last Name */}
      <div className="flex gap-x-2 mt-3">
        <div className="mt-3">
          <Label
            htmlFor="firstname"
            className="text-[13px] lg:text-[15px] mb-2 block"
          >
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="rounded-none"
          />
        </div>
        <div className="mt-3">
          <Label
            htmlFor="lastname"
            className="text-[13px] lg:text-[15px] mb-2 block"
          >
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="rounded-none"
          />
        </div>
      </div>

      {/* Badge Options */}

      <Label
        htmlFor="firstname"
        className="text-[13px] mt-5 lg:text-[15px] mb-2 block"
      >
        What kind of work you do? <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-2 flex-wrap mt-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelected(option)
              setCustomIndustry('')
              setBadgeColor(getRandomColor())
              setTextColor('#000000')
            }}
          >
            <Badge
              text={option}
              bgColor={selected === option ? badgeColor : '#F6F6F6'}
              textColor={selected === option ? textColor : '#7c7c7c'}
            />
          </button>
        ))}
      </div>

      {/* Custom Input if not in badges */}
      <div className="mt-3">
        <Input
          id="customIndustry"
          value={customIndustry}
          onChange={(e) => {
            setCustomIndustry(e.target.value)
            setSelected(null)
            setBadgeColor('#F6F6F6')
          }}
          placeholder="Other — please specify"
          className="rounded-none"
        />
      </div>

      {/* Role Input */}

      <Label
        htmlFor="firstname"
        className="text-[13px] mt-5 lg:text-[15px] mb-2 block"
      >
        What’s your role? <span className="text-red-500">*</span>
      </Label>
      <div className="mt-3">
        <Input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Product Manager, Designer"
          className="rounded-none"
        />
      </div>

      {/* Team Size */}
      <Label
        htmlFor="firstname"
        className="text-[13px] mt-5 lg:text-[15px] mb-2 block"
      >
        Team Size <span className="text-red-500">*</span>
      </Label>
      <RadioGroup
        className="space-y-1 mt-3"
        value={teamSize}
        onValueChange={(val) => setTeamSize(val)}
      >
        {sizeContents.map((content, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value={content}
              id={`size-${index}`}
              className="rounded-full"
            />
            <Label
              htmlFor={`size-${index}`}
              className="text-[14px] text-[#696767]"
            >
              {content}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Submit */}
      <Button type="submit" className="rounded-none bg-[#246EFF] mt-8">
        Continue
      </Button>
    </form>
  )
}

export default ProfileSetupPage
