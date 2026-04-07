import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Settings,
  Inbox,
  HelpCircle,
  LogOut,
  LucideIcon,
  Library,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { proposalsApi } from '../../api'

export interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  path: string
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, path: '/dashboard'  },
  { key: 'rfp-inbox',  label: 'RFP Inbox',  icon: Inbox,           path: '/inbox'      },
  { key: 'analytics',  label: 'Analytics',  icon: BarChart2,       path: '/analytics'  },
  { key: 'content',    label: 'Content',    icon: Library,         path: '/content'    },
  { key: 'clients',    label: 'Clients',    icon: Users,           path: '/clients'    },
  { key: 'settings',   label: 'Settings',   icon: Settings,        path: '/settings'   },
]

interface SideNavProps {
  navItems?: NavItem[]
  isMobileOpen?: boolean
  onMobileClose?: () => void
  onSupport?: () => void
  onSignOut?: () => void
}

function Tooltip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
        'hidden lg:flex items-center',
        'px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#162d5e] shadow-lg',
        'opacity-0 translate-x-[-4px] transition-all duration-150',
        'group-hover:opacity-100 group-hover:translate-x-0',
        'whitespace-nowrap',
      )}
    >
      {label}
    </span>
  )
}

export default function SideNav({
  navItems = DEFAULT_NAV_ITEMS,
  isMobileOpen = false,
  onMobileClose,
  onSupport,
}: SideNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await proposalsApi.logout()
    } finally {
      navigate('/login')
    }
  }

  return (
    <nav
      className={cn(
        // Base
        'fixed left-0 top-0 h-full bg-[#0a1b39] flex flex-col py-8',
        'shadow-[0_20px_50px_-12px_rgba(15,31,61,0.08)] z-50',
        // Mobile: slide in; desktop: always visible
        'transition-transform duration-300 ease-in-out',
        // Width: full on mobile/tablet, icon-only on lg+
        'w-64 lg:w-16',
        '-translate-x-full md:translate-x-0',
        isMobileOpen && 'translate-x-0',
      )}
    >
      {/* Logo — full on mobile/tablet, single glyph on lg */}
      <div className="px-4 mb-10 flex items-center gap-2 lg:justify-center">
        <span className="text-[#f5a623] font-bold font-headline text-2xl">P</span>
        <div className="lg:hidden">
          <h1 className="text-xl font-bold text-white tracking-tight font-headline leading-none">ProposalIQ</h1>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest mt-0.5">The Digital Concierge</p>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map(({ key, label, icon: Icon, path }) => {
          const isActive = pathname === path || (path.length > 1 && pathname.startsWith(path))
          return (
            <div key={key} className="relative group">
              <Link
                to={path}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 py-3 transition-all duration-200 cursor-pointer',
                  // On lg: center the icon; on smaller: normal padding
                  'px-6 lg:px-0 lg:justify-center',
                  isActive
                    ? 'bg-[#f5a623] text-[#0a1b39] font-semibold lg:rounded-none rounded-r-full mr-4 lg:mr-0'
                    : 'text-slate-400 hover:text-white hover:bg-white/10',
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-label text-xs uppercase tracking-widest lg:hidden">{label}</span>
              </Link>
              <Tooltip label={label} />
            </div>
          )
        })}
      </div>

      {/* Bottom: support + sign out */}
      <div className="mt-auto px-2 lg:px-2">
        <div className="border-t border-white/10 pt-3 flex flex-col gap-1">
          {/* Support */}
          <div className="relative group">
            <button
              onClick={onSupport}
              className="w-full flex items-center gap-3 px-4 py-2 lg:px-0 lg:justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm lg:hidden">Support</span>
            </button>
            <Tooltip label="Support" />
          </div>

          {/* Sign Out */}
          <div className="relative group">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 lg:px-0 lg:justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="text-sm lg:hidden">Sign Out</span>
            </button>
            <Tooltip label="Sign Out" />
          </div>
        </div>
      </div>
    </nav>
  )
}
