'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { FEEDBACK_OPTIONS } from '@/lib/constants'
import { recordSwipe } from '@/lib/supabase-browser'
import toast from 'react-hot-toast'

export default function FeedbackModal({ startup, onClose }) {
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSend = async () => {
    setSubmitting(true)
    try {
      await recordSwipe({ startup_id: startup.id, direction: 'left', feedback_reason: selected, feedback_note: note })
      toast.success('Feedback sent to the founder ✅')
    } catch {}
    finally { setSubmitting(false); onClose() }
  }

  const handleSkip = async () => {
    try { await recordSwipe({ startup_id: startup.id, direction: 'left' }) } catch {}
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-xl font-bold">What didn't click? 🤔</h3>
          <button onClick={handleSkip} className="text-muted hover:text-ink"><X size={18} /></button>
        </div>
        <p className="text-sm text-muted mb-5 leading-relaxed">Your feedback goes to the founder. Be honest — it helps them build something better.</p>

        <div className="flex flex-col gap-2 mb-4">
          {FEEDBACK_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setSelected(selected === opt.id ? null : opt.id)}
              className={`text-left px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                selected === opt.id ? 'border-coral bg-coral-50 text-coral' : 'border-border bg-white text-ink hover:border-coral hover:bg-coral-50'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <textarea value={note} onChange={e => setNote(e.target.value)}
          placeholder="Add more detail... (optional)"
          className="w-full border border-border rounded-2xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors resize-none h-20 mb-4" />

        <div className="flex gap-3 justify-end">
          <button onClick={handleSkip} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-coral hover:text-coral transition-all">Skip</button>
          <button onClick={handleSend} disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-coral text-white text-sm font-semibold shadow-coral hover:bg-coral-600 transition-all disabled:opacity-60">
            {submitting ? 'Sending...' : 'Send feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}
