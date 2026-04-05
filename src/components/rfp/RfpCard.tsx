import { Calendar, Users, Sparkles, Clock, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { RfpItem, RfpStatus } from '../../types/rfp'

interface StatusConfig {
  label: string
  className: string
  icon: React.ElementType
}

const STATUS_CONFIG: Record<RfpStatus, StatusConfig> = {
  'ai-draft': {
    label: 'AI Draft Ready',
    className: 'bg-primary-container/20 text-primary border border-primary/20',
    icon: Sparkles,
  },
  'pending': {
    label: 'Pending',
    className: 'bg-surface-container text-on-surface-variant border border-outline-variant/30',
    icon: Clock,
  },
  'sent': {
    label: 'Sent',
    className: 'bg-tertiary-container/20 text-tertiary border border-tertiary/20',
    icon: CheckCircle,
  },
}

interface RfpCardProps {
  rfp: RfpItem
  isActive?: boolean
  onClick?: () => void
}

export default function RfpCard({ rfp, isActive = false, onClick }: RfpCardProps) {
  const status = STATUS_CONFIG[rfp.status]
  const StatusIcon = status.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 border-l-4 transition-all duration-200 cursor-pointer',
        'bg-surface-container-lowest hover:bg-surface-container-low',
        isActive
          ? 'border-l-primary-container bg-surface-container-low shadow-sm'
          : 'border-l-transparent',
      )}
    >
      {/* Company + received time */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-sm text-on-surface leading-tight line-clamp-1">
          {rfp.company}
        </span>
        <span className="text-[11px] text-secondary whitespace-nowrap shrink-0">{rfp.receivedAt}</span>
      </div>

      {/* Event type */}
      <p className="text-xs text-secondary mb-3 line-clamp-1">{rfp.eventType}</p>

      {/* Guests + dates */}
      <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {rfp.guests} guests
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {rfp.checkIn}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-1.5">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', status.className)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>
    </button>
  )
}
