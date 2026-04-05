import { useState, useEffect } from 'react'
import { X, FileText, ExternalLink, ChevronDown, ChevronUp, Play, Loader2, AlertCircle } from 'lucide-react'
import { proposalsApi, ApiError } from '../../api'
import type { ProposalDraftData } from '../../api'
import type { ProductBlock, VideoBlock } from '../../types/proposal'

// ── Helpers ──────────────────────────────────────────────────────────────────

const CDN = 'https://cdn.proposales.com'

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€', USD: '$', GBP: '£', SEK: 'kr', NOK: 'kr', DKK: 'kr',
}

function formatPrice(cents: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency
  const amount = cents / 100
  const formatted = amount.toLocaleString('en', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return ['SEK', 'NOK', 'DKK'].includes(currency)
    ? `${formatted} ${sym}`
    : `${sym}${formatted}`
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^/?#]+)/,
    /youtu\.be\/([^/?#]+)/,
    /youtube\.com\/embed\/([^/?#]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// ── Block sub-components ──────────────────────────────────────────────────────

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-center font-headline font-semibold text-lg text-[#0a1b39] mb-1">
      {children}
      <span className="block mx-auto mt-1.5 h-[2px] rounded-full bg-gray-200" style={{ width: 32 }} />
    </h3>
  )
}

function VideoBlockCard({ block }: { block: VideoBlock }) {
  const id = extractYouTubeId(block.video_url)
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null

  return (
    <div className="max-w-lg mx-auto text-center">
      <BlockTitle>{block.title}</BlockTitle>
      <div className="mt-4">
        <a
          href={block.video_url}
          target="_blank"
          rel="noreferrer"
          className="relative block w-full aspect-video rounded-xl overflow-hidden group cursor-pointer"
        >
          {thumb ? (
            <img src={thumb} alt={block.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ExternalLink className="w-7 h-7 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

function ProductBlockCard({ block, currency }: { block: ProductBlock; currency: string }) {
  const imageUuid = block.image_uuids?.[0]
  const price = block.unit_value_with_discount_with_tax
  const blockCurrency = block.currency ?? currency

  return (
    <div className="text-center">
      <BlockTitle>{block.title}</BlockTitle>
      <div className="mt-4 space-y-3">
        {imageUuid ? (
          <a
            href={`${CDN}/${imageUuid}/-/autorotate/yes/`}
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <img
              src={`${CDN}/${imageUuid}/-/preview/800x800/-/progressive/yes/`}
              alt={block.title}
              className="inline-block max-h-56 rounded-xl object-cover"
            />
          </a>
        ) : (
          <div className="w-full max-w-sm mx-auto h-40 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-sm">No image</span>
          </div>
        )}
        {block.description && (
          <p className="text-gray-400 text-sm max-w-md mx-auto">{block.description}</p>
        )}
        {price > 0 && (
          <div>
            <p className="text-2xl font-bold text-[#0a1b39]">
              {formatPrice(price, blockCurrency)}
            </p>
            {block.unit && (
              <p className="text-gray-400 text-xs mt-0.5">per {block.unit}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ draft }: { draft: ProposalDraftData }) {
  const [open, setOpen] = useState(false)
  const products = draft.blocks.filter((b): b is ProductBlock => b.type === 'product-block')
  const hasPrices = products.some((b) => b.unit_value_with_discount_with_tax > 0)

  return (
    <div className="text-center space-y-4">
      <BlockTitle>Total</BlockTitle>
      <p className="text-4xl font-bold text-[#0a1b39] tracking-tight">
        {formatPrice(draft.value_with_tax, draft.currency)}
      </p>

      {hasPrices && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mx-auto flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
          >
            {open ? <><ChevronUp className="w-4 h-4" />Hide summary</> : <><ChevronDown className="w-4 h-4" />Show summary</>}
          </button>
          {open && (
            <div className="max-w-xs mx-auto rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100 text-left overflow-hidden">
              {products.map((b) => (
                <div key={b.uuid} className="flex justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500">{b.title}</span>
                  <span className="text-sm font-semibold text-[#0a1b39]">
                    {formatPrice(b.unit_value_with_discount_with_tax, b.currency ?? draft.currency)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-2.5 bg-gray-100">
                <span className="text-sm font-semibold text-[#0a1b39]">Total</span>
                <span className="text-sm font-bold text-[#0a1b39]">
                  {formatPrice(draft.value_with_tax, draft.currency)}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-gray-400 text-xs">
        All prices in {draft.currency}{draft.tax_options.tax_included ? ' incl.' : ' excl.'} VAT
      </p>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface ProposalPreviewModalProps {
  proposalRequestId: number
  onClose: () => void
}

export default function ProposalPreviewModal({ proposalRequestId, onClose }: ProposalPreviewModalProps) {
  const [draft, setDraft] = useState<ProposalDraftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    proposalsApi
      .getProposalDraft(proposalRequestId)
      .then((res) => {
        if (cancelled) return
        // Ensure blocks is always an array even if the field is missing
        setDraft({ ...res, blocks: res.blocks ?? [] })
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof ApiError
              ? `Failed to load draft (${err.status})`
              : 'Could not load the proposal draft.',
          )
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [proposalRequestId])

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-full md:w-[72%] lg:w-[60%] xl:w-[55%] bg-white flex flex-col h-full shadow-2xl overflow-hidden animate-[slideInRight_0.25s_ease-out]">
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-semibold text-[#0a1b39] text-sm">Proposal Preview</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 uppercase tracking-wide">
              Draft
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3 text-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm">Loading proposal draft…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3 text-center p-8">
              <AlertCircle className="w-8 h-8 text-error" />
              <p className="text-sm text-on-surface-variant">{error}</p>
            </div>
          ) : draft ? (
            <>
              {/* Proposal title header */}
              {(() => {
                const FALLBACK_BG = 'b17a783f-eb08-4515-a4f8-a7d692bb416e'
                const bgUuid = draft.background_image?.uuid ?? FALLBACK_BG
                const bgUrl = bgUuid
                  ? `${CDN}/${bgUuid}/-/preview/2880x3000/-/quality/lighter/-/progressive/yes/`
                  : null
                return (
                  <div className="relative overflow-hidden min-h-[22vh] flex items-center justify-center bg-[#16161a]">
                    {bgUrl && (
                      <img
                        src={bgUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: bgUrl
                          ? 'linear-gradient(to bottom, rgba(22,22,26,0.45) 0%, rgba(22,22,26,0.55) 100%)'
                          : '#16161a',
                      }}
                    />
                    <div className="relative z-10 text-center px-8 py-10">
                      <span className="font-label text-[10px] uppercase tracking-[0.25em] text-white/60 mb-2 block">
                        Proposal Draft
                      </span>
                      <h1 className="font-headline text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                        {draft.title_md}
                      </h1>
                      {draft.recipient_company_name && (
                        <p className="text-white/80 text-sm">
                          Prepared for{' '}
                          <span className="font-semibold text-white">{draft.recipient_company_name}</span>
                          {draft.recipient_name && ` · ${draft.recipient_name}`}
                        </p>
                      )}
                      {draft.description_md && (
                        <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto italic">
                          "{draft.description_md}"
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Blocks */}
              {draft.blocks.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {draft.blocks.map((block) => (
                    <div key={block.uuid} className="px-6 md:px-10 py-10">
                      {block.type === 'video-block' && (
                        <VideoBlockCard block={block as VideoBlock} />
                      )}
                      {block.type === 'product-block' && (
                        <ProductBlockCard
                          block={block as ProductBlock}
                          currency={draft.currency}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="px-6 md:px-10 py-10 border-t border-gray-100">
                <SummaryCard draft={draft} />
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-gray-100 text-center">
                <p className="text-gray-300 text-xs">Powered by Proposales</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
