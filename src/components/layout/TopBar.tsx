import { Calendar, ChevronDown, Bell, HelpCircle, Menu } from 'lucide-react'
import { useMobileNav } from '../../context/MobileNavContext'

interface TopBarProps {
  title: string
  dateRange?: string
  onDateRangeClick?: () => void
  onNotificationsClick?: () => void
  onHelpClick?: () => void
}

export default function TopBar({
  title,
  dateRange = 'Last 30 days',
  onDateRangeClick,
  onNotificationsClick,
  onHelpClick,
}: TopBarProps) {
  const { toggle } = useMobileNav()

  return (
    <header className="w-full h-14 md:h-16 sticky top-0 z-10 bg-[#f7f9fc] flex items-center justify-between px-4 md:px-12 border-b border-surface-container gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={toggle}
        aria-label="Open navigation"
        className="md:hidden p-2 -ml-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-headline text-lg md:text-2xl font-bold tracking-tight text-on-background flex-1 md:flex-none truncate">
        {title}
      </h1>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Date range — label hidden on small screens */}
        <button
          onClick={onDateRangeClick}
          className="flex items-center gap-2 bg-surface-container-low px-2 md:px-4 py-2 rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors duration-150"
        >
          <Calendar className="w-4 h-4 text-on-surface-variant shrink-0" />
          <span className="hidden sm:inline text-sm font-medium text-on-surface">{dateRange}</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </button>

        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={onNotificationsClick}
            className="text-on-surface-variant hover:text-[#f5a623] transition-colors cursor-pointer p-1"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onHelpClick}
            className="text-on-surface-variant hover:text-[#f5a623] transition-colors cursor-pointer p-1 hidden sm:block"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
