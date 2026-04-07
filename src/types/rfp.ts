export type RfpStatus = 'ai-draft' | 'pending' | 'sent'

export type LifecycleStage = 'inquiry' | 'drafting' | 'approval' | 'closed'

export interface RfpContact {
  name: string
  title: string
  company: string
  email: string
  phone: string
  avatarInitials: string
}

export interface RfpItem {
  id: string
  company: string
  contactName: string
  eventType: string
  guests: number
  checkIn: string
  checkOut: string
  receivedAt: string
  status: RfpStatus
  stage: LifecycleStage
  inquiryText: string
  contact: RfpContact
  aiDraft: string
  revenue: string
  event_date?: string
  budget?: number
  proposal_uuid?: string
  proposal_generated_at?: string
}

export const DUMMY_RFPS: RfpItem[] = [
  {
    id: 'rfp-001',
    company: 'Meridian Capital Group',
    contactName: 'Sarah Chen',
    eventType: 'Corporate Retreat',
    guests: 120,
    checkIn: 'Mar 15, 2025',
    checkOut: 'Mar 18, 2025',
    receivedAt: '2 hours ago',
    status: 'ai-draft',
    stage: 'drafting',
    revenue: '$48,000',
    inquiryText:
      'We are looking to host our annual leadership retreat for approximately 120 executives. We require a minimum of 60 guest rooms, a large ballroom for plenary sessions (capacity 150), and 4 breakout rooms. The event will include a gala dinner on the second evening. We have a strong preference for sustainable catering options and would appreciate details on your wellness amenities. Please include pricing for AV support and a dedicated event coordinator.',
    contact: {
      name: 'Sarah Chen',
      title: 'VP Events & Hospitality',
      company: 'Meridian Capital Group',
      email: 'sarah.chen@meridiancap.com',
      phone: '+1 (415) 882-3300',
      avatarInitials: 'SC',
    },
    aiDraft:
      'Dear Sarah,\n\nThank you for considering The Grand Meridian for your leadership retreat. We are delighted to present our tailored proposal for Meridian Capital Group.\n\nWe can comfortably accommodate your group of 120 executives with our Executive Wing — 65 premium rooms and suites, all featuring high-speed connectivity and ergonomic workspaces. Our Grand Ballroom (capacity 180) paired with 5 dedicated breakout suites creates the ideal environment for focused sessions and collaboration.\n\nFor your gala dinner, our Executive Chef has curated a farm-to-table menu featuring locally sourced, seasonal ingredients — perfectly aligned with your sustainability values. Our full-service AV team and dedicated event coordinator will ensure flawless execution from setup to close.\n\nPackage investment: $48,000 (inclusive of rooms, F&B, AV, and coordination).\n\nWe look forward to hosting you. Shall we schedule a site visit?\n\nWarm regards,\n[Your Name]',
  },
  {
    id: 'rfp-002',
    company: 'TechNova Solutions',
    contactName: 'James Rivera',
    eventType: 'Product Launch',
    guests: 250,
    checkIn: 'Apr 3, 2025',
    checkOut: 'Apr 4, 2025',
    receivedAt: '5 hours ago',
    status: 'pending',
    stage: 'inquiry',
    revenue: '$32,500',
    inquiryText:
      'We are launching our flagship SaaS product and need a premium venue for a 1-night event for 250 attendees. We need a large cocktail reception space, a stage for keynote presentations, and high-quality AV with live streaming capabilities. The atmosphere should feel modern and tech-forward. Catering is primarily heavy appetizers and an open bar for 3 hours.',
    contact: {
      name: 'James Rivera',
      title: 'Head of Marketing',
      company: 'TechNova Solutions',
      email: 'j.rivera@technova.io',
      phone: '+1 (628) 445-7712',
      avatarInitials: 'JR',
    },
    aiDraft:
      'Dear James,\n\nThank you for reaching out regarding TechNova\'s upcoming product launch. We are excited by the opportunity to be part of this milestone event.\n\nOur Sky Terrace — a stunning glass-enclosed event space on the 22nd floor — seats 300 and offers panoramic city views that perfectly complement a tech-forward atmosphere. The integrated stage, LED backdrop wall, and built-in 4K streaming infrastructure are ready for your keynote. Our tech-support team can manage hybrid broadcast to your remote audience.\n\nFor the reception, our mixology team will craft a custom cocktail menu inspired by your brand palette, paired with elevated small plates from our culinary team.\n\nEstimated package: $32,500 including venue, AV, streaming setup, and F&B for 250 guests.\n\nBest regards,\n[Your Name]',
  },
  {
    id: 'rfp-003',
    company: 'Hartwell & Associates',
    contactName: 'Emily Park',
    eventType: 'Client Appreciation',
    guests: 80,
    checkIn: 'May 10, 2025',
    checkOut: 'May 10, 2025',
    receivedAt: '1 day ago',
    status: 'sent',
    stage: 'approval',
    revenue: '$18,200',
    inquiryText:
      'We host an annual client appreciation dinner for our top 80 clients — a refined, intimate evening. We need a private dining room or exclusive restaurant buyout, a 3-course plated dinner with wine pairings, and a brief award presentation. The tone should be elegant and understated. We are open to creative centerpiece suggestions.',
    contact: {
      name: 'Emily Park',
      title: 'Director of Client Relations',
      company: 'Hartwell & Associates',
      email: 'epark@hartwell.com',
      phone: '+1 (312) 990-4421',
      avatarInitials: 'EP',
    },
    aiDraft:
      'Dear Emily,\n\nThank you for entrusting us with Hartwell\'s annual client appreciation dinner. This is exactly the type of refined, intimate evening our team excels at curating.\n\nOur private Salon Privé accommodates up to 90 guests in an elegant setting with warm lighting, bespoke floral arrangements, and a dedicated service team. Our Sommelier has prepared a curated wine pairing program to complement each course of our 3-course Prestige Menu.\n\nFor the award presentation, we will arrange a discreet podium and sound system to ensure smooth flow without disrupting the intimate atmosphere.\n\nInvestment: $18,200 inclusive of exclusive venue hire, full F&B with wine pairings, floral, and AV.\n\nWarm regards,\n[Your Name]',
  },
  {
    id: 'rfp-004',
    company: 'Oakridge University',
    contactName: 'Dr. Marcus Webb',
    eventType: 'Academic Conference',
    guests: 400,
    checkIn: 'Jun 5, 2025',
    checkOut: 'Jun 7, 2025',
    receivedAt: '2 days ago',
    status: 'pending',
    stage: 'inquiry',
    revenue: '$75,000',
    inquiryText:
      'We are organizing a 3-day international academic conference on sustainable urban development. Approximately 400 delegates from 30+ countries will attend. We require a large auditorium (500 capacity), 6 seminar rooms, poster session space, and catered coffee breaks and lunches daily. We have a fixed academic budget and would appreciate tiered pricing options.',
    contact: {
      name: 'Dr. Marcus Webb',
      title: 'Conference Chair',
      company: 'Oakridge University',
      email: 'm.webb@oakridge.edu',
      phone: '+44 20 7946 0321',
      avatarInitials: 'MW',
    },
    aiDraft:
      'Dear Dr. Webb,\n\nThank you for considering our venue for your international conference on sustainable urban development. We are well-equipped to host your 400 delegates across a 3-day program.\n\nOur Conference Center offers a 520-seat auditorium, 7 seminar rooms, and a dedicated poster hall — all on one level for seamless delegate flow. Our catering team can provide daily coffee service and working lunches with sustainable, locally sourced menus, supporting the ethos of your conference theme.\n\nWe offer tiered academic pricing: Standard Package at $65,000, Premium at $75,000 (includes enhanced AV, dedicated tech support, and branded signage).\n\nWe would welcome a planning call at your earliest convenience.\n\nBest regards,\n[Your Name]',
  },
]
