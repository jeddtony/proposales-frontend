import { useState, useEffect } from 'react'
import { Plus, Loader2, AlertCircle, X, Package, Calendar, Hash, Upload, Pencil, Trash2, Save } from 'lucide-react'
import { proposalsApi, ApiError } from '../api'
import type { ContentItem, CreateContentBody, UpdateContentBody } from '../api'
import SuccessToast from '../components/ui/SuccessToast'
import BulkUploadModal from '../components/content/BulkUploadModal'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(tsMs: number): string {
  return new Date(tsMs).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getTitle(item: ContentItem): string {
  return item.title?.en ?? Object.values(item.title ?? {})[0] ?? '—'
}

function getDescription(item: ContentItem): string {
  return item.description?.en ?? Object.values(item.description ?? {})[0] ?? ''
}

// ── Add Content Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM: CreateContentBody = {
  title: '',
  language: 'en',
  description: '',
  image_url: '',
}

interface AddContentModalProps {
  onClose: () => void
  onCreated: (item: { product_id: number; variation_id: number }, title: string) => void
}

function AddContentModal({ onClose, onCreated }: AddContentModalProps) {
  const [form, setForm] = useState<CreateContentBody>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof CreateContentBody, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await proposalsApi.createContent(form)
      onCreated(res.data, form.title)
      onClose()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Failed to create content (${err.status})`
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a1b39] font-headline">Add Content</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Grand Ballroom"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description of this content item"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Language
            </label>
            <select
              value={form.language}
              onChange={(e) => set('language', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition bg-white"
            >
              <option value="en">English</option>
              <option value="sv">Swedish</option>
              <option value="no">Norwegian</option>
              <option value="da">Danish</option>
              <option value="de">German</option>
              <option value="fr">French</option>
            </select>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Content Modal ────────────────────────────────────────────────────────

interface EditContentModalProps {
  item: ContentItem
  onClose: () => void
  onSaved: (updated: ContentItem) => void
}

function EditContentModal({ item, onClose, onSaved }: EditContentModalProps) {
  const [form, setForm] = useState<UpdateContentBody>({
    variation_id: item.variation_id,
    language: Object.keys(item.title)[0] ?? 'en',
    title: getTitle(item),
    description: getDescription(item),
    image_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof UpdateContentBody, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setError(null)
    try {
      await proposalsApi.updateContent(form)
      onSaved({
        ...item,
        title: { [form.language]: form.title },
        description: { [form.language]: form.description },
      })
      onClose()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Failed to update (${err.status})`
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a1b39] font-headline">Edit Content</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Language</label>
            <select
              value={form.language}
              onChange={(e) => set('language', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1b39] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition bg-white"
            >
              <option value="en">English</option>
              <option value="sv">Swedish</option>
              <option value="no">Norwegian</option>
              <option value="da">Danish</option>
              <option value="de">German</option>
              <option value="fr">French</option>
            </select>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Content Card ──────────────────────────────────────────────────────────────

interface ContentCardProps {
  item: ContentItem
  onEdit: (item: ContentItem) => void
  onDelete: (variationId: number) => void
  deleting: boolean
}

function ContentCard({ item, onEdit, onDelete, deleting }: ContentCardProps) {
  const title = getTitle(item)
  const description = getDescription(item)
  const isActive = item.deactivated_at === null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0a1b39] text-sm truncate">{title}</p>
            {description && (
              <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{description}</p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Hash className="w-3 h-3" />
          Variation {item.variation_id}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => onDelete(item.variation_id)}
          disabled={deleting}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editItem, setEditItem] = useState<ContentItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ show: boolean; title: string; action?: string }>({ show: false, title: '' })

  function fetchItems() {
    setLoading(true)
    setError(null)
    proposalsApi
      .getContent()
      .then((res) => setItems(res.data))
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? `Failed to load content (${err.status})`
            : 'Could not load content.',
        ),
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(variationId: number) {
    setDeletingId(variationId)
    const item = items.find((i) => i.variation_id === variationId)
    try {
      await proposalsApi.deleteContent(variationId)
      setItems((prev) => prev.filter((i) => i.variation_id !== variationId))
      setToast({ show: true, title: item ? getTitle(item) : 'Item', action: 'deleted' })
    } catch {
      // silently ignore — item stays in list
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved(updated: ContentItem) {
    setItems((prev) => prev.map((i) => i.variation_id === updated.variation_id ? updated : i))
    setToast({ show: true, title: getTitle(updated), action: 'updated' })
  }

  function handleCreated(created: { product_id: number; variation_id: number }, title: string) {
    const newItem: ContentItem = {
      variation_id: created.variation_id,
      product_id: created.product_id,
      created_at: Date.now(),
      deactivated_at: null,
      integration_metadata: null,
      integration_id: null,
      title: { en: title },
      description: {},
    }
    setItems((prev) => [newItem, ...prev])
    setToast({ show: true, title })
  }

  const filtered = items.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      getTitle(item).toLowerCase().includes(q) ||
      getDescription(item).toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-headline text-[#0a1b39]">Content</h1>
          <p className="text-secondary text-sm mt-0.5">Manage your proposal content library</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#0a1b39] rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-95 transition cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 active:scale-95 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search content…"
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0a1b39] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition bg-white"
        />
      </div>

      {/* States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-secondary">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm">Loading content…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <Package className="w-10 h-10 text-gray-200" />
          <p className="text-sm text-gray-400">
            {search ? 'No content matches your search.' : 'No content yet. Add your first item.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-secondary mb-4">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ContentCard
                key={item.variation_id}
                item={item}
                onEdit={setEditItem}
                onDelete={handleDelete}
                deleting={deletingId === item.variation_id}
              />
            ))}
          </div>
        </>
      )}

      {modalOpen && (
        <AddContentModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {bulkOpen && (
        <BulkUploadModal
          onClose={() => {
            setBulkOpen(false)
            fetchItems()
          }}
          onUploaded={() => {
            fetchItems()
            setToast({ show: true, title: 'Bulk upload complete' })
          }}
        />
      )}

      {editItem && (
        <EditContentModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={handleSaved}
        />
      )}

      <SuccessToast
        show={toast.show}
        title={toast.action === 'updated' ? 'Content Updated' : toast.action === 'deleted' ? 'Content Deleted' : 'Content Created'}
        subtitle={toast.title}
        duration={4000}
        onClose={() => setToast({ show: false, title: '' })}
      />
    </div>
  )
}
