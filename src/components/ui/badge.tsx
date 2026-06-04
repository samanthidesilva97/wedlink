import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'purple'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gold: 'bg-[#fdf6d8] text-[#B8960C]',
    purple: 'bg-purple-100 text-purple-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    inquiry: { label: 'Inquiry', variant: 'info' },
    negotiating: { label: 'Negotiating', variant: 'purple' },
    awaiting_payment: { label: 'Awaiting Payment', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    expired: { label: 'Expired', variant: 'default' },
    refunded: { label: 'Refunded', variant: 'warning' },
    disputed: { label: 'Disputed', variant: 'danger' },
    pending: { label: 'Pending Review', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    suspended: { label: 'Suspended', variant: 'danger' },
    free: { label: 'Free', variant: 'default' },
    premium: { label: 'Premium', variant: 'gold' },
  }
  const { label, variant } = map[status] || { label: status, variant: 'default' }
  return <Badge variant={variant}>{label}</Badge>
}
