import { Search, Menu } from 'lucide-react'
import { useMobileNav } from '../../context/MobileNavContext'

interface RfpTopBarProps {
  onSearch?: (query: string) => void
  totalCount?: number
}

export default function RfpTopBar({ onSearch, totalCount }: RfpTopBarProps) {
  const { toggle } = useMobileNav()

  return (
    <header className="bg-[#f7f9fc] w-full border-b border-surface-container px-4 md:px-12 sticky top-0 z-10">
      <div className="flex items-center gap-3 h-14 md:h-16">
        {/* Mobile hamburger */}
        <button
          onClick={toggle}
          aria-label="Open navigation"
          className="md:hidden p-2 -ml-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title + count */}
        <div className="hidden md:flex items-baseline gap-2 shrink-0">
          <h2 className="font-headline font-bold text-lg text-[#0a1b39]">RFP Inbox</h2>
          {totalCount !== undefined && (
            <span className="text-xs text-secondary font-label">{totalCount} requests</span>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:flex-none md:ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search by company or event..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
        </div>
      </div>
    </header>
  )
}
