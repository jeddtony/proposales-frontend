import { useState, useEffect, useMemo } from 'react'
import {
  Loader2, AlertCircle, RefreshCw, Search,
  Building2, Mail, Phone, CalendarClock,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { proposalsApi, ApiError } from '../api'
import type { Client, ClientsMeta } from '../api/proposals'

const LIMIT = 20

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [meta, setMeta] = useState<ClientsMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  async function fetchClients(p: number) {
    setLoading(true)
    setError(null)
    try {
      const res = await proposalsApi.getClients(p, LIMIT)
      setClients(res.data)
      setMeta(res.meta)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Failed to load clients (${err.status})`
          : 'Could not load clients.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClients(page) }, [page])

  function goTo(p: number) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company_name.toLowerCase().includes(q),
    )
  }, [clients, search])

  const totalPages = meta?.total_pages ?? 1

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#0a1b39]">Clients</h1>
          <p className="text-sm text-secondary mt-0.5">
            {loading ? 'Loading…' : meta ? `${meta.total} total client${meta.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
            <input
              type="text"
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-surface-container-low rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition w-56"
            />
          </div>
          {!loading && (
            <button
              onClick={() => fetchClients(page)}
              aria-label="Refresh"
              className="p-2 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-error" />
          <p className="text-sm text-on-surface-variant">{error}</p>
          <button onClick={() => fetchClients(page)} className="text-sm text-primary hover:underline cursor-pointer">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-60 text-center">
          <div>
            <p className="font-semibold text-on-surface mb-1">No clients found</p>
            <p className="text-sm text-secondary">Try adjusting your search.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <ClientCard key={client.email} client={client} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/20">
              <p className="text-sm text-secondary">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | '…')[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((item, i) =>
                      item === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-secondary text-sm">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goTo(item as number)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer
                            ${page === item
                              ? 'bg-primary text-white'
                              : 'text-secondary hover:text-on-surface hover:bg-surface-container border border-outline-variant/30'
                            }`}
                        >
                          {item}
                        </button>
                      ),
                    )}
                </div>

                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/20 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full ${avatarColor(client.name)} flex items-center justify-center shrink-0`}>
          <span className="text-white text-sm font-bold">{getInitials(client.name)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#0a1b39] text-sm truncate">{client.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-secondary shrink-0" />
            <span className="text-xs text-secondary truncate">{client.company_name}</span>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/8 text-[10px] font-semibold text-primary">
          {client.total_requests} {client.total_requests === 1 ? 'request' : 'requests'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span>{client.phone_number}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <CalendarClock className="w-3.5 h-3.5 shrink-0" />
          <span>Last request {formatRelativeTime(client.last_request_at)}</span>
        </div>
      </div>
    </div>
  )
}
