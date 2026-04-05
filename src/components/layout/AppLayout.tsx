import { MobileNavProvider, useMobileNav } from '../../context/MobileNavContext'
import SideNav from './SideNav'

function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useMobileNav()

  return (
    <div className="bg-background font-body text-on-background min-h-screen selection:bg-primary-fixed">
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0a1b39]/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <SideNav isMobileOpen={isOpen} onMobileClose={close} />

      <main className="md:ml-64 lg:ml-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <Layout>{children}</Layout>
    </MobileNavProvider>
  )
}
