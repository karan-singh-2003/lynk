import React from 'react'
import { EllipsisVertical } from 'lucide-react'
const LinkSkeleton = () => {
  return (
    <div className="bg-[#FAFAFA] h-18 w-full flex items-center justify-between px-4 py-.5 animate-pulse my-1.5">
      <div className="bg-[#F0F0F0] rounded-full h-13 w-13"></div>
      <div className="flex flex-col gap-0.5 mx-2.5">
        <div className="bg-[#E4E4E4] h-5 w-35"></div>
        <div className="bg-[#EAEAEA] h-5 w-45"></div>
      </div>
      <div className="bg-[#E4E4E4] w-20 h-5"></div>

      <EllipsisVertical className="text-[#E4E4E4]" />
    </div>
  )
}

export default LinkSkeleton
