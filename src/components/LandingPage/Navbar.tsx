import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div>
        <h1
          style={{ fontFamily: 'var(--font-poppins)' }}
          className="text-3xl font-bold"
        >
          <Link href="/">Lynk</Link>
        </h1>
      </div>
      <div className="flex gap-x-1 ">
        <Button variant="ghost" className="rounded-full">
          <Link href="/sign-in">Log in</Link>
        </Button>
        <Button className="rounded-full">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  )
}

export default Navbar
