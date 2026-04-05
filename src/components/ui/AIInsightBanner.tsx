import { Sparkles } from 'lucide-react'

interface AIInsightBannerProps {
  headline: string
  highlight?: string
  meta?: string
}

/**
 * AI-generated insight banner — glass card with left amber border and sparkle icon.
 */
export default function AIInsightBanner({
  headline,
  highlight,
  meta,
}: AIInsightBannerProps) {
  return (
    <section className="relative overflow-hidden glass-card rounded-xl p-6 flex items-start gap-5 border-l-4 border-primary">
      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-1">
        <p className="font-headline text-lg font-semibold text-on-surface leading-snug">
          {headline}{' '}
          {highlight && (
            <span className="text-on-primary-container">{highlight}</span>
          )}
        </p>
        {meta && (
          <p className="text-sm text-on-surface-variant/70">{meta}</p>
        )}
      </div>

      {/* Decorative background icon */}
      <div className="absolute -right-8 -top-8 opacity-5 pointer-events-none">
        <Sparkles className="w-32 h-32" />
      </div>
    </section>
  )
}
