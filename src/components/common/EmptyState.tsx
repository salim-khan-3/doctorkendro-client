import { cn } from '@/utils'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="text-gray-300 mb-4">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm mt-1 max-w-sm">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-4">
          <Button variant="outline" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}