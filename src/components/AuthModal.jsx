'use client'
import { useState } from 'react'
import { signIn, signUp } from '@/lib/supabase-browser'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

export default function AuthModal({ mode, onClose, onToggleMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fn = mode === 'signin' ? signIn : signUp
      const { error } = await fn(email, password)
      if (error) throw error
      toast.success(mode === 'signup' ? 'Check your email to confirm!' : 'Welcome back!')
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card-lg">
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
          <button onClick={onToggleMode} className="text-coral font-medium hover:underline">
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
