'use client'
import React from 'react'

interface BadgeProps {
  text: string
  bgColor?: string // expects something like "#FFD8D8"
  textColor?: string // expects something like "#000000"
}

const Badge = ({ text, bgColor, textColor }: BadgeProps) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={`px-3 py-1 text-sm rounded-none border border-none 
        hover:bg-gray-100 transition-colors`}
    >
      {text}
    </div>
  )
}

export default Badge
