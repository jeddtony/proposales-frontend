import type { ProposalData } from '../../types/proposal'

const CDN = 'https://cdn.proposales.com'

function daysUntil(tsMs: number): number {
  return Math.ceil((tsMs - Date.now()) / 86_400_000)
}

interface ProposalHeroProps {
  proposal: ProposalData
}

export default function ProposalHero({ proposal }: ProposalHeroProps) {
  const FALLBACK_BG = 'b17a783f-eb08-4515-a4f8-a7d692bb416e'
  const bgUuid = proposal.background_image?.uuid ?? FALLBACK_BG
  const bgUrl = `${CDN}/${bgUuid}/-/preview/2880x3000/-/quality/lighter/-/progressive/yes/`

  const subtitle = proposal.recipient_company_name ?? proposal.company_name

  const expiresIn = proposal.expires_at ? daysUntil(proposal.expires_at) : null

  return (
    <section className="relative overflow-hidden min-h-[35vw] max-h-[55vh] flex items-center justify-center bg-[#16161a]">
      {/* Background image */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay + bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(22,22,26,0.5) 0%, rgba(22,22,26,0.4) 60%, #16161a 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-[15%] py-[6vh] xl:py-[10vh] flex flex-col items-center gap-4">
        <h1 className="font-headline text-3xl lg:text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-tight max-w-4xl">
          {proposal.title}
        </h1>

        {subtitle && (
          <h2 className="text-lg xl:text-2xl text-white/90 tracking-[-0.01rem] font-normal">
            {subtitle}
          </h2>
        )}

        {expiresIn !== null && expiresIn > 0 && (
          <span className="inline-block text-xs font-normal rounded-full py-[0.35em] px-[1em] text-[#16161a] bg-white">
            Expires in {expiresIn} {expiresIn === 1 ? 'day' : 'days'}
          </span>
        )}

        {proposal.status === 'draft' && (
          <span className="inline-block text-xs font-semibold rounded-full py-1 px-3 bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Draft Preview
          </span>
        )}
      </div>
    </section>
  )
}
