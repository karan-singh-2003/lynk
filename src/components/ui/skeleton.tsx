import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted dark:bg-[#4b4b4b] animate-pulse rounded-none',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
