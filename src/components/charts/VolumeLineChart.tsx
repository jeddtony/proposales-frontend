interface LegendItem {
  color: string
  label: string
}

interface VolumeLineChartProps {
  title?: string
  legend?: LegendItem[]
  xLabels?: string[]
}

const DEFAULT_LEGEND: LegendItem[] = [
  { color: '#0a1b39', label: 'Sent' },
  { color: '#f5a623', label: 'Accepted' },
]

const DEFAULT_X_LABELS = ['Sep 01', 'Sep 05', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30']

/**
 * Full-width SVG line chart showing proposal volume over time.
 * Accepts configurable title, legend, and x-axis labels.
 */
export default function VolumeLineChart({
  title = 'Proposal Volume Over Time',
  legend = DEFAULT_LEGEND,
  xLabels = DEFAULT_X_LABELS,
}: VolumeLineChartProps) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h3 className="font-headline text-xl font-bold text-on-surface">{title}</h3>
        <div className="flex items-center gap-6">
          {legend.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: color }} />
              <span className="text-xs font-semibold text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          aria-label="Proposal volume over time"
          role="img"
        >
          <defs>
            <linearGradient id="navyGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0a1b39" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill under Sent line */}
          <path
            d="M0,150 L100,120 L200,140 L300,80 L400,110 L500,60 L600,90 L700,40 L800,70 L900,50 L1000,30 L1000,200 L0,200 Z"
            fill="url(#navyGradient)"
            opacity="0.05"
          />

          {/* Sent line — navy */}
          <path
            d="M0,150 L100,120 L200,140 L300,80 L400,110 L500,60 L600,90 L700,40 L800,70 L900,50 L1000,30"
            fill="none"
            stroke="#0a1b39"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Accepted line — amber */}
          <path
            d="M0,170 L100,150 L200,165 L300,130 L400,145 L500,110 L600,125 L700,95 L800,115 L900,105 L1000,85"
            fill="none"
            stroke="#f5a623"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-4 text-[10px] font-bold uppercase text-on-surface-variant/50 tracking-tighter">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
