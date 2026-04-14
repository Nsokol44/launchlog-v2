'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { signOut } from '@/lib/supabase-browser'
import AuthModal from './AuthModal'
import { Zap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => pathname === path

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const tabs = [
    { href: '/',          label: 'Discover'        },
    { href: '/saved',     label: 'Saved'           },
    { href: '/list',      label: 'List a Startup'  },
    { href: '/resources', label: '📚 Resources'    },
    { href: '/agent',     label: '🤖 Agent'        },
    { href: '/dashboard', label: 'Dashboard'       },
    ...(profile?.is_admin ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
  ]

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-warm-white border-b border-border">
        <div className="flex items-center justify-between px-5 md:px-10 py-4">

          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-bold text-ink tracking-tight" onClick={closeMobile}>
            Launch<span className="text-coral">Log</span>
          </Link>

          {/* Desktop tabs */}
          <div className="hidden md:flex gap-1 bg-cream border border-border rounded-full p-1">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(tab.href)
                    ? 'bg-coral text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {!profile?.subscribed && (
                  <Link
                    href="/upgrade"
                    className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-coral-50 border border-coral-200 text-coral hover:bg-coral-100 transition-all"
                  >
                    <Zap size={12} /> Upgrade
                  </Link>
                )}
                <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-coral text-sm font-semibold flex-shrink-0">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-muted hover:text-ink transition-colors hidden md:block"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => { setAuthMode('signin'); setShowAuth(true) }}
                  className="text-sm font-medium px-4 py-2 rounded-full border border-border hover:border-coral hover:text-coral transition-all"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
                  className="text-sm font-semibold px-4 py-2 rounded-full bg-coral text-white shadow-coral hover:bg-coral-600 transition-all"
                >
                  Join free
                </button>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-coral hover:text-coral transition-all text-ink"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white px-5 py-4 flex flex-col gap-1">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={closeMobile}
                className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive(tab.href)
                    ? 'bg-coral text-white'
                    : 'text-ink hover:bg-cream'
                }`}
              >
                {tab.label}
              </Link>
            ))}

            <div className="border-t border-border mt-3 pt-3 space-y-2">
              {user ? (
                <>
                  {!profile?.subscribed && (
                    <Link
                      href="/upgrade"
                      onClick={closeMobile}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-coral bg-coral-50 border border-coral-200"
                    >
                      <Zap size={14} /> Upgrade to Agent — $19/mo
                    </Link>
                  )}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-coral text-sm font-semibold">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-muted truncate max-w-48">{user.email}</span>
                    </div>
                    <button
                      onClick={() => { handleSignOut(); closeMobile() }}
                      className="text-sm text-muted hover:text-coral transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setAuthMode('signin'); setShowAuth(true); closeMobile() }}
                    className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-border hover:border-coral hover:text-coral transition-all text-center"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setShowAuth(true); closeMobile() }}
                    className="w-full text-sm font-semibold px-4 py-3 rounded-2xl bg-coral text-white shadow-coral hover:bg-coral-600 transition-all text-center"
                  >
                    Join free
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onToggleMode={() => setAuthMode(m => m === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </>
  )
}
