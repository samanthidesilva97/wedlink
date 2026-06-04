'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  onChange?: (rating: number) => void
  className?: string
}

export function StarRating({ rating, size = 'md', onChange, className }: StarRatingProps) {
  const sizes = { sm: 14, md: 18, lg: 24 }
  const px = sizes[size]

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-transform',
            onChange && 'hover:scale-110 cursor-pointer',
            !onChange && 'cursor-default'
          )}
        >
          <Star
            size={px}
            className={star <= Math.round(rating) ? 'fill-[#B8960C] text-[#B8960C]' : 'fill-gray-200 text-gray-200'}
          />
        </button>
      ))}
    </div>
  )
}
