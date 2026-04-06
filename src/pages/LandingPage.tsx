import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react'
import { proposalsApi, ApiError } from '../api'

// ── Local image imports ───────────────────────────────────────────────────────
import heroImg from '../../images/hero-hotel.png'
import ballroomImg from '../../images/ball-room.png'
import executiveImg from '../../images/executive-suite.png'
import gardenImg from '../../images/garden-terrace.png'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string
  company_name: string
  email: string
  phone_number: string
  details: string
}

const EMPTY_FORM: FormState = {
  name: '',
  company_name: '',
  email: '',
  phone_number: '',
  details: '',
}

// ── Spaces data ───────────────────────────────────────────────────────────────

const SPACES = [
  {
    name: 'The Ballroom',
    caption: 'Up to 800 Guests • Historic Grandeur',
    img: ballroomImg,
    alt: 'Grand ballroom set for a gala evening',
    offset: false,
  },
  {
    name: 'The Executive Suite',
    caption: 'Up to 40 Guests • Modern Precision',
    img: executiveImg,
    alt: 'Modern executive boardroom with city views',
    offset: true,
  },
  {
    name: 'The Garden Terrace',
    caption: 'Up to 300 Guests • Al Fresco Luxury',
    img: gardenImg,
    alt: 'Outdoor garden terrace with warm string lights',
    offset: false,
  },
]

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(254,249,241,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.15)' : 'none',
      }}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-[1440px] mx-auto">
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tighter font-headline transition-colors duration-300 cursor-pointer"
          style={{ color: scrolled ? '#0F1F3D' : '#F5F0E8' }}
        >
          The Grand Venue
        </a>

        <div className="hidden md:flex space-x-10 items-center">
          {['Spaces', 'Events', 'About'].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold transition-all duration-300 cursor-pointer"
              style={{ color: i === 0 ? '#C9A84C' : scrolled ? '#0F1F3D' : '#F5F0E8' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
              onMouseLeave={(e) => {
                if (i !== 0) (e.currentTarget as HTMLElement).style.color = scrolled ? '#0F1F3D' : '#F5F0E8'
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold px-4 py-2.5 rounded-lg border transition-all duration-300 cursor-pointer"
            style={{
              color: scrolled ? '#0F1F3D' : '#F5F0E8',
              borderColor: scrolled ? 'rgba(15,31,61,0.25)' : 'rgba(245,240,232,0.35)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C'; (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = scrolled ? '#0F1F3D' : '#F5F0E8'; (e.currentTarget as HTMLElement).style.borderColor = scrolled ? 'rgba(15,31,61,0.25)' : 'rgba(245,240,232,0.35)' }}
          >
            Login
          </button>
          <a
            href="#contact"
            className="bg-[#00071b] text-white px-5 py-2.5 rounded-lg font-label text-[11px] uppercase tracking-widest hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            Request a Proposal
          </a>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="spaces" className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="The Grand Venue — luxury hotel interior"
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(0,7,27,0.82) 0%, rgba(0,7,27,0.45) 55%, rgba(0,7,27,0.1) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        <div className="max-w-3xl">
          <span className="text-[#C9A84C] font-headline uppercase tracking-[0.35em] text-[11px] font-bold mb-6 block">
            Established 1924 · Grandeur Reimagined
          </span>
          <h1
            className="font-headline text-6xl md:text-8xl font-extrabold text-[#F5F0E8] leading-[0.9] tracking-tighter mb-8"
            style={{ textShadow: '0 0 40px rgba(245,240,232,0.15)' }}
          >
            The Art of <br />
            <span style={{ color: '#E6C364' }}>Exquisite</span> <br />
            Gatherings.
          </h1>
          <p className="font-body text-lg text-[#F5F0E8]/75 max-w-xl mb-12 leading-relaxed">
            Where architectural grandeur meets impeccable service. Elevate your milestones in the city's most distinguished event destinations.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#spaces-grid"
              className="bg-gradient-to-br from-[#00071b] to-[#0f1f3d] text-white px-8 py-4 rounded-lg font-semibold tracking-wide hover:brightness-125 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              Explore Our Spaces <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="border border-[#F5F0E8]/30 text-[#F5F0E8] px-8 py-4 rounded-lg font-semibold tracking-wide hover:bg-[#F5F0E8] hover:text-[#00071b] transition-all duration-300 cursor-pointer"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              View Gallery
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#F5F0E8]/40">
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  )
}

// ── Spaces Grid ───────────────────────────────────────────────────────────────

function SpacesSection() {
  return (
    <section id="spaces-grid" className="py-28 md:py-36" style={{ backgroundColor: '#fef9f1' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#C9A84C] font-headline uppercase tracking-[0.3em] text-[11px] font-bold mb-4 block">
              Our Curated Spaces
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-[#00071b]">
              Unrivaled Settings for Every Occasion
            </h2>
          </div>
          <p className="text-[#00071b]/55 max-w-sm font-body leading-relaxed text-sm md:text-base">
            From intimate boardroom discussions to gala celebrations for a thousand guests, our architectural canvas adapts to your vision.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPACES.map((space) => (
            <div
              key={space.name}
              className={`group relative bg-white overflow-hidden shadow-[0_20px_40px_rgba(15,31,61,0.07)] hover:-translate-y-2 transition-all duration-500 cursor-pointer ${space.offset ? 'md:mt-12' : ''}`}
              style={{ borderRadius: '2rem' }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={space.img}
                  alt={space.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="font-headline text-2xl font-bold mb-2 text-[#00071b]">{space.name}</h3>
                <p className="text-[#00071b]/55 font-body text-sm mb-6">{space.caption}</p>
                <span className="inline-flex items-center text-[#C9A84C] font-semibold tracking-wider text-xs uppercase gap-2 group-hover:gap-4 transition-all duration-300">
                  Explore Space <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── RFP Form ──────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await proposalsApi.createProposalRequest(form)
      setSubmitted(true)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Submission failed (${err.status}). Please try again.`
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full bg-[#0F1F3D] border-none rounded-xl text-[#F5F0E8] focus:ring-2 focus:ring-[#C9A84C]/50 py-4 px-6 placeholder-[#F5F0E8]/20 text-sm outline-none transition'
  const labelCls = 'block text-[10px] uppercase tracking-widest text-[#F5F0E8]/40 mb-1.5'

  return (
    <section id="contact" className="py-28 md:py-36 relative" style={{ backgroundColor: '#0f1f3d' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left copy */}
        <div>
          <span className="text-[#C9A84C] font-headline uppercase tracking-[0.3em] text-[11px] font-bold mb-6 block">
            Concierge Desk
          </span>
          <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-[#F5F0E8] leading-tight mb-8">
            Let Us Host Your <br />Next Masterpiece.
          </h2>
          <p className="text-[#F5F0E8]/55 text-lg mb-12 leading-relaxed max-w-md">
            Complete the proposal request and our dedicated event curators will respond within 24 hours to begin tailoring your experience.
          </p>
          <div className="flex items-center gap-4 text-[#F5F0E8]">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] mb-0.5">Direct Inquiries</p>
              <p className="font-bold text-lg">+1 (212) 555-GRAND</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div
          className="p-8 md:p-12 rounded-2xl shadow-2xl border border-[#C9A84C]/10"
          style={{ backgroundColor: '#00071b' }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <CheckCircle2 className="w-14 h-14 text-[#C9A84C]" />
              <h3 className="font-headline text-2xl font-bold text-[#F5F0E8]">Request Received</h3>
              <p className="text-[#F5F0E8]/60 text-sm max-w-xs">
                Our concierge team will be in touch within 24 hours to begin crafting your experience.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[#C9A84C] text-xs uppercase tracking-widest underline cursor-pointer hover:text-[#E6C364] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls} htmlFor="lp-name">Full Name *</label>
                  <input id="lp-name" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Alexander Hamilton" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="lp-company">Company</label>
                  <input id="lp-company" type="text" value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="Global Enterprises Inc." className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls} htmlFor="lp-email">Email *</label>
                  <input id="lp-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="alexander@global.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="lp-phone">Phone</label>
                  <input id="lp-phone" type="tel" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} placeholder="+1 212 555 0123" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="lp-details">Tell Us About Your Vision</label>
                <textarea
                  id="lp-details"
                  value={form.details}
                  onChange={(e) => set('details', e.target.value)}
                  placeholder="Event type, guest count, date range, special requirements…"
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.name.trim() || !form.email.trim()}
                className="w-full py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.99]"
                style={{ backgroundColor: '#C9A84C', color: '#0f1f3d' }}
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  'Submit Proposal Request'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Testimonial ───────────────────────────────────────────────────────────────

function TestimonialSection() {
  return (
    <section className="py-28 md:py-36 overflow-hidden" style={{ backgroundColor: '#fef9f1' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative">
        {/* Giant quote mark */}
        <span
          className="absolute -top-10 -left-2 text-[200px] leading-none select-none pointer-events-none font-headline font-extrabold"
          style={{ color: 'rgba(0,7,27,0.04)' }}
        >
          "
        </span>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="text-[#C9A84C] font-headline uppercase tracking-[0.3em] text-[11px] font-bold mb-6 block">
              Proven Excellence
            </span>
            <blockquote className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-[#00071b] leading-tight">
              "The Grand Venue is more than a space; it's a silent partner that ensures every detail of your event is perceived as perfection."
            </blockquote>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C] shrink-0 bg-[#C9A84C]/10 flex items-center justify-center">
              <span className="font-headline font-bold text-[#C9A84C] text-lg">ES</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#00071b]">Eleanor Sterling</p>
              <p className="text-[#00071b]/55 text-sm">Director of Global Events, Fortune 500</p>
            </div>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="mt-24 flex flex-wrap justify-center gap-12 md:gap-16 items-center opacity-25 grayscale">
          {['VOX', 'PRADA', 'REUTERS', 'Condé Nast', 'VOGUE'].map((brand) => (
            <span key={brand} className="font-headline font-extrabold text-xl md:text-2xl text-[#00071b]">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="w-full border-t-2 border-[#C9A84C]/25" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 md:px-12 py-20 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="space-y-5">
          <div className="text-xl font-bold text-[#0F1F3D] font-headline">The Grand Venue</div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Curating elevated experiences in the heart of the city. Architectural elegance for the discerning host.
          </p>
          <div className="flex gap-3">
            {['Tw', 'In', 'Ig'].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-10 h-10 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-xs font-bold text-[#0F1F3D] hover:bg-[#C9A84C] hover:text-[#0F1F3D] hover:border-[#C9A84C] transition-colors duration-300 cursor-pointer"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#0F1F3D]">Company</h4>
            <nav className="flex flex-col space-y-2">
              {['About Us', 'Contact', 'Press Kit', 'Careers'].map((item) => (
                <a key={item} href="#" className="text-sm text-slate-500 hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer">{item}</a>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#0F1F3D]">Legal</h4>
            <nav className="flex flex-col space-y-2">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <a key={item} href="#" className="text-sm text-slate-500 hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer">{item}</a>
              ))}
            </nav>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-5">
          <h4 className="font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#0F1F3D]">Newsletter</h4>
          <p className="text-sm text-slate-500">Receive exclusive event insights and seasonal venue showcases.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-white border border-[#C9A84C]/20 rounded-l-xl px-4 py-3 text-sm w-full outline-none focus:border-[#C9A84C]/50 transition"
            />
            <button
              className="px-5 py-3 rounded-r-xl font-bold text-[11px] uppercase tracking-widest cursor-pointer hover:brightness-110 transition"
              style={{ backgroundColor: '#C9A84C', color: '#0f1f3d' }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 border-t border-[#C9A84C]/10 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-xs text-slate-400">© 2024 The Grand Venue. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="text-xs text-slate-400">5th Ave, Manhattan, NY</span>
          <span className="text-xs text-slate-400">concierge@thegrandvenue.com</span>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="scroll-smooth" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Nav />
      <Hero />
      <SpacesSection />
      <ContactSection />
      <TestimonialSection />
      <Footer />
    </div>
  )
}
