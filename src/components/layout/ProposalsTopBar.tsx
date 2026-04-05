import { Search, Bell, History, Menu } from 'lucide-react'
import { useMobileNav } from '../../context/MobileNavContext'

interface ProposalsTopBarProps {
  onSearch?: (query: string) => void
  activeTab?: 'drafts' | 'pending' | 'approved'
  onTabChange?: (tab: 'drafts' | 'pending' | 'approved') => void
  onNotifications?: () => void
  onHistory?: () => void
  avatarUrl?: string
  avatarAlt?: string
}

const TABS = [
  { key: 'drafts',   label: 'Drafts'   },
  { key: 'pending',  label: 'Pending'  },
  { key: 'approved', label: 'Approved' },
] as const

export default function ProposalsTopBar({
  onSearch,
  activeTab,
  onTabChange,
  onNotifications,
  onHistory,
  avatarUrl,
  avatarAlt = 'User avatar',
}: ProposalsTopBarProps) {
  const { toggle } = useMobileNav()

  return (
    <header className="bg-[#f7f9fc] w-full border-b border-surface-container px-4 md:px-12 sticky top-0 z-10">
      {/* Main row: hamburger + search + actions */}
      <div className="flex items-center gap-3 h-14 md:h-16">
        {/* Mobile hamburger */}
        <button
          onClick={toggle}
          aria-label="Open navigation"
          className="md:hidden p-2 -ml-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search proposals..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
        </div>

        {/* Desktop tab nav — shown inline on md+ */}
        <nav className="hidden md:flex gap-1 ml-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onTabChange?.(key)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === key
                  ? 'text-[#0a1b39] bg-[#f2f4f7] font-semibold'
                  : 'text-secondary hover:text-[#0a1b39] hover:bg-[#f2f4f7]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={onNotifications}
            aria-label="Notifications"
            className="p-2 text-secondary hover:bg-surface-container transition-colors rounded-full cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onHistory}
            aria-label="History"
            className="hidden sm:block p-2 text-secondary hover:bg-surface-container transition-colors rounded-full cursor-pointer"
          >
            <History className="w-5 h-5" />
          </button>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={avatarAlt}
              className="w-9 h-9 rounded-full border-2 border-primary-container object-cover cursor-pointer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full border-2 border-primary-container bg-surface-container-highest flex items-center justify-center cursor-pointer shrink-0">
              <span className="text-xs font-bold text-on-surface-variant">JA</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile tab nav — scrollable row below main bar */}
      <nav className="md:hidden flex gap-1 pb-2 overflow-x-auto scrollbar-none">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange?.(key)}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeTab === key
                ? 'text-[#0a1b39] bg-[#f2f4f7] font-semibold'
                : 'text-secondary hover:text-[#0a1b39] hover:bg-[#f2f4f7]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
