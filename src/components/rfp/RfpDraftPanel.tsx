import { useState } from 'react'
import { Sparkles, RefreshCw, Pencil, Send, CheckCircle } from 'lucide-react'
import type { RfpItem } from '../../types/rfp'

interface RfpDraftPanelProps {
  rfp: RfpItem
  onApprove?: (rfpId: string, draft: string) => void
  onRegenerate?: (rfpId: string) => void
}

export default function RfpDraftPanel({ rfp, onApprove, onRegenerate }: RfpDraftPanelProps) {
  const [draft, setDraft] = useState(rfp.aiDraft)
  const [isEditing, setIsEditing] = useState(false)
  const [isApproved, setIsApproved] = useState(rfp.status === 'sent')

  function handleApprove() {
    setIsApproved(true)
    onApprove?.(rfp.id, draft)
  }

  return (
    <div className="space-y-4">
      {/* AI badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="font-label text-xs uppercase tracking-widest font-bold">AI Generated Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-secondary hover:text-on-surface border border-outline-variant/40 rounded-lg hover:bg-surface-container transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={() => onRegenerate?.(rfp.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-secondary hover:text-on-surface border border-outline-variant/40 rounded-lg hover:bg-surface-container transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Draft text area */}
      <div className="relative">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={!isEditing}
          rows={12}
          className={`w-full text-sm leading-relaxed bg-surface-container-low border rounded-xl px-4 py-4 focus:outline-none transition-all resize-none ${
            isEditing
              ? 'border-primary focus:ring-2 focus:ring-primary/30'
              : 'border-outline-variant/20 text-on-surface-variant cursor-default'
          }`}
        />
        {isEditing && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] text-secondary">{draft.length} chars</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {isApproved ? (
        <div className="flex items-center gap-2 p-4 bg-tertiary-container/15 rounded-xl border border-tertiary/20">
          <CheckCircle className="w-5 h-5 text-tertiary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-tertiary">Proposal Sent</p>
            <p className="text-xs text-secondary">This proposal has been approved and sent to the client.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            onClick={() => setDraft(rfp.aiDraft)}
            className="px-5 py-2.5 text-sm text-secondary hover:underline transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleApprove}
            className="primary-gradient px-8 py-3 rounded-lg text-white font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Approve & Send
          </button>
        </div>
      )}
    </div>
  )
}
