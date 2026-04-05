import { Info } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FunnelStage {
  label: string
  percentage: number
  count: string
  highlight?: boolean
}

interface FunnelFooterStat {
  label: string
  value: string
}

interface ConversionFunnelProps {
  stages?: FunnelStage[]
  footerStats?: FunnelFooterStat[]
}

const DEFAULT_STAGES: FunnelStage[] = [
  { label: 'Sent', percentage: 100, count: '842 Proposals' },
  { label: 'Viewed', percentage: 82, count: '690 Views' },
  { label: 'Accepted', percentage: 68, count: '572 Wins', highlight: true },
]

const DEFAULT_FOOTER: FunnelFooterStat[] = [
  { label: 'Rejected', value: '12% (101)' },
  { label: 'Expired', value: '8% (67)' },
  { label: 'Pending', value: '12% (102)' },
]

/**
 * Horizontal bar funnel chart for proposal conversion pipeline.
 */
export default function ConversionFunnel({
  stages = DEFAULT_STAGES,
  footerStats = DEFAULT_FOOTER,
}: ConversionFunnelProps) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-xl font-bold text-on-surface">Conversion Funnel</h3>
        <Info className="w-5 h-5 text-on-surface-variant cursor-pointer" />
      </div>

      <div className="space-y-6">
        {stages.map(({ label, percentage, count, highlight }) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-on-surface">
              <span className={cn(highlight && 'text-primary font-bold')}>{label}</span>
              <span className={cn(highlight && 'text-primary font-bold')}>{percentage}%</span>
            </div>
            <div
              className={cn(
                'h-10 rounded-sm flex items-center px-4',
                highlight ? 'primary-gradient' : 'bg-[#0a1b39]',
              )}
              style={{ width: `${percentage}%`, opacity: highlight ? 1 : 0.6 + (percentage / 500) }}
            >
              <span className="text-white text-xs font-mono">{count}</span>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-surface-container">
          {footerStats.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">
                {label}
              </span>
              <span className="font-mono text-sm text-on-surface">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
