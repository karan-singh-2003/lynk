'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  className?: string
}

const CustomDialog = ({
  isOpen,
  onClose,
  title = 'Dialog Title',
  children,
  className = '',
}: CustomDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={clsx(
          // Responsive layout
          'w-full max-w-[92vw] sm:max-w-[540px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-screen-xl',
          // Styling
          'rounded-none sm:rounded-none px-4 py-6',
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-[#202020] dark:text-white text-base sm:text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
