import { Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { RfpItem } from '../../types/rfp'

interface RfpCardProps {
  rfp: RfpItem
  isActive?: boolean
  onClick?: () => void
}

export default function RfpCard({ rfp, isActive = false, onClick }: RfpCardProps) {
  const draftSent = Boolean(rfp.proposal_uuid)

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

      {/* Contact name */}
      <p className="text-xs text-secondary mb-3 line-clamp-1">{rfp.contactName}</p>

      {/* Guests + dates */}
      <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {rfp.guests > 0 ? `${rfp.guests} guests` : 'Guests TBD'}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {rfp.checkIn}
        </span>
      </div>

      {/* Draft status badge */}
      <div className="flex items-center gap-1.5">
        {draftSent ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Draft Sent
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
            <Clock className="w-3 h-3" />
            Draft Not Sent
          </span>
        )}
      </div>
    </button>
  )
}
