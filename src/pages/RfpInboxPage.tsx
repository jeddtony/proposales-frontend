import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Package } from 'lucide-react'
import RfpTopBar from '../components/layout/RfpTopBar'
import RfpCard from '../components/rfp/RfpCard'
import RfpInquiryPanel from '../components/rfp/RfpInquiryPanel'
import RfpDraftPanel from '../components/rfp/RfpDraftPanel'
import RfpChatPanel from '../components/rfp/RfpChatPanel'
import RelevantProductsModal from '../components/rfp/RelevantProductsModal'
import ProposalLifecycle from '../components/rfp/ProposalLifecycle'
import { proposalsApi, ApiError } from '../api'
import type { ProposalRequest } from '../api'
import type { RfpItem, RfpStatus } from '../types/rfp'

type FilterValue = 'all' | RfpStatus
type DetailTab = 'inquiry' | 'draft' | 'chat'

// ── Mapping helpers ──────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function mapToRfpItem(req: ProposalRequest): RfpItem {
  return {
    id: String(req.id),
    company: req.company_name,
    contactName: req.name,
    eventType: 'Event Request',      // not in API — placeholder
    guests: 0,                        // not in API — placeholder
    checkIn: 'TBD',                  // not in API — placeholder
    checkOut: 'TBD',                 // not in API — placeholder
    receivedAt: formatRelativeTime(req.createdAt),
    status: 'pending',               // not in API — placeholder
    stage: 'inquiry',                // not in API — placeholder
    inquiryText: req.details,
    contact: {
      name: req.name,
      title: 'Client',               // not in API — placeholder
      company: req.company_name,
      email: req.email,
      phone: req.phone_number,
      avatarInitials: getInitials(req.name),
    },
    aiDraft: [
      `Dear ${req.name.split(' ')[0]},`,
      '',
      `Thank you for reaching out regarding your event at ${req.company_name}. We would be delighted to assist you.`,
      '',
      `Based on your request: "${req.details}"`,
      '',
      'We will prepare a tailored proposal and reach out shortly to discuss the details.',
      '',
      'Warm regards,\n[Your Name]',
    ].join('\n'),
    revenue: '—',                    // not in API — placeholder
  }
}

// ── Page component ───────────────────────────────────────────────────────────

export default function RfpInboxPage() {
  const [rfps, setRfps] = useState<RfpItem[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')
  const [detailTab, setDetailTab] = useState<DetailTab>('inquiry')
  const [mobileShowDetail, setMobileShowDetail] = useState(false)
  const [productsModalOpen, setProductsModalOpen] = useState(false)

  // ── Fetch list on mount ──────────────────────────────────────────────────
  async function fetchList() {
    setListLoading(true)
    setListError(null)
    try {
      const res = await proposalsApi.getProposalRequests()
      const mapped = res.data.map(mapToRfpItem)
      setRfps(mapped)
      if (mapped.length > 0 && !selectedId) {
        setSelectedId(mapped[0].id)
      }
    } catch (err) {
      setListError(
        err instanceof ApiError
          ? `Failed to load (${err.status}): ${err.message}`
          : 'Could not load RFP requests.',
      )
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => { fetchList() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch detail when selection changes ──────────────────────────────────
  useEffect(() => {
    if (!selectedId) return
    const numId = parseInt(selectedId, 10)
    if (isNaN(numId)) return

    setDetailLoading(true)
    setDetailError(null)
    proposalsApi
      .getProposalRequest(numId)
      .then((res) => {
        setRfps((prev) =>
          prev.map((r) => (r.id === selectedId ? mapToRfpItem(res.data) : r)),
        )
      })
      .catch((err) => {
        setDetailError(
          err instanceof ApiError
            ? `Could not load details (${err.status})`
            : 'Could not load details.',
        )
      })
      .finally(() => setDetailLoading(false))
  }, [selectedId])

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rfps.filter((r) => {
      const matchesFilter = filter === 'all' || r.status === filter
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.company.toLowerCase().includes(q) ||
        r.eventType.toLowerCase().includes(q) ||
        r.contactName.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [rfps, filter, search])

  const selected = rfps.find((r) => r.id === selectedId) ?? null

  function handleSelectRfp(id: string) {
    setSelectedId(id)
    setDetailTab('inquiry')
    setMobileShowDetail(true)
  }

  function handleApprove(rfpId: string) {
    setRfps((prev) =>
      prev.map((r) => (r.id === rfpId ? { ...r, status: 'sent', stage: 'approval' } : r)),
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <RfpTopBar
        onSearch={setSearch}
        activeFilter={filter}
        onFilterChange={setFilter}
        totalCount={listLoading ? undefined : filtered.length}
      />

      <div className="flex h-[calc(100vh-57px)] md:h-[calc(100vh-65px)] overflow-hidden">

        {/* ── List panel ──────────────────────────────────────────────── */}
        <aside
          className={`
            w-full md:w-[380px] md:min-w-[320px] md:max-w-[420px]
            flex-shrink-0 flex flex-col
            border-r border-surface-container
            overflow-y-auto
            ${mobileShowDetail ? 'hidden md:flex' : 'flex'}
          `}
        >
          <div className="px-4 py-3 border-b border-surface-container bg-surface-container-lowest sticky top-0 z-[1] flex items-center justify-between">
            <span className="text-xs font-label uppercase tracking-widest text-secondary">
              {listLoading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'Request' : 'Requests'}`}
            </span>
            {!listLoading && (
              <button
                onClick={fetchList}
                aria-label="Refresh"
                className="p-1 text-secondary hover:text-on-surface transition-colors cursor-pointer rounded"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {listLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : listError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
              <AlertCircle className="w-8 h-8 text-error" />
              <p className="text-sm text-on-surface-variant">{listError}</p>
              <button
                onClick={fetchList}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="font-semibold text-on-surface mb-1">No RFPs found</p>
                <p className="text-sm text-secondary">Try adjusting your search or filter.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-surface-container">
              {filtered.map((rfp) => (
                <RfpCard
                  key={rfp.id}
                  rfp={rfp}
                  isActive={rfp.id === selectedId}
                  onClick={() => handleSelectRfp(rfp.id)}
                />
              ))}
            </div>
          )}
        </aside>

        {/* ── Detail panel ────────────────────────────────────────────── */}
        <main
          className={`
            flex-1 flex flex-col overflow-hidden
            ${mobileShowDetail ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selected ? (
            <>
              {/* Detail header */}
              <div className="px-4 md:px-8 py-4 md:py-6 border-b border-surface-container bg-surface-container-lowest shrink-0">
                <button
                  onClick={() => setMobileShowDetail(false)}
                  className="md:hidden flex items-center gap-1.5 text-sm text-secondary hover:text-on-surface mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to inbox
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <h3 className="font-headline text-xl font-bold text-[#0a1b39]">
                        {selected.company}
                      </h3>
                      <p className="text-sm text-secondary mt-0.5">
                        {selected.contactName} · {selected.eventType}
                      </p>
                    </div>
                    <button
                      onClick={() => setProductsModalOpen(true)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary-container/10 transition-all cursor-pointer mt-0.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Suggest Products</span>
                      <span className="sm:hidden">Products</span>
                    </button>
                  </div>
                  <div className="shrink-0 w-full sm:w-80">
                    <ProposalLifecycle currentStage={selected.stage} />
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  {(['inquiry', 'draft', 'chat'] as DetailTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer
                        ${detailTab === tab
                          ? 'bg-surface-container text-[#0a1b39] font-semibold'
                          : 'text-secondary hover:text-[#0a1b39] hover:bg-surface-container-low'}
                      `}
                    >
                      {tab === 'draft' ? 'AI Draft' : tab === 'chat' ? 'Chat' : 'Inquiry'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail content */}
              <div className={`flex-1 p-4 md:p-8 min-h-0 ${detailTab === 'chat' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
                {detailLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : detailError ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
                    <AlertCircle className="w-7 h-7 text-error" />
                    <p className="text-sm text-on-surface-variant">{detailError}</p>
                  </div>
                ) : detailTab === 'inquiry' ? (
                  <RfpInquiryPanel rfp={selected} />
                ) : detailTab === 'draft' ? (
                  <RfpDraftPanel
                    rfp={selected}
                    onApprove={handleApprove}
                    onRegenerate={(id) => console.log('Regenerate:', id)}
                  />
                ) : (
                  <RfpChatPanel proposalRequestId={parseInt(selected.id, 10)} />
                )}
              </div>
            </>
          ) : !listLoading && (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="font-semibold text-on-surface mb-1">Select an RFP</p>
                <p className="text-sm text-secondary">Choose a request from the inbox to view details.</p>
              </div>
            </div>
          )}
        </main>

      </div>

      {productsModalOpen && selected && (
        <RelevantProductsModal
          proposalRequestId={parseInt(selected.id, 10)}
          companyName={selected.company}
          onClose={() => setProductsModalOpen(false)}
        />
      )}
    </>
  )
}
