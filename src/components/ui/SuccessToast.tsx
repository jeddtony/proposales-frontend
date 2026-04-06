import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

interface SuccessToastProps {
  show: boolean
  title?: string
  subtitle?: string
  duration?: number
  onClose: () => void
}

export default function SuccessToast({
  show,
  title = 'Done',
  subtitle,
  duration = 4000,
  onClose,
}: SuccessToastProps) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (show) {
      setProgress(100)
      // Tiny delay so the translate transition fires (element must be in DOM first)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))

      startRef.current = performance.now()

      const tick = (now: number) => {
        const elapsed = now - startRef.current
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        setProgress(remaining)
        if (remaining > 0) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)

      timerRef.current = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300) // wait for exit transition
      }, duration)
    } else {
      setVisible(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [show, duration, onClose])

  if (!show && !visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-[60] w-80 overflow-hidden rounded-xl shadow-2xl"
      style={{
        backgroundColor: '#0a1b39',
        transform: visible ? 'translateX(0) translateY(0)' : 'translateX(24px) translateY(-12px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkmark */}
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#f5a623' }}
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-white font-semibold text-sm leading-snug">{title}</p>
          {subtitle && (
            <p className="text-slate-300 text-xs mt-0.5 leading-snug truncate">{subtitle}</p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
          aria-label="Dismiss"
          className="shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-white/10">
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: '#f5a623',
            transition: 'width 16ms linear',
          }}
        />
      </div>
    </div>
  )
}
