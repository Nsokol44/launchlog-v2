'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { signOut } from '@/lib/supabase-browser'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  const isActive = (path) => pathname === path

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const tabs = [
    { href: '/',          label: 'Discover'       },
    { href: '/saved',     label: 'Saved'          },
    { href: '/list',      label: 'List a Startup' },
    { href: '/dashboard', label: 'Dashboard'      },
    ...(profile?.is_admin ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-warm-white border-b border-border flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="font-display text-2xl font-bold text-ink tracking-tight">
          Launch<span className="text-coral">Log</span>
        </Link>

        <div className="hidden md:flex gap-1 bg-cream border border-border rounded-full p-1">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isActive(tab.href)
                  ? 'bg-coral text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-coral text-sm font-semibold">
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
            <>
              <button
                onClick={() => { setAuthMode('signin'); setShowAuth(true) }}
                className="text-sm font-medium px-4 py-2 rounded-full border border-border hover:border-coral hover:text-coral transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-coral text-white shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-px"
              >
                Join free
              </button>
            </>
          )}
        </div>
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
