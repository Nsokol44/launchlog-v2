'use client'
import { GuideLayout, Section, Callout, StepList, ResourceCard, CheckList } from './GuideLayout'

export default function LegalComplianceClient() {
  return (
    <GuideLayout
      badge="⚖️ Legal Guide"
      title="Legal compliance & protecting personal assets"
      description="The essential legal steps every founder needs to take — and the costly mistakes to avoid. Not legal advice, but a clear roadmap of what to handle and when."
    >
      <Callout icon="⚠️" title="Important disclaimer" color="bg-red-50 border-red-200">
        <p className="text-red-800">This guide is educational only and does not constitute legal advice. Consult a qualified attorney for your specific situation. Many of the resources below offer free initial consultations.</p>
      </Callout>

      <Section title="Step 1 — Choose the right business structure">
        <p className="text-muted text-sm leading-relaxed mb-4">This is the most important decision you'll make legally. Get it wrong and you could be personally liable for business debts.</p>
        <div className="space-y-3 mb-5">
          {[
            { type: 'LLC', best: 'Most startups', pro: 'Protects personal assets, flexible tax treatment, simple to set up', con: 'Less attractive to venture investors, harder to issue stock options', cost: '$50–$500 to form depending on state' },
            { type: 'C-Corp (Delaware)', best: 'VC-backed startups', pro: 'Standard for venture investment, easy to issue stock, SAFEs and options work cleanly', con: 'More complex, double taxation without S-Corp election', cost: '$500–$2,000 to form properly' },
            { type: 'Sole Proprietorship', best: 'Nobody', pro: 'Free to start', con: 'Zero personal asset protection — your house and savings are at risk', cost: 'Free but dangerous' },
          ].map(s => (
            <div key={s.type} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-display text-lg font-bold text-ink">{s.type}</span>
                <span className="text-xs bg-cream border border-border px-2 py-0.5 rounded-full text-muted">Best for: {s.best}</span>
              </div>
              <p className="text-xs text-green-700 mb-1">✅ {s.pro}</p>
              <p className="text-xs text-red-600 mb-1">❌ {s.con}</p>
              <p className="text-xs text-muted">💰 {s.cost}</p>
            </div>
          ))}
        </div>
        <Callout icon="💡" color="bg-blue-50 border-blue-200">
          <p className="text-blue-900 text-sm"><strong>Bottom line:</strong> If you're bootstrapping or lifestyle business — LLC. If you plan to raise venture capital — Delaware C-Corp. When in doubt, form an LLC now and convert later.</p>
        </Callout>
      </Section>

      <Section title="Step 2 — Separate personal and business finances immediately">
        <p className="text-muted text-sm leading-relaxed mb-4">Mixing personal and business money is the fastest way to lose your legal protections. This is called "piercing the corporate veil."</p>
        <CheckList items={[
          'Open a dedicated business bank account (never use your personal account for business)',
          'Get a business credit card — even a basic one',
          'Pay yourself a salary or documented owner\'s draw, not random transfers',
          'Keep records of every business expense, even small ones',
          'Never pay personal bills from the business account',
        ]} />
        <div className="mt-4 space-y-3">
          <ResourceCard name="Mercury (Business Banking)" description="Free business bank account designed for startups. No minimum balance, no fees. Integrates with accounting tools." url="https://mercury.com" tag="Free" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="Relay Financial" description="Business banking with built-in budgeting. Good for founders who want to separate funds by category." url="https://relayfi.com" tag="Free" tagColor="bg-green-100 text-green-700" />
        </div>
      </Section>

      <Section title="Step 3 — Essential documents every startup needs">
        <div className="space-y-3">
          {[
            { doc: 'Operating Agreement (LLC) or Bylaws (Corp)', why: 'Defines ownership percentages, decision-making rights, and what happens if a founder leaves. Without this, state default rules apply — which are often bad for founders.', urgent: true },
            { doc: 'Founder Vesting Agreement', why: "Protects the company if a co-founder leaves early. Standard is 4-year vesting with a 1-year cliff. If you don't have this, a departed co-founder keeps all their equity forever.", urgent: true },
            { doc: 'IP Assignment Agreement', why: 'Ensures all intellectual property you create belongs to the company, not you personally. Investors require this before closing a round.', urgent: true },
            { doc: 'NDA (Non-Disclosure Agreement)', why: "Use when sharing sensitive details with potential partners, contractors, or vendors. Don't require investors to sign — they'll walk.", urgent: false },
            { doc: 'Employee / Contractor Agreements', why: 'Clearly defines scope, payment, and who owns any work product. Critical for any contractor or early employee.', urgent: false },
            { doc: 'Privacy Policy & Terms of Service', why: 'Required by law if you collect user data. Also required by Apple and Google app stores.', urgent: false },
          ].map(d => (
            <div key={d.doc} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-ink">{d.doc}</p>
                {d.urgent && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Do this first</span>}
              </div>
              <p className="text-xs text-muted leading-relaxed">{d.why}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <ResourceCard name="Cooley GO Documents" description="Free legal templates from top startup law firm Cooley. Covers most of the documents above." url="https://www.cooleygo.com/documents/" tag="Free" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="Clerky" description="Online platform for startup legal docs. Incorporation, SAFEs, offer letters at low cost with attorney review." url="https://clerky.com" tag="Low cost" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="Stripe Atlas" description="Incorporate a Delaware C-Corp online in minutes. Includes registered agent, bank account setup, and basic legal docs." url="https://stripe.com/atlas" tag="$500" tagColor="bg-purple-100 text-purple-700" />
        </div>
      </Section>

      <Section title="Step 4 — Ongoing compliance checklist">
        <p className="text-muted text-sm leading-relaxed mb-4">Compliance isn't a one-time task. Here's what you need to maintain to stay protected.</p>
        <CheckList items={[
          'File annual reports with your state (most states require this — fees and deadlines vary)',
          'Maintain a registered agent (required for LLCs and corps)',
          'Hold and document annual board/member meetings',
          'Keep corporate records separate from personal records',
          'Pay quarterly estimated taxes — failure leads to penalties',
          'Collect and remit sales tax if you sell physical products',
          'Get appropriate business insurance (general liability at minimum)',
        ]} />
      </Section>

      <Section title="Free legal resources for Tennessee founders">
        <div className="space-y-3">
          <ResourceCard name="Tennessee Secretary of State" description="Official portal for business formation in Tennessee. File your LLC or corporation directly online." url="https://tnbear.tn.gov" tag="Official" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="KEC Legal Resources" description="The Knoxville Entrepreneur Center connects founders to volunteer attorneys and legal clinics for early-stage companies." url="https://knoxec.com" tag="East TN" tagColor="bg-orange-100 text-orange-700" />
          <ResourceCard name="SCORE Legal Mentors" description="Free mentorship from attorneys and business advisors. Find a mentor with legal expertise in your area." url="https://www.score.org/find-mentor" tag="Free" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="TSBDC Business Advising" description="Free business advising through Tennessee's SBDC network including guidance on business structure and compliance." url="https://www.tsbdc.org" tag="Free" tagColor="bg-green-100 text-green-700" />
        </div>
      </Section>

    </GuideLayout>
  )
}
