'use client'
import { useState } from 'react'
import { signIn, signUp } from '@/lib/supabase-browser'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
 
export default function AuthModal({ mode: initialMode, onClose, onToggleMode }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form') // 'form' or 'verify'
 
  const handleToggle = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setStep('form')
    onToggleMode()
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fn = mode === 'signin' ? signIn : signUp
      const { error } = await fn(email, password)
      if (error) throw error
      if (mode === 'signup') {
        setStep('verify')
      } else {
        toast.success('Welcome back!')
        onClose()
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card-lg">
 
        {step === 'verify' ? (
          <div className="text-center py-2">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="font-display text-2xl font-bold mb-2">Check your email</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate
              your account, then come back and sign in.
            </p>
            <button
              onClick={() => { setStep('form'); setMode('signin') }}
              className="w-full bg-coral text-white font-semibold py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all mb-3"
            >
              OK, take me to sign in
            </button>
            <button onClick={onClose} className="w-full text-sm text-muted hover:text-ink transition-colors py-2">
              Close
            </button>
            <p className="text-xs text-muted mt-3">
              Didn't get it? Check your spam folder.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {mode === 'signin' ? 'Welcome back' : 'Join LaunchLog'}
                </h2>
                <p className="text-muted text-sm mt-1">
                  {mode === 'signin' ? 'Sign in to your account' : 'Free forever. No credit card.'}
                </p>
              </div>
              <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>
 
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coral text-white font-semibold py-3 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-px disabled:opacity-60"
              >
                {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
 
            <p className="text-center text-sm text-muted mt-5">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={handleToggle} className="text-coral font-medium hover:underline">
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
 
      </div>
    </div>
  )
}