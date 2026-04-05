import { useState, useEffect } from 'react'
import { X, Package, Loader2, AlertCircle, Hash } from 'lucide-react'
import { proposalsApi, ApiError } from '../../api'
import type { RelevantProduct } from '../../api'

interface RelevantProductsModalProps {
  proposalRequestId: number
  companyName: string
  onClose: () => void
}

export default function RelevantProductsModal({
  proposalRequestId,
  companyName,
  onClose,
}: RelevantProductsModalProps) {
  const [products, setProducts] = useState<RelevantProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    proposalsApi
      .getRelevantContent(proposalRequestId)
      .then((res) => {
        if (!cancelled) setProducts(res.data)
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof ApiError
              ? `Failed to load suggestions (${err.status})`
              : 'Could not load product suggestions.',
          )
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [proposalRequestId])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a1b39]/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,31,61,0.3)] flex flex-col max-h-[80vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 md:p-7 border-b border-outline-variant/15 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Package className="w-4 h-4" />
              <span className="font-label text-xs uppercase tracking-widest font-bold">
                Suggested Products
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold text-[#0a1b39]">
              Relevant content for {companyName}
            </h3>
            <p className="text-secondary text-sm mt-0.5">
              AI-matched products based on this proposal request.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-surface-container rounded-full text-secondary transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm">Finding relevant products…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <AlertCircle className="w-7 h-7 text-error" />
              <p className="text-sm text-on-surface-variant">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
              <Package className="w-8 h-8 text-secondary" />
              <p className="font-semibold text-on-surface">No matches found</p>
              <p className="text-sm text-secondary">
                No products matched this proposal request.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.variation_id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && products.length > 0 && (
          <div className="p-5 md:p-7 border-t border-outline-variant/15 bg-surface-container-low/50 shrink-0 flex justify-between items-center">
            <span className="text-xs text-secondary">
              {products.length} {products.length === 1 ? 'product' : 'products'} matched
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-secondary hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: RelevantProduct }) {
  const title = product.title?.en ?? `Product #${product.product_id}`
  const description = product.description?.en ?? '—'

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-on-surface text-sm leading-tight">{title}</h4>
        {product.deactivated_at === null && (
          <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/20">
            Active
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>

      {/* IDs */}
      <div className="flex items-center gap-3 pt-1 border-t border-outline-variant/15">
        <span className="flex items-center gap-1 text-[10px] text-secondary font-mono">
          <Hash className="w-3 h-3" />
          Product {product.product_id}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-secondary font-mono">
          <Hash className="w-3 h-3" />
          Variant {product.variation_id}
        </span>
      </div>
    </div>
  )
}
