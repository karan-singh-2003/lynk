'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'

interface LoginButtonProps {
  text: string
  onClick?: () => void
  imgUrl?: string
}

const LoginButton = ({ text, onClick, imgUrl }: LoginButtonProps) => {
  return (
    <div className="my-1.5">
      <Button
        onClick={onClick}
        className="flex items-center gap-2 w-full h-12 rounded-none  bg-[#F0F0F0] text-base hover:bg-[#E0E0E0] text-black font-medium"
      >
        {imgUrl && (
          <Image src={imgUrl} alt="login icon" width={20} height={20} />
        )}
        {text}
      </Button>
    </div>
  )
}

export default LoginButton
