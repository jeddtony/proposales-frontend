import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MetricCardProps {
  label: string
  value: string
  trend: string
  trendUp: boolean
  isPositive?: boolean
  className?: string
}

/**
 * KPI metric card — shows a label, large value, and trend badge.
 * isPositive controls color: true = amber (good), false = red (bad).
 * trendUp controls the arrow direction independently (e.g. lower response time is positive).
 */
export default function MetricCard({
  label,
  value,
  trend,
  trendUp,
  isPositive = true,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default',
        className,
      )}
    >
      <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
        {label}
      </p>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold font-headline text-on-surface">{value}</span>
        <span
          className={cn(
            'text-sm font-medium flex items-center gap-0.5',
            isPositive ? 'text-primary' : 'text-error',
          )}
        >
          {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trend}
        </span>
      </div>
    </div>
  )
}
