import { cn } from '../../lib/utils'

interface DayBar {
  day: string
  value: number  // 0–100 percentage
  highlight?: boolean
}

interface DayBarChartProps {
  title?: string
  bars?: DayBar[]
}

const DEFAULT_BARS: DayBar[] = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 88, highlight: true },
  { day: 'Thu', value: 58 },
  { day: 'Fri', value: 45 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 20 },
]

/**
 * Vertical bar chart showing acceptance rate by day of week.
 * Highlighted bar uses primary gradient; others use navy at reduced opacity.
 */
export default function DayBarChart({
  title = 'Acceptance Rate by Day',
  bars = DEFAULT_BARS,
}: DayBarChartProps) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-xl font-bold text-on-surface">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0a1b39] inline-block" />
          <span className="text-[10px] font-bold uppercase text-on-surface-variant">Benchmark</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-56 gap-2">
        {bars.map(({ day, value, highlight }) => (
          <div key={day} className="flex flex-col items-center gap-3 w-full">
            <div
              className={cn(
                'w-full rounded-t-sm transition-all duration-150 relative group cursor-pointer',
                highlight
                  ? 'primary-gradient hover:brightness-110 shadow-lg shadow-primary-container/20'
                  : 'bg-[#0a1b39] hover:opacity-100',
              )}
              style={{
                height: `${value}%`,
                opacity: highlight ? 1 : value > 50 ? 0.6 : 0.3,
              }}
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {value}%
              </div>
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                highlight ? 'text-primary font-bold' : 'text-on-surface-variant',
              )}
            >
              {day}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
