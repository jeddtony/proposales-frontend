import { Mail, Phone, Users, Calendar, DollarSign } from 'lucide-react'
import type { RfpItem } from '../../types/rfp'

interface RfpInquiryPanelProps {
  rfp: RfpItem
}

export default function RfpInquiryPanel({ rfp }: RfpInquiryPanelProps) {
  const { contact } = rfp

  return (
    <div className="space-y-6">
      {/* Contact card */}
      <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
        <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{contact.avatarInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface">{contact.name}</p>
          <p className="text-xs text-secondary truncate">{contact.title}</p>
          <p className="text-xs text-secondary truncate">{contact.company}</p>
        </div>
      </div>

      {/* Contact details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
        >
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-on-surface-variant truncate">{contact.email}</span>
        </a>
        <a
          href={`tel:${contact.phone}`}
          className="flex items-center gap-2 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
        >
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-on-surface-variant">{contact.phone}</span>
        </a>
      </div>

      {/* Event summary chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-xl text-center">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-bold text-on-surface text-sm">{rfp.guests}</span>
          <span className="text-[10px] text-secondary uppercase tracking-widest">Guests</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-xl text-center">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-bold text-on-surface text-xs leading-tight">{rfp.checkIn}</span>
          <span className="text-[10px] text-secondary uppercase tracking-widest">Check-in</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-3 bg-surface-container-low rounded-xl text-center">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-bold text-on-surface text-sm">{rfp.revenue}</span>
          <span className="text-[10px] text-secondary uppercase tracking-widest">Est. Value</span>
        </div>
      </div>

      {/* Original inquiry */}
      <div>
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Original Inquiry</p>
        <blockquote className="border-l-4 border-primary-container/60 pl-4 py-1">
          <p className="text-sm text-on-surface-variant leading-relaxed italic">
            "{rfp.inquiryText}"
          </p>
        </blockquote>
      </div>
    </div>
  )
}
