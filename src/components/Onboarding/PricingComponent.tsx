'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { CircleCheck, CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PricingProps {
  plan: string
  pricing: string
  link?: string
  priceId?: string
  billingType?: 'monthly' | 'yearly'
  feature?: { allowed: boolean; feature: string }[]
}

const StandardPlan = [
  { allowed: true, feature: '10 members per workspace' },
  { allowed: true, feature: '3 workspaces per user' },
  { allowed: true, feature: '20 Links per month' },
  { allowed: false, feature: 'Priority Support' },
]

const ProPlan = [
  { allowed: true, feature: 'Unlimited members per workspace' },
  { allowed: true, feature: 'Unlimited workspaces per user' },
  { allowed: true, feature: 'Unlimited Links per month' },
  { allowed: true, feature: 'Priority Support' },
]

const PricingComponent = ({
  pricing,
  plan,
  link,
  billingType = 'monthly',
}: PricingProps) => {
  const router = useRouter()
  const isPro = plan.toLowerCase() === 'pro'
  const bgColor = isPro
    ? 'bg-[#E2DCFB] dark:bg-[#2a2346]'
    : 'bg-[#DAF0FF] dark:bg-[#1a2935]'
  const textColor = isPro
    ? 'text-[#333] dark:text-white'
    : 'text-[#333] dark:text-white'

  const handleRedirect = () => {
    if (link) router.push(link)
  }

  const features = isPro ? ProPlan : StandardPlan

  return (
    <div className="border border-[#AEAEAE] dark:border-gray-700 rounded-none mt-4">
      <div className={`px-5 py-5 ${bgColor}`}>
        <h1 className={`text-[24px] font-bold ${textColor}`}>{plan}</h1>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {isPro ? 'Tailored for larger businesses' : 'Perfect for small teams'}
        </p>
        <div className="flex items-baseline space-x-2 mt-1 mb-3">
          <h1 className="text-[30px] font-bold text-black dark:text-white">
            ${pricing}
          </h1>
          <h1 className="text-base text-gray-600 dark:text-gray-400">
            /{billingType}, billed {billingType}
          </h1>
        </div>

        <Button
          onClick={handleRedirect}
          className={`rounded-full w-full h-10 text-sm ${
            isPro
              ? 'bg-black hover:bg-black/80 text-white'
              : 'border border-[#888] text-black dark:text-white dark:border-gray-500'
          }`}
          variant={isPro ? 'default' : 'outline'}
        >
          Upgrade to {plan}
        </Button>
      </div>

      <div className="my-5">
        {features.map((item, index) => (
          <div key={index} className="flex gap-x-2.5 px-4 py-2.5 items-center">
            {item.allowed ? (
              <CircleCheck
                strokeWidth={1}
                size={19}
                className="text-green-600"
              />
            ) : (
              <CircleX strokeWidth={1} size={19} className="text-red-500" />
            )}
            <h1 className="text-[15px] text-[#444] dark:text-gray-300">
              {item.feature}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingComponent
