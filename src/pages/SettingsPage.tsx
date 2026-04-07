import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Save, Bot } from 'lucide-react'
import { proposalsApi, ApiError } from '../api'
import type { AppSettings } from '../api/proposals'
import SuccessToast from '../components/ui/SuccessToast'

const LLM_PROVIDERS = [
  {
    id: 'claude',
    label: 'Claude',
    vendor: 'Anthropic',
    description: 'Anthropic\'s Claude — strong reasoning, nuanced writing, and long-context understanding.',
  },
  {
    id: 'openai',
    label: 'GPT-4o',
    vendor: 'OpenAI',
    description: 'OpenAI\'s flagship model — fast, versatile, and widely adopted.',
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await proposalsApi.getSettings()
        setSettings(res.data)
        setSelected(res.data.llm_provider)
      } catch (err) {
        setError(
          err instanceof ApiError
            ? `Failed to load settings (${err.status})`
            : 'Could not load settings.',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave() {
    if (!selected || selected === settings?.llm_provider) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await proposalsApi.updateSettings({ llm_provider: selected })
      setSettings(res.data)
      setToast(true)
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? `Failed to save (${err.status}): ${err.message}`
          : 'Could not save settings. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  const isDirty = selected !== settings?.llm_provider

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-3 text-center p-8">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-sm text-on-surface-variant">{error}</p>
      </div>
    )
  }

  return (
    <><div className="p-6 md:p-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold text-[#0a1b39]">Settings</h1>
        <p className="text-sm text-secondary mt-1">Manage your platform configuration.</p>
      </div>

      {/* AI Provider card */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/15 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0a1b39]">AI Provider</p>
            <p className="text-xs text-secondary">The language model used to generate proposals and power the chat assistant.</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {LLM_PROVIDERS.map((provider) => {
            const isSelected = selected === provider.id
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => setSelected(provider.id)}
                className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/4'
                    : 'border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0a1b39]">{provider.label}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                        {provider.vendor}
                      </span>
                    </div>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">{provider.description}</p>
                  </div>
                  {/* Radio indicator */}
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-primary' : 'border-outline-variant'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/15 flex items-center justify-between gap-4">
          <div className="text-xs text-secondary">
            {settings && (
              <span>Last updated {formatDate(settings.updated_at)}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {saveError && (
              <span className="text-xs text-error">{saveError}</span>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>

    <SuccessToast
      show={toast}
      title="Settings Saved"
      subtitle="Your AI provider preference has been updated."
      onClose={() => setToast(false)}
    /></>
  )
}
