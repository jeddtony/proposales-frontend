import { PenSquare } from 'lucide-react'

interface WelcomeHeroCardProps {
  headline?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** Optional background image URL — rendered at low opacity as a decorative overlay */
  bgImageUrl?: string
  bgImageAlt?: string
}

/**
 * Large bento hero card for the Proposals hub.
 * CTA triggers the New Proposal modal. Decorative image fades in on hover.
 */
export default function WelcomeHeroCard({
  headline = 'Start a new request.',
  description = 'Prepare a bespoke experience for your hospitality clients. Our AI-driven engine suggests the best room blocks and catering options based on historical data.',
  ctaLabel = 'Create New Proposal',
  onCta,
  bgImageUrl,
  bgImageAlt = 'Luxury hotel lobby',
}: WelcomeHeroCardProps) {
  return (
    <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-6 md:p-10 rounded-xl relative overflow-hidden group cursor-default">
      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">{headline}</h3>
        <p className="text-secondary max-w-md mb-8 leading-relaxed text-sm">{description}</p>
        <button
          onClick={onCta}
          className="primary-gradient text-white px-8 py-4 rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(131,85,0,0.4)] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
        >
          <PenSquare className="w-5 h-5" />
          {ctaLabel}
        </button>
      </div>

      {/* Decorative background image */}
      {bgImageUrl && (
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
          <img src={bgImageUrl} alt={bgImageAlt} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
