'use client'

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import PricingComponent from '@/components/Onboarding/PricingComponent'
import { getCurrentUserPlan } from '@/actions/user'
import PageLoader from '@/components/Global/PageLoader'

const plans = [
  {
    link: 'https://buy.stripe.com/test_eVq3cwceIfVZbuNaVf5Rm05',
    priceId: 'price_1RjOVFL2qfTOZYhOwoyLlUDM',
    duration: '/monthly',
    price: 49,
    plan: 'Pro',
  },
  {
    link: 'https://buy.stripe.com/test_14A4gA6UoaBFfL39Rb5Rm04',
    priceId: 'price_1RjOV4L2qfTOZYhO7L2ZAOnW',
    duration: '/yearly',
    price: 29,
    plan: 'Pro',
  },
  {
    link: 'https://buy.stripe.com/test_fZudRa5QkbFJ42l0gB5Rm02',
    priceId: 'price_1RjOVwL2qfTOZYhO2QkGJX51',
    duration: '/monthly',
    price: 39,
    plan: 'Standard',
  },
  {
    link: 'https://buy.stripe.com/test_cNi9AU3IceRV7exd3n5Rm03',
    priceId: 'price_1RjOVaL2qfTOZYhOehZ49OTv',
    duration: '/yearly',
    price: 19,
    plan: 'Standard',
  },
]

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('FREE')
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true)
      const { currentPlan, nextBillingDate } = await getCurrentUserPlan()
      setCurrentPlan(currentPlan)
      setNextBillingDate(nextBillingDate ? nextBillingDate.toISOString() : null)
      setIsLoading(false)
    }

    fetchPlan()
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <PageLoader title="fetching your plan" />
      </div>
    )
  }
  const renderPlans = (duration: '/monthly' | '/yearly') => {
    const filtered = plans
      .filter((p) => p.duration === duration)
      .filter((p) => p.plan.toLowerCase() !== currentPlan.toLowerCase()) // 🧹 Hide active plan

    const sorted = filtered.sort((a) => (a.plan === 'Standard' ? -1 : 1))

    return (
      <div className="lg:flex lg:w-full gap-4">
        {sorted.map((plan, index) => (
          <div className="w-full max-w-[350px]" key={index}>
            <PricingComponent
              pricing={plan.price.toString()}
              plan={plan.plan}
              link={plan.link}
              priceId={plan.priceId}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="mt-5 text-[16px] text-[#494949] dark:text-white ">
        You are currently on the <strong>{currentPlan}</strong> plan
      </h1>

      {nextBillingDate && (
        <p className="text-sm text-muted-foreground mt-1">
          Next billing date: {new Date(nextBillingDate).toLocaleDateString()}
        </p>
      )}

      <Tabs defaultValue="yearly" className="lg:w-[680px] mt-5">
        <TabsList className="grid w-full grid-cols-2 gap-x-2 bg-transparent text-[#696767]">
          <TabsTrigger value="yearly">Pay yearly (20% discount)</TabsTrigger>
          <TabsTrigger value="monthly">Pay monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="yearly">{renderPlans('/yearly')}</TabsContent>
        <TabsContent value="monthly">{renderPlans('/monthly')}</TabsContent>
      </Tabs>
    </div>
  )
}

export default PricingPage
