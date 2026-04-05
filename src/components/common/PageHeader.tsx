import { cn } from '@/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn('bg-white border-b border-gray-100', className)}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {children && <div>{children}</div>}
        </div>
      </div>
    </div>
  )
}