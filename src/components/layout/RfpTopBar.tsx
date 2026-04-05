import { useState } from 'react'
import { Search, SlidersHorizontal, Menu } from 'lucide-react'
import { useMobileNav } from '../../context/MobileNavContext'
import { cn } from '../../lib/utils'
import type { RfpStatus } from '../../types/rfp'

type FilterValue = 'all' | RfpStatus

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all',       label: 'All'        },
  { value: 'ai-draft',  label: 'AI Draft'   },
  { value: 'pending',   label: 'Pending'    },
  { value: 'sent',      label: 'Sent'       },
]

interface RfpTopBarProps {
  onSearch?: (query: string) => void
  activeFilter?: FilterValue
  onFilterChange?: (filter: FilterValue) => void
  totalCount?: number
}

export default function RfpTopBar({
  onSearch,
  activeFilter = 'all',
  onFilterChange,
  totalCount,
}: RfpTopBarProps) {
  const { toggle } = useMobileNav()
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  return (
    <header className="bg-[#f7f9fc] w-full border-b border-surface-container px-4 md:px-12 sticky top-0 z-10">
      {/* Main row */}
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

        {/* Desktop filter pills */}
        <nav className="hidden md:flex gap-1 ml-2">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange?.(value)}
              className={cn(
                'text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer',
                activeFilter === value
                  ? 'text-[#0a1b39] bg-[#f2f4f7] font-semibold'
                  : 'text-secondary hover:text-[#0a1b39] hover:bg-[#f2f4f7]',
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile filter button */}
        <div className="relative ml-auto md:hidden">
          <button
            onClick={() => setShowFilterMenu((v) => !v)}
            aria-label="Filter"
            className="p-2 text-secondary hover:bg-surface-container transition-colors rounded-full cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-1 min-w-[140px] z-20">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { onFilterChange?.(value); setShowFilterMenu(false) }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer',
                    activeFilter === value
                      ? 'text-primary font-semibold bg-surface-container-low'
                      : 'text-on-surface hover:bg-surface-container-low',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
