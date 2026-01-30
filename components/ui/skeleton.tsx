import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-muted rounded-md shimmer', className)}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

function SkeletonList({ rows = 5, className, ...props }: React.ComponentProps<'div'> & { rows?: number }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function SkeletonText({ lines = 3, className, ...props }: React.ComponentProps<'div'> & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonText }
