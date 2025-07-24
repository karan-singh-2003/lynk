import React from 'react'
import PricingPage from '../Global/Billing'

const Billing = () => {
  return (
    <div className="">
      <div>
        <h1
          style={{ fontFamily: 'var(--font-poppins)' }}
          className="text-2xl font-semibold text-[#0e0e0e] dark:text-white"
        >
          Billing
        </h1>
        <p className="text-base  font-medium mt-1">
          Select a Plan that fits your needs best
        </p>
      </div>
      <div>
        <PricingPage />
      </div>
    </div>
  )
}

export default Billing
