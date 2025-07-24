import React from 'react'
import Spinner from './Spinner'
interface PageLoaderProps {
  title?: string
}
const PageLoader = ({ title }: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center h-[70vh] justify-center  ">
      <Spinner size={16} className="text-black dark:text-white" />
      <div className=" text-1xl font-poppins font-bold mt-1.5">{title}</div>
    </div>
  )
}

export default PageLoader
