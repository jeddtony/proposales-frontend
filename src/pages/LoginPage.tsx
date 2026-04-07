import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import loginBg from '../../images/login-image.png'
import { proposalsApi, ApiError } from '../api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)
    try {
      await proposalsApi.login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? 'Invalid email or password. Please try again.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={loginBg}
          alt="Grand Hotel Lobby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#00071b]/65" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-8 md:px-12 py-5">
        <a href="/" className="font-headline text-lg sm:text-xl font-bold tracking-tighter text-white cursor-pointer">
          The Grand Venue
        </a>
        <div className="hidden md:flex items-center gap-10">
          {['Venues', 'Experiences', 'Events', 'Journal'].map((link) => (
            <a
              key={link}
              href="#"
              className="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {link}
            </a>
          ))}
        </div>
        <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 sm:px-6 py-2 sm:py-2.5 rounded uppercase tracking-[0.15em] text-[10px] font-bold hover:bg-white/20 transition-colors duration-200 cursor-pointer">
          Book Now
        </button>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-8 min-h-[calc(100vh-72px-68px)]">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 px-6 py-10 sm:px-10 sm:py-12 md:px-14">

            {/* Header */}
            <header className="mb-8 sm:mb-10">
              <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#0a1b39] tracking-tight leading-none mb-3">
                Welcome Back
              </h1>
              <p className="text-[#45474e] text-sm leading-relaxed">
                Access your curated portal for venue management and exclusive concierge services.
              </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#0a1b39]/60"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="concierge@grandvenue.com"
                  autoComplete="email"
                  required
                  className="w-full bg-[#f8f3eb] border-none rounded-lg px-4 py-3.5 sm:py-4 text-[#0a1b39] text-sm focus:outline-none focus:ring-2 focus:ring-[#e6c364]/40 focus:bg-[#f2ede5] transition-all duration-200 placeholder:text-[#75777e]/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="font-headline text-[10px] uppercase tracking-[0.2em] font-bold text-[#0a1b39]/60"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full bg-[#f8f3eb] border-none rounded-lg px-4 py-3.5 sm:py-4 pr-11 text-[#0a1b39] text-sm focus:outline-none focus:ring-2 focus:ring-[#e6c364]/40 focus:bg-[#f2ede5] transition-all duration-200 placeholder:text-[#75777e]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#75777e] hover:text-[#0a1b39] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options row */}
              <div className="flex items-center justify-between text-xs gap-2">
                <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-[#c5c6ce] text-[#e6c364] accent-[#e6c364] focus:ring-[#e6c364]/20 cursor-pointer"
                  />
                  <span className="text-[#45474e] group-hover:text-[#0a1b39] transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-[#755b00] font-semibold hover:text-[#e6c364] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2.5">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-[#e6c364] text-[#241a00] font-headline font-bold uppercase tracking-[0.2em] text-[12px] py-4 rounded-lg shadow-lg hover:bg-[#d4b158] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing In…</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#c5c6ce]/20 text-center">
              <p className="text-xs text-[#45474e]">
                Want to try the demo?{' '}
                <button
                  type="button"
                  onClick={() => { setEmail('admin@mail.com'); setPassword('password123') }}
                  className="text-[#0a1b39] font-bold hover:underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Fill demo credentials
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 px-5 sm:px-8 border-t border-white/10">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between max-w-6xl mx-auto">
          <span className="font-headline font-bold text-white/80">The Grand Venue</span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['Privacy Policy', 'Terms of Service', 'Contact Concierge'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs sm:text-sm text-white/50 hover:text-[#e6c364] transition-colors duration-200 cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>
          <span className="text-xs sm:text-sm text-white/40 text-center">© 2024 The Grand Venue. All rights reserved.</span>
        </div>
      </footer>

    </div>
  )
}
