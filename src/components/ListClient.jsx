'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createStartup, uploadLogo } from '@/lib/supabase-browser'
import { CATEGORIES, STAGES } from '@/lib/constants'

const COMMUNITY_FIELDS = [
  { key: 'website_url',   label: 'Website',               icon: '🌐', placeholder: 'https://yoursite.com' },
  { key: 'discord_url',   label: 'Discord invite link',   icon: '🎮', placeholder: 'https://discord.gg/your-server' },
  { key: 'slack_url',     label: 'Slack workspace',       icon: '💬', placeholder: 'https://yourworkspace.slack.com' },
  { key: 'instagram_url', label: 'Instagram',             icon: '📸', placeholder: 'https://instagram.com/...' },
  { key: 'twitter_url',   label: 'X / Twitter',           icon: '🐦', placeholder: 'https://twitter.com/...' },
  { key: 'linkedin_url',  label: 'LinkedIn page',         icon: '💼', placeholder: 'https://linkedin.com/company/...' },
  { key: 'tiktok_url',    label: 'TikTok',                icon: '🎵', placeholder: 'https://tiktok.com/@...' },
]

export default function ListClient() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
 const [form, setForm] = useState({
  name: '', tagline: '', logo_emoji: '🚀', category: '', city: '',
  stage: '', product: '', target_customer: '', revenue_model: '', founder_name: '',
  website_url: '', discord_url: '', slack_url: '', instagram_url: '',
  twitter_url: '', linkedin_url: '', tiktok_url: '',
})

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = e => setLogoPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.tagline || !form.product || !form.category) {
      toast.error('Please fill in the required fields'); return
    }
    setSubmitting(true)
    try {
      let logo_url = null
      if (logoFile) logo_url = await uploadLogo(logoFile, form.name)
      await createStartup({ ...form, logo_url })
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="font-display text-3xl font-bold mb-3">You're in the queue!</h2>
        <p className="text-muted leading-relaxed mb-8">Your startup has been submitted for review. We'll have you live within 24 hours.</p>
        <button onClick={() => router.push('/')} className="bg-coral text-white font-semibold px-8 py-3.5 rounded-full shadow-coral hover:bg-coral-600 transition-all">
          Explore other startups →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold mb-2">List your startup 🚀</h1>
        <p className="text-muted">Get in front of real people who might love what you're building. Free to list.</p>
      </div>

      {/* Step 1 */}
      <FormCard step={1} title="Your brand">
        <label className="block mb-5 cursor-pointer">
          <div className="border-2 border-dashed border-border rounded-2xl p-7 text-center hover:border-coral hover:bg-coral-50 transition-all bg-cream">
            {logoPreview
              ? <img src={logoPreview} alt="preview" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-2" />
              : <div className="text-4xl mb-2">{form.logo_emoji}</div>
            }
            <p className="text-sm text-muted"><span className="text-coral font-medium">Upload your logo</span> or choose an emoji below<br /><span className="text-xs">PNG, JPG up to 2MB</span></p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        </label>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Or choose an emoji</label>
          <div className="flex flex-wrap gap-2">
            {['🚀','💡','🌱','🧠','⚡','🎯','💎','🔥','🌍','❤️','🎨','🏆'].map(e => (
              <button key={e} type="button" onClick={() => set('logo_emoji', e)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${form.logo_emoji === e ? 'border-coral bg-coral-50' : 'border-border bg-white hover:border-coral'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Startup name *" value={form.name} onChange={v => set('name', v)} placeholder="e.g. GreenBite" />
          <Field label="Tagline *" value={form.tagline} onChange={v => set('tagline', v)} placeholder="One sentence about what you do" />
          <Field label="HQ City" value={form.city} onChange={v => set('city', v)} placeholder="e.g. Austin, TX" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Stage</label>
            <select value={form.stage} onChange={e => set('stage', e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors">
              <option value="">Select stage</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </FormCard>

      {/* Step 2 */}
      <FormCard step={2} title="Category">
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
            <button key={cat.value} type="button" onClick={() => set('category', cat.value)}
              className={`py-3 px-2 rounded-2xl border-2 text-center transition-all ${form.category === cat.value ? 'border-coral bg-coral-50 text-coral' : 'border-border bg-white hover:border-coral hover:bg-coral-50'}`}>
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs font-medium">{cat.label}</div>
            </button>
          ))}
        </div>
      </FormCard>

      {/* Step 3 */}
      <FormCard step={3} title="Your pitch">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">What does your product do? *</label>
            <textarea value={form.product} onChange={e => set('product', e.target.value)}
              placeholder="Describe your product in plain English. Pretend you're explaining it to a friend."
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors resize-none h-24" />
          </div>
          <Field label="Who is your target customer?" value={form.target_customer} onChange={v => set('target_customer', v)} placeholder="e.g. Busy parents who cook at home 3x a week" />
          <Field label="How do you plan to make money?" value={form.revenue_model} onChange={v => set('revenue_model', v)} placeholder="e.g. Monthly subscription, $12/mo" />
          <Field label="Your name (founder)" value={form.founder_name} onChange={v => set('founder_name', v)} placeholder="Your name" />
        </div>
      </FormCard>

      {/* Step 4 */}
      <FormCard step={4} title={<>Community channels <span className="text-xs font-normal text-muted font-sans ml-1">optional</span></>}>
        <p className="text-sm text-muted mb-5 leading-relaxed">When someone supports your startup, we'll show them where to join your community.</p>
        <div className="space-y-3">
          {COMMUNITY_FIELDS.map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="text-xl w-8 flex-shrink-0 text-center">{f.icon}</span>
              <input type="url" value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-cream focus:outline-none focus:border-coral transition-colors" />
            </div>
          ))}
        </div>
      </FormCard>

      <div className="text-center pt-2 pb-8">
        <button onClick={handleSubmit} disabled={submitting}
          className="w-full max-w-sm bg-coral text-white font-semibold py-4 rounded-full shadow-coral hover:bg-coral-600 transition-all hover:-translate-y-0.5 disabled:opacity-60 text-base">
          {submitting ? 'Submitting...' : "List my startup — it's free →"}
        </button>
        <p className="text-xs text-muted mt-3">We review listings within 24 hours.</p>
      </div>
    </div>
  )
}

function FormCard({ step, title, children }) {
  return (
    <div className="bg-white rounded-3xl p-7 border border-border shadow-card mb-5">
      <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:border-coral transition-colors" />
    </div>
  )
}
