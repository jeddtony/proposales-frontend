import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Send, Loader2, AlertCircle, Bot, User, FileText } from 'lucide-react'
import { proposalsApi, ApiError } from '../../api'
import type { ChatMessage } from '../../api'
import ProposalPreviewModal from '../proposal/ProposalPreviewModal'

interface RfpChatPanelProps {
  proposalRequestId: number
}

export default function RfpChatPanel({ proposalRequestId }: RfpChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load or initialize chat on mount
  useEffect(() => {
    let cancelled = false

    async function loadChat() {
      setLoading(true)
      setError(null)
      try {
        // Try fetching existing history first
        const history = await proposalsApi.getChatHistory(proposalRequestId)
        if (cancelled) return

        if (history.data.length > 0) {
          setMessages(history.data)
        } else {
          // No history — initialize
          const init = await proposalsApi.initializeChat(proposalRequestId)
          if (cancelled) return
          setMessages([init.data])
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof ApiError
            ? `Failed to load chat (${err.status})`
            : 'Could not load the chat.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadChat()
    return () => { cancelled = true }
  }, [proposalRequestId])

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // Auto-resize textarea
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    // Optimistically append user message
    const optimistic: ChatMessage = {
      id: Date.now(),
      proposal_request_id: proposalRequestId,
      role: 'user',
      message: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setSending(true)
    setError(null)

    try {
      const res = await proposalsApi.sendChatMessage(proposalRequestId, text)
      setMessages((prev) => [...prev, res.data])
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Send failed (${err.status}): ${err.message}`
          : 'Message could not be sent. Please try again.',
      )
      // Roll back optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-3 text-secondary">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Preparing your AI concierge…</span>
      </div>
    )
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-3 text-center">
        <AlertCircle className="w-7 h-7 text-error" />
        <p className="text-sm text-on-surface-variant">{error}</p>
      </div>
    )
  }

  return (
    <>
    <div className="flex flex-col h-full min-h-0">

      {/* Toolbar */}
      <div className="shrink-0 flex justify-end pb-3 border-b border-outline-variant/15 mb-1">
        <button
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary-container/10 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          Preview Proposal
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4">
        {messages.map((msg) =>
          msg.role === 'assistant' ? (
            <AssistantBubble key={msg.id} message={msg.message} />
          ) : (
            <UserBubble key={msg.id} message={msg.message} />
          ),
        )}

        {/* Typing indicator while waiting for reply */}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full primary-gradient flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-error text-center py-1">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 pt-4 border-t border-outline-variant/20">
        <div className="flex items-end gap-3 bg-surface-container-low rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question… (Enter to send)"
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-secondary resize-none focus:outline-none leading-relaxed"
            style={{ maxHeight: '140px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-secondary text-center mt-2">
          Shift + Enter for new line · Enter to send
        </p>
      </div>

    </div>

    {/* Proposal preview slide-over */}
    {previewOpen && (
      <ProposalPreviewModal
        proposalRequestId={proposalRequestId}
        onClose={() => setPreviewOpen(false)}
      />
    )}
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function AssistantBubble({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full primary-gradient flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="prose prose-sm max-w-none text-on-surface
          prose-headings:font-headline prose-headings:text-[#0a1b39] prose-headings:font-bold
          prose-h2:text-base prose-h3:text-sm
          prose-strong:text-on-surface prose-strong:font-semibold
          prose-p:text-sm prose-p:leading-relaxed prose-p:text-on-surface-variant
          prose-li:text-sm prose-li:text-on-surface-variant
          prose-hr:border-outline-variant/30
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 flex-row-reverse">
      <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
        <User className="w-3.5 h-3.5 text-on-surface-variant" />
      </div>
      <div className="max-w-[80%] bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  )
}
