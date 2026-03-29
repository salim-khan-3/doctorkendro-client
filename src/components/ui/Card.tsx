import { cn } from '@/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

interface CardBodyProps {
  className?: string
  children: React.ReactNode
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-100',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children }: CardBodyProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-100',
        className
      )}
    >
      {children}
    </div>
  )
}

