import { useEffect, useState } from 'react'
import { Gauge, ShieldCheck, History, Loader2, AlertCircle } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import AIInsightBanner from '../components/ui/AIInsightBanner'
import WorkspaceStats from '../components/ui/WorkspaceStats'
import ConversionFunnel from '../components/charts/ConversionFunnel'
import DayBarChart from '../components/charts/DayBarChart'
import VolumeLineChart from '../components/charts/VolumeLineChart'
import { proposalsApi, ApiError } from '../api'
import type { DashboardStats, ProposalStat } from '../api/proposals'

function toFunnelStages(proposalStats: ProposalStat[]) {
  return proposalStats.map((s) => ({
    label: s.label,
    percentage: s.percentage,
    count: s.count,
    highlight: s.highlight,
  }))
}

const WORKSPACE_STATS = [
  { icon: Gauge, label: 'System Load', value: 'Optimal (0.4s lat)' },
  { icon: ShieldCheck, label: 'Compliance', value: 'GDPR Certified' },
  { icon: History, label: 'Data Freshness', value: 'Real-time sync active' },
]

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    proposalsApi
      .getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? `Failed to load stats (${err.status})`
            : 'Could not load dashboard stats.',
        )
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <TopBar title="Proposal Analytics" />

      <div className="p-4 sm:p-8 md:p-12 space-y-8 md:space-y-10">
        <AIInsightBanner
          headline="Proposals sent Monday–Wednesday convert 34% better."
          highlight="Proposals including a dinner package have a 2x higher acceptance rate."
          meta="Generated from 142 proposals · Updated today."
        />

        {/* KPI metrics */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 text-center">
            <AlertCircle className="w-7 h-7 text-error" />
            <p className="text-sm text-on-surface-variant">{error}</p>
          </div>
        ) : stats ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Total RFPs
                </p>
                <span className="text-3xl font-bold font-headline text-on-surface">
                  {stats.total_rfps.toLocaleString()}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Total Clients
                </p>
                <span className="text-3xl font-bold font-headline text-on-surface">
                  {stats.total_clients.toLocaleString()}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <p className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  RFPs Last 7 Days
                </p>
                <span className="text-3xl font-bold font-headline text-on-surface">
                  {stats.rfps_last_7_days.toLocaleString()}
                </span>
              </div>
            </section>

          </>
        ) : null}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ConversionFunnel
            stages={stats && stats.proposal_stats.length > 0 ? toFunnelStages(stats.proposal_stats) : undefined}
            footerStats={[]}
          />
          <DayBarChart />
        </div>

        {/* Full-width line chart */}
        <VolumeLineChart />
      </div>

      {/* Footer workspace stats */}
      <footer className="px-4 sm:px-8 md:px-12 pb-8 md:pb-12">
        <WorkspaceStats stats={WORKSPACE_STATS} />
      </footer>
    </>
  )
}
