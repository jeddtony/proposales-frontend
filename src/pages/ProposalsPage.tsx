import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import ProposalsTopBar from '../components/layout/ProposalsTopBar'
import WelcomeHeroCard from '../components/ui/WelcomeHeroCard'
import NewProposalModal from '../components/ui/NewProposalModal'

type Tab = 'drafts' | 'pending' | 'approved'

/**
 * Proposals Hub page — bento grid hero + AI insight card + New Proposal modal.
 * Uses ProposalsTopBar (search + tab nav) instead of the analytics TopBar.
 */
export default function ProposalsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('drafts')

  return (
    <>
      <ProposalsTopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <section className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-12">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-2 block">
            Executive Suite
          </span>
          <h2 className="font-headline text-2xl md:text-4xl font-extrabold text-[#0a1b39] tracking-tight">
            Proposals Hub
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Welcome hero card — col-span-8 */}
          <WelcomeHeroCard onCta={() => setModalOpen(true)} />

          {/* AI Insight card — col-span-4 */}
          <div className="col-span-12 md:col-span-4 bg-primary-container/10 p-6 md:p-8 rounded-xl border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-label text-xs uppercase tracking-widest font-bold">AI Insight</span>
            </div>
            <p className="text-on-primary-container font-medium text-lg leading-snug">
              Average conversion rate for group bookings is up{' '}
              <span className="font-mono text-primary">12.4%</span> this month.
            </p>
            <div className="mt-6 pt-6 border-t border-primary/10">
              <p className="text-xs text-secondary italic">
                "Try adding the 'Wellness Suite' package to increase upsell potential."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Proposal modal */}
      <NewProposalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveDraft={(data) => {
          console.log('Draft saved:', data)
          setModalOpen(false)
        }}
        onGenerate={(data, response) => {
          console.log('Proposal request created:', response, data)
        }}
      />
    </>
  )
}
