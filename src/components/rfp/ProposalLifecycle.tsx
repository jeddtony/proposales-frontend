import { cn } from '../../lib/utils'
import type { LifecycleStage } from '../../types/rfp'

const STAGES: { key: LifecycleStage; label: string }[] = [
  { key: 'inquiry',  label: 'Inquiry'  },
  { key: 'drafting', label: 'Drafting' },
  { key: 'approval', label: 'Approval' },
  { key: 'closed',   label: 'Closed'   },
]

interface ProposalLifecycleProps {
  currentStage: LifecycleStage
}

export default function ProposalLifecycle({ currentStage }: ProposalLifecycleProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  return (
    <div className="flex items-center gap-0">
      {STAGES.map(({ key, label }, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex

        return (
          <div key={key} className="flex items-center flex-1 last:flex-none">
            {/* Step dot + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  'w-3 h-3 rounded-full border-2 transition-colors duration-200',
                  isDone  && 'bg-primary border-primary',
                  isActive && 'bg-primary-container border-primary',
                  !isDone && !isActive && 'bg-surface-container border-outline-variant',
                )}
              />
              <span
                className={cn(
                  'text-[10px] uppercase tracking-widest font-label whitespace-nowrap',
                  isActive ? 'text-primary font-semibold' : 'text-secondary',
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line — skip after last item */}
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-2 mb-4 transition-colors duration-200',
                  i < currentIndex ? 'bg-primary' : 'bg-outline-variant/40',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
