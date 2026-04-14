'use client'
import { GuideLayout, Section, Callout, StepList, ResourceCard, CheckList } from './GuideLayout'

export default function OperatingLeanClient() {
  return (
    <GuideLayout
      badge="📉 Operations Guide"
      title="Operating lean until market fit"
      description="How to extend your runway, cut the right costs, and stay focused before you find product-market fit. The goal isn't to be cheap — it's to survive long enough to find what works."
      stats={[
        { val: '18 months', label: 'minimum runway to target' },
        { val: '$0–$50/mo', label: 'what most tools should cost early' },
        { val: '1 metric', label: 'to obsess over before PMF' },
      ]}
    >
      <Callout icon="🎯" title="The lean mindset" color="bg-coral-50 border-coral-200">
        <p className="text-coral-900">Lean doesn't mean broke. It means every dollar spent must either get you closer to a paying customer or help you learn whether your idea works. If a cost does neither, cut it.</p>
      </Callout>

      <Section title="What product-market fit actually feels like">
        <p className="text-muted text-sm leading-relaxed mb-4">You'll know PMF when it happens. Until then, assume you don't have it — no matter how many compliments you receive.</p>
        <div className="space-y-3">
          {[
            { signal: 'Customers come back without prompting', what: 'Retention above 40% after 30 days for consumer, 70%+ for SaaS' },
            { signal: 'People refer others unprompted', what: 'You get inbound signups you didn\'t generate yourself' },
            { signal: 'Customers complain when features break', what: 'They care enough to be frustrated — that\'s a good sign' },
            { signal: 'You can\'t keep up with demand', what: 'Support tickets, signups, or usage outpacing your capacity' },
            { signal: 'The "40% rule"', what: 'Ask users: "How would you feel if you could no longer use this?" If 40%+ say "very disappointed" — you have PMF.' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-border">
              <div className="text-green-500 text-xl flex-shrink-0">✓</div>
              <div>
                <p className="font-semibold text-sm text-ink">{s.signal}</p>
                <p className="text-xs text-muted mt-0.5">{s.what}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Extending your runway">
        <p className="text-muted text-sm leading-relaxed mb-4">Runway is time. More time means more chances to find what works. Here's how to stretch it.</p>

        <h3 className="font-semibold text-sm text-ink mb-3">Cut costs without killing momentum</h3>
        <CheckList items={[
          'Pay yourself last — or not at all if you have savings to cover 12 months personally',
          'Hire contractors before employees. No benefits, no equity dilution, easy to stop',
          'Use free tiers of every tool until you absolutely need to upgrade',
          'Share office space, coworking, or work from home — office rent is the fastest way to burn cash',
          'Audit every subscription monthly. Cut anything not directly tied to getting or serving customers',
          'Negotiate annual pricing — most SaaS tools offer 20-40% off for annual commits',
        ]} />

        <h3 className="font-semibold text-sm text-ink mb-3 mt-6">Increase revenue faster</h3>
        <CheckList items={[
          'Charge more than you\'re comfortable with — most early founders undercharge by 3-5x',
          'Offer annual plans upfront — getting 12 months of cash day one changes your runway dramatically',
          'Do manual work before automating — charge for the outcome, figure out delivery later',
          'Ask every happy customer for a referral this week',
          'Add a services component if pure product revenue is slow — consulting, setup fees, training',
        ]} />
      </Section>

      <Section title="The one metric to track before PMF">
        <p className="text-muted text-sm leading-relaxed mb-4">Don't track 15 metrics. Track one. Everything else is noise until you find PMF.</p>
        <div className="space-y-3">
          {[
            { type: 'SaaS / subscription', metric: 'Week 4 retention', howto: 'Of every cohort that signs up, what % is still active 4 weeks later? Below 20% is a problem. Above 40% is promising.' },
            { type: 'Marketplace / platform', metric: 'Repeat usage rate', howto: 'What % of users who complete a transaction return within 30 days to do another one?' },
            { type: 'Consumer app', metric: 'DAU/MAU ratio', howto: 'Daily active users divided by monthly active users. Above 20% is good. Above 50% is exceptional.' },
            { type: 'B2B / services', metric: 'Net revenue retention', howto: 'Are your existing customers paying you more or less this month than last? Growing NRR is the strongest PMF signal.' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4">
              <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">{m.type}</p>
              <p className="font-display text-lg font-bold text-coral mb-1">{m.metric}</p>
              <p className="text-xs text-muted leading-relaxed">{m.howto}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Free and cheap tools for every function">
        <div className="space-y-2">
          {[
            { cat: 'Banking', tool: 'Mercury', desc: 'Free business bank account built for startups', url: 'https://mercury.com', price: 'Free' },
            { cat: 'Accounting', tool: 'Wave', desc: 'Free accounting, invoicing, and receipt tracking', url: 'https://www.waveapps.com', price: 'Free' },
            { cat: 'Email', tool: 'Resend + free tier', desc: 'Transactional email. Free up to 3,000 emails/month', url: 'https://resend.com', price: 'Free' },
            { cat: 'CRM', tool: 'HubSpot free tier', desc: 'Track leads, contacts, and deals. Free forever plan is solid for early stage', url: 'https://hubspot.com', price: 'Free' },
            { cat: 'Project management', tool: 'Linear', desc: 'Issue tracking and roadmap. Free for small teams', url: 'https://linear.app', price: 'Free' },
            { cat: 'Customer support', tool: 'Crisp', desc: 'Live chat and support inbox. Free plan for 2 agents', url: 'https://crisp.chat', price: 'Free' },
            { cat: 'Analytics', tool: 'PostHog', desc: 'Product analytics, session recording, feature flags. Generous free tier', url: 'https://posthog.com', price: 'Free' },
            { cat: 'Docs / Wiki', tool: 'Notion', desc: 'Team docs, SOPs, and databases. Free for small teams', url: 'https://notion.com', price: 'Free' },
            { cat: 'Design', tool: 'Canva', desc: 'Marketing assets, social graphics, decks. Free tier is sufficient for most', url: 'https://canva.com', price: 'Free' },
            { cat: 'Video calls', tool: 'Google Meet', desc: 'Free, works without downloads, good enough for customer calls', url: 'https://meet.google.com', price: 'Free' },
          ].map(t => (
            <a key={t.tool} href={t.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-coral transition-all group">
              <span className="text-xs text-muted w-28 flex-shrink-0 font-medium">{t.cat}</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-ink group-hover:text-coral transition-colors">{t.tool}</span>
                <span className="text-xs text-muted ml-2">{t.desc}</span>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">{t.price}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section title="When to stop being lean">
        <p className="text-muted text-sm leading-relaxed mb-4">Operating lean is a survival strategy, not a permanent state. Here's when it's right to start spending:</p>
        <CheckList items={[
          'You have clear PMF signal — 40%+ retention, growing NRR, or the 40% rule passes',
          'You have a repeatable, predictable way to acquire customers',
          'You\'ve raised money specifically to grow — that\'s what it\'s for',
          'Hiring would directly unblock revenue (not just "help out")',
          'You\'re turning down customers because you don\'t have the capacity to serve them',
        ]} />
        <Callout icon="⚠️" color="bg-amber-50 border-amber-200">
          <p className="text-amber-900 text-sm">The biggest lean mistake isn't spending too little — it's spending too late on things that matter (like hiring your first salesperson) while continuing to pay for things that don't (like a fancy office).</p>
        </Callout>
      </Section>

    </GuideLayout>
  )
}
