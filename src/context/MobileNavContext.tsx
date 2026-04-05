import { createContext, useContext, useState } from 'react'

interface MobileNavContextValue {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const MobileNavContext = createContext<MobileNavContextValue>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <MobileNavContext.Provider value={{
      isOpen,
      toggle: () => setIsOpen((p) => !p),
      close: () => setIsOpen(false),
    }}>
      {children}
    </MobileNavContext.Provider>
  )
}

export const useMobileNav = () => useContext(MobileNavContext)
