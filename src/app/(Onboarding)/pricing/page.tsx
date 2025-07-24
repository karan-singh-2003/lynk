import PricingPage from '@/components/Global/Billing'
import React from 'react'
import { Button } from '@/components/ui/button'

const BillingPage = () => {
  return (
    <div className="mt-5 -ml-28">
      <h1 className="font-bold text-[15px] mb-3 text-[#888888]">Your setup</h1>
      <h1 className="text-[#525252] font-semibold text-[20px]">
        Choose a Plan
      </h1>
      <h1 className="font-semibold text-[14px] text-[#696767]">
        Select a Plan that fits your needs best
      </h1>
      <PricingPage />
      <Button className="rounded-none my-5 border-[#696767]" variant="outline">
        I&apos;ll pick a plan later
      </Button>
    </div>
  )
}

export default BillingPage
