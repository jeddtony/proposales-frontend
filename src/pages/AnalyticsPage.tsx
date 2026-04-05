import { Gauge, ShieldCheck, History } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import AIInsightBanner from '../components/ui/AIInsightBanner'
import MetricCard from '../components/ui/MetricCard'
import WorkspaceStats from '../components/ui/WorkspaceStats'
import ConversionFunnel from '../components/charts/ConversionFunnel'
import DayBarChart from '../components/charts/DayBarChart'
import VolumeLineChart from '../components/charts/VolumeLineChart'

const METRICS = [
  {
    label: 'Total Proposals Sent',
    value: '842',
    trend: '3%',
    trendUp: false,
    isPositive: false,
  },
  {
    label: 'Acceptance Rate',
    value: '68.4%',
    trend: '12%',
    trendUp: true,
    isPositive: true,
  },
  {
    label: 'Avg. Response Time',
    value: '4.2h',
    trend: '18%',
    trendUp: false,
    isPositive: true, // lower is better
  },
  {
    label: 'Revenue Attributed',
    value: '$1.2M',
    trend: '24%',
    trendUp: true,
    isPositive: true,
  },
]

const WORKSPACE_STATS = [
  { icon: Gauge, label: 'System Load', value: 'Optimal (0.4s lat)' },
  { icon: ShieldCheck, label: 'Compliance', value: 'GDPR Certified' },
  { icon: History, label: 'Data Freshness', value: 'Real-time sync active' },
]

export default function AnalyticsPage() {
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </section>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ConversionFunnel />
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
