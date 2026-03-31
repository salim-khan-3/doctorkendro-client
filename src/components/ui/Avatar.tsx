import { cn, getInitials } from '@/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({
  src,
  firstName,
  lastName,
  size = 'md',
  className,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }

  const initials = getInitials(firstName, lastName)

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex-shrink-0',
          sizes[size],
          className
        )}
      >
        <Image
          src={src}
          alt={`${firstName} ${lastName}`}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
