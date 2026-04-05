import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { proposalsApi, ApiError } from '../../api'
import type { CreateProposalRequestResponse } from '../../api'

interface ProposalFormData {
  name: string
  company: string
  email: string
  phone: string
  reference: string
  address: string
  zip: string
  city: string
  eventDetails: string
}

const INITIAL_FORM: ProposalFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  reference: '',
  address: '',
  zip: '',
  city: '',
  eventDetails: '',
}

interface NewProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveDraft?: (data: ProposalFormData) => void
  onGenerate?: (data: ProposalFormData, response: CreateProposalRequestResponse) => void
}

/** Centered section divider with small-caps label */
function FormSectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-outline-variant/20" />
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-outline-variant/20" />
    </div>
  )
}

/** Reusable form field: label + input */
function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  mono = false,
  className = '',
}: {
  id: keyof ProposalFormData
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (id: keyof ProposalFormData, value: string) => void
  mono?: boolean
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="text-xs font-semibold text-on-surface-variant ml-1 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className={`w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm ${mono ? 'font-mono uppercase' : ''}`}
      />
    </div>
  )
}

/**
 * New Proposal glassmorphism modal.
 * Three form sections: Client Foundation, Logistics & Location, Event Definition.
 * Submits to POST /proposal-requests on Generate.
 */
export default function NewProposalModal({
  isOpen,
  onClose,
  onSaveDraft,
  onGenerate,
}: NewProposalModalProps) {
  const [form, setForm] = useState<ProposalFormData>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(id: keyof ProposalFormData, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }))
    if (error) setError(null)
  }

  async function handleGenerate() {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await proposalsApi.createProposalRequest({
        email: form.email,
        name: form.name,
        phone_number: form.phone,
        company_name: form.company,
        details: form.eventDetails,
      })
      onGenerate?.(form, response)
      setForm(INITIAL_FORM)
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Request failed (${err.status}): ${err.message}`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a1b39]/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-card w-full max-w-4xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,31,61,0.3)] flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 md:p-8 border-b border-outline-variant/15 flex justify-between items-start shrink-0">
          <div>
            <h3 className="font-headline text-2xl font-bold text-[#0a1b39]">New Proposal Request</h3>
            <p className="text-secondary text-sm mt-1">Please fill in the concierge details to generate your draft.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 hover:bg-surface-container rounded-full text-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="p-5 md:p-8 overflow-y-auto flex-1">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

            {/* ── Client Foundation ─────────────────────── */}
            <div className="space-y-6">
              <FormSectionDivider label="Client Foundation" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField id="name"    label="Contact Name"   placeholder="e.g. Jane Smith"          value={form.name}    onChange={handleChange} />
                <FormField id="company" label="Company Name"   placeholder="e.g. Sterling Cooper"     value={form.company} onChange={handleChange} />
                <FormField id="email"   label="Email Address"  type="email" placeholder="contact@company.com" value={form.email}   onChange={handleChange} />
                <FormField id="phone"   label="Phone Number"   type="tel"   placeholder="+1 (555) 000-0000"   value={form.phone}   onChange={handleChange} />
                <FormField id="reference" label="Reference"    placeholder="REF-2024-001"              value={form.reference} onChange={handleChange} mono className="sm:col-span-2" />
              </div>
            </div>

            {/* ── Logistics & Location ──────────────────── */}
            <div className="space-y-6 pt-2">
              <FormSectionDivider label="Logistics & Location" />
              <FormField id="address" label="Invoice Address" placeholder="Street name and number" value={form.address} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FormField id="zip"  label="Zip Code" placeholder="12345"             value={form.zip}  onChange={handleChange} />
                <FormField id="city" label="City"     placeholder="San Francisco, CA" value={form.city} onChange={handleChange} className="col-span-2" />
              </div>
            </div>

            {/* ── Event Definition ──────────────────────── */}
            <div className="space-y-6 pt-2">
              <FormSectionDivider label="Event Definition" />
              <div className="space-y-1.5">
                <label htmlFor="eventDetails" className="text-xs font-semibold text-on-surface-variant ml-1 block">
                  Detail of Event
                </label>
                <textarea
                  id="eventDetails"
                  placeholder="Describe the event requirements, room blocks, and preferred dates..."
                  value={form.eventDetails}
                  onChange={(e) => handleChange('eventDetails', e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm resize-none"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-8 border-t border-outline-variant/15 shrink-0 bg-surface-container-low/50">
          {error && (
            <p className="text-sm text-error mb-3 text-right">{error}</p>
          )}
          <div className="flex flex-wrap justify-end items-center gap-3">
            <button
              onClick={() => onSaveDraft?.(form)}
              disabled={isSubmitting}
              className="px-6 py-3 text-secondary font-semibold hover:underline text-sm transition-all cursor-pointer disabled:opacity-40"
            >
              Save Draft
            </button>
            <button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="primary-gradient px-10 py-3.5 rounded-lg text-white font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <span>Generate Proposal</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
