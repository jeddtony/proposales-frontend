import { LucideIcon } from 'lucide-react'

interface StatItem {
  icon: LucideIcon
  label: string
  value: string
}

interface WorkspaceStatsProps {
  stats: StatItem[]
}

/**
 * Footer workspace status bar — grid of stat tiles with icon, label, and value.
 */
export default function WorkspaceStats({ stats }: WorkspaceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
          <div className="p-2 bg-surface-container-highest rounded-lg">
            <Icon className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">
              {label}
            </p>
            <p className="text-sm font-semibold text-on-surface">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
