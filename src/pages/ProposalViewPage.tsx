import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Play, ChevronDown, ChevronUp, Check, X, ExternalLink } from 'lucide-react'
import ProposalHero from '../components/proposal/ProposalHero'
import type { ProposalData, ProposalBlock, ProductBlock, VideoBlock } from '../types/proposal'

// ── CDN / media helpers ──────────────────────────────────────────────────────

const CDN = 'https://cdn.proposales.com'

function productImageUrl(uuid: string) {
  return `${CDN}/${uuid}/-/preview/800x800/-/progressive/yes/`
}

function avatarImageUrl(uuid: string) {
  return `${CDN}/${uuid}/-/scale_crop/200x200/center/`
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^/?#]+)/,
    /youtu\.be\/([^/?#]+)/,
    /youtube\.com\/embed\/([^/?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

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
  // Prefix symbol or suffix (SEK/NOK/DKK suffix)
  const suffixed = ['SEK', 'NOK', 'DKK'].includes(currency)
  return suffixed ? `${formatted} ${sym}` : `${sym}${formatted}`
}

// ── Shared section title ──────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center font-headline font-semibold text-xl md:text-2xl text-[#1a1a2e] mb-1">
      {children}
      <span
        className="block mx-auto mt-2 h-[3px] rounded-full bg-gray-200"
        style={{ width: 40 }}
      />
    </h2>
  )
}

// ── Video block ──────────────────────────────────────────────────────────────

function VideoSection({ block }: { block: VideoBlock }) {
  const videoId = extractYouTubeId(block.video_url)
  const thumbUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null

  return (
    <div className="max-w-[520px] mx-auto text-center">
      <SectionTitle>{block.title}</SectionTitle>
      <div className="mt-6">
        <a
          href={block.video_url}
          target="_blank"
          rel="noreferrer"
          className="relative block w-full aspect-video rounded overflow-hidden group cursor-pointer"
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={block.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

// ── Product block ─────────────────────────────────────────────────────────────

function ProductSection({ block, currency }: { block: ProductBlock; currency: string }) {
  const imageUuid = block.image_uuids?.[0]
  const price = block.unit_value_with_discount_with_tax
  const blockCurrency = block.currency ?? currency

  return (
    <div className="text-center">
      <SectionTitle>{block.title}</SectionTitle>
      <div className="mt-6 space-y-4">
        {imageUuid && (
          <a
            href={`${CDN}/${imageUuid}/-/autorotate/yes/`}
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <img
              src={productImageUrl(imageUuid)}
              alt={block.title}
              className="inline-block max-h-[30vh] rounded object-cover"
            />
          </a>
        )}
        {block.description && (
          <p className="text-gray-500 max-w-md mx-auto text-sm whitespace-pre-wrap">
            {block.description}
          </p>
        )}
        {price > 0 && (
          <div className="text-center">
            <p className="text-2xl font-semibold text-[#1a1a2e]">
              {formatPrice(price, blockCurrency)}
            </p>
            {block.unit && (
              <p className="text-gray-400 text-xs mt-1">per {block.unit}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Summary section ───────────────────────────────────────────────────────────

function SummarySection({
  blocks,
  currency,
  taxOptions,
  valueWithTax,
  onAccept,
  onReject,
}: {
  blocks: ProposalBlock[]
  currency: string
  taxOptions: ProposalData['tax_options']
  valueWithTax: number
  onAccept: () => void
  onReject: () => void
}) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  const productBlocks = blocks.filter((b): b is ProductBlock => b.type === 'product-block')
  const hasPrices = productBlocks.some((b) => b.unit_value_with_discount_with_tax > 0)

  return (
    <div className="text-center">
      <SectionTitle>Total</SectionTitle>
      <div className="mt-6 space-y-4">
        <p className="text-4xl md:text-5xl font-bold text-[#1a1a2e] tracking-tight">
          {formatPrice(valueWithTax, currency)}
        </p>

        {/* Breakdown toggle */}
        {hasPrices && (
          <>
            <button
              onClick={() => setShowBreakdown((v) => !v)}
              className="text-sm text-blue-500 hover:text-blue-400 mx-auto flex items-center gap-1 transition-colors cursor-pointer"
            >
              {showBreakdown ? (
                <><ChevronUp className="w-4 h-4" /> Hide summary</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> Show summary</>
              )}
            </button>

            {showBreakdown && (
              <div className="max-w-sm mx-auto rounded-xl bg-gray-50 border border-gray-200 divide-y divide-gray-100 text-left overflow-hidden">
                {productBlocks.map((b) => (
                  <div key={b.uuid} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-600">{b.title}</span>
                    <span className="text-sm font-semibold text-[#1a1a2e]">
                      {formatPrice(b.unit_value_with_discount_with_tax, b.currency ?? currency)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
                  <span className="text-sm font-semibold text-[#1a1a2e]">Total</span>
                  <span className="text-sm font-bold text-[#1a1a2e]">
                    {formatPrice(valueWithTax, currency)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tax note */}
        <p className="text-gray-400 text-sm">
          All prices are in {currency}
          {!taxOptions.tax_included ? ' excl. VAT' : ' incl. VAT'}.
        </p>

        {/* Accept / Reject */}
        <div className="pt-4 space-y-3">
          <button
            onClick={onAccept}
            className="block mx-auto px-10 py-3 rounded-full text-white text-lg font-medium
              bg-blue-500 hover:bg-blue-400 active:bg-blue-600
              transition-colors cursor-pointer"
            style={{ animation: 'pulsing-blue 2s ease infinite' }}
          >
            Accept
          </button>
          <div className="text-gray-400 text-sm">
            or{' '}
            <button
              onClick={onReject}
              className="underline hover:text-red-400 transition-colors cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Contact / company sections ────────────────────────────────────────────────

function ContactSection({ proposal }: { proposal: ProposalData }) {
  const avatarUrl = proposal.contact_avatar_uuid
    ? avatarImageUrl(proposal.contact_avatar_uuid)
    : null

  const initials = proposal.contact_name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="text-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={proposal.contact_name}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-400">{initials}</span>
        </div>
      )}
      <h3 className="font-semibold text-[#1a1a2e] text-lg">{proposal.contact_name}</h3>
      {proposal.contact_title && (
        <p className="text-gray-400 text-sm mt-0.5">{proposal.contact_title}</p>
      )}
      <p className="text-gray-400 text-sm mt-1">
        <a
          href={`mailto:${proposal.contact_email}`}
          className="underline hover:text-gray-600 transition-colors"
        >
          {proposal.contact_email}
        </a>
      </p>
      {proposal.contact_phone && (
        <p className="text-gray-400 text-sm mt-0.5">{proposal.contact_phone}</p>
      )}
    </div>
  )
}

function CompanySection({ proposal }: { proposal: ProposalData }) {
  return (
    <div className="text-center">
      <h3 className="font-semibold text-[#1a1a2e] text-lg">{proposal.company_name}</h3>
      {proposal.company_website && (
        <p className="text-gray-400 text-sm mt-1">
          <a
            href={proposal.company_website}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-600 transition-colors"
          >
            {proposal.company_website}
          </a>
        </p>
      )}
      {proposal.company_email && (
        <p className="text-gray-400 text-sm mt-0.5">
          <a href={`mailto:${proposal.company_email}`} className="underline hover:text-gray-600 transition-colors">
            {proposal.company_email}
          </a>
        </p>
      )}
    </div>
  )
}

// ── Accept / Reject confirmation overlay ─────────────────────────────────────

function ResponseOverlay({
  type,
  onClose,
}: {
  type: 'accepted' | 'rejected'
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            type === 'accepted' ? 'bg-blue-50' : 'bg-red-50'
          }`}
        >
          {type === 'accepted' ? (
            <Check className="w-8 h-8 text-blue-500" />
          ) : (
            <X className="w-8 h-8 text-red-500" />
          )}
        </div>
        <h2 className="text-[#1a1a2e] font-semibold text-xl mb-2">
          {type === 'accepted' ? 'Proposal Accepted' : 'Proposal Rejected'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {type === 'accepted'
            ? 'The sender has been notified. We look forward to working with you.'
            : 'The sender has been notified of your decision.'}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ── Sample proposal data ──────────────────────────────────────────────────────

const SAMPLE_PROPOSAL: ProposalData = {
  archived_at: null,
  background_image: { id: 361997, uuid: '07db40f6-58a1-4a28-95af-4aa4ad232203' },
  background_video: null,
  blocks: [
    {
      type: 'video-block',
      uuid: '0eaec18a-bc31-49b5-aa2b-9f5f2239aa36',
      title: 'Aquarium video',
      language: 'en',
      video_url: 'https://www.youtube.com/shorts/JKGtAfQHFrI',
      content_id: 2378,
      updated_at: '2026-04-01T08:48:21.29616+00:00',
      _title_was_overridden: false,
      _out_of_sync_with_content_library: false,
    },
    {
      type: 'product-block',
      unit: 'person',
      uuid: 'e090e165-4b3d-431d-866d-c7a13274ead8',
      title: 'Swiming Pool',
      currency: 'EUR',
      language: 'en',
      content_id: 177825,
      updated_at: '2026-04-01T08:41:50.916789+00:00',
      image_uuids: ['eb7372a0-9e1e-45c5-815c-f30d41cd368d'],
      package_split: [{
        vat: 0, type: 'other', fixed: false, value_with_tax: 7000,
        enable_discount: true, value_without_tax: 7000, value_saved_with_tax: false,
      }],
      inventory_connected: false,
      _title_was_overridden: false,
      _out_of_sync_with_content_library: false,
      unit_value_with_discount_with_tax: 7000,
      unit_value_with_discount_without_tax: 7000,
      unit_value_without_discount_with_tax: 7000,
      unit_value_without_discount_without_tax: 7000,
    },
  ],
  company_address: '',
  company_email: '',
  company_name: 'Teledeus',
  company_phone: '',
  company_logo_uuid: null,
  company_website: '',
  contact_avatar_uuid: null,
  contact_email: 'jed@teledeus.com',
  contact_name: 'Jedidiah Anthony',
  contact_phone: '',
  contact_title: '',
  creator_name: 'Jedidiah Anthony',
  creator_email: 'jed@teledeus.com',
  currency: 'EUR',
  description_md: null,
  description_html: null,
  expires_at: null,
  has_been_sent: false,
  is_agreement: false,
  is_test: false,
  language: 'en',
  payments_enabled: false,
  recipient_company_name: null,
  recipient_email: null,
  recipient_name: null,
  recipient_phone: null,
  recipient_is_set: false,
  status: 'draft',
  tax_options: { mode: 'standard', tax_included: false },
  title: 'Template with backgroud\u200e',
  title_md: 'Template with backgroud\u200e',
  value_with_tax: 7000,
  value_without_tax: 7000,
  created_at: 1775238998480,
  updated_at: 1775238998480,
  status_changed_at: 1775238998480,
} as unknown as ProposalData

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProposalViewPage() {
  const { state } = useLocation()
  const proposal: ProposalData = (state as { proposal?: ProposalData })?.proposal ?? SAMPLE_PROPOSAL

  const [response, setResponse] = useState<'accepted' | 'rejected' | null>(null)

  return (
    <>
      {/* Pulse animation for accept button */}
      <style>{`
        @keyframes pulsing-blue {
          0%   { box-shadow: 0 0 0 0 rgba(85,172,238,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(85,172,238,0); }
          100% { box-shadow: 0 0 0 0 rgba(85,172,238,0); }
        }
      `}</style>

      <div className="min-h-screen bg-white font-body">
        {/* Hero */}
        <ProposalHero proposal={proposal} />

        {/* Blocks */}
        <div className="space-y-16 py-12">
          {proposal.blocks.map((block) => (
            <section key={block.uuid} className="px-4 sm:px-8 max-w-3xl mx-auto">
              {block.type === 'video-block' && <VideoSection block={block} />}
              {block.type === 'product-block' && (
                <ProductSection block={block} currency={proposal.currency} />
              )}
            </section>
          ))}
        </div>

        {/* Summary */}
        <section id="summary" className="px-4 sm:px-8 max-w-3xl mx-auto py-8">
          <SummarySection
            blocks={proposal.blocks}
            currency={proposal.currency}
            taxOptions={proposal.tax_options}
            valueWithTax={proposal.value_with_tax}
            onAccept={() => setResponse('accepted')}
            onReject={() => setResponse('rejected')}
          />
        </section>

        {/* Contact */}
        <section className="px-4 sm:px-8 max-w-3xl mx-auto py-8 border-t border-gray-100">
          <ContactSection proposal={proposal} />
        </section>

        {/* Company */}
        {proposal.company_name && (
          <section className="px-4 sm:px-8 max-w-3xl mx-auto py-6 border-t border-gray-100">
            <CompanySection proposal={proposal} />
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 flex justify-center border-t border-gray-100 mt-4">
          <a
            href="https://proposales.com"
            target="_blank"
            rel="noreferrer"
            className="text-gray-300 hover:text-gray-400 transition-colors text-xs flex items-center gap-1.5"
          >
            Powered by Proposales
          </a>
        </footer>
      </div>

      {/* Response overlay */}
      {response && (
        <ResponseOverlay type={response} onClose={() => setResponse(null)} />
      )}
    </>
  )
}
