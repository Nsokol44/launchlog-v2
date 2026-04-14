'use client'
import { GuideLayout, Section, Callout, StepList, ResourceCard, CheckList } from './GuideLayout'

export default function EarlyFundingClient() {
  return (
    <GuideLayout
      badge="💰 Funding Guide"
      title="Early funding for your startup"
      description="Where to find your first check — including accelerators, grant programs, and Tennessee-specific organizations that actively support early-stage founders."
      stats={[
        { val: '15+', label: 'funding sources listed' },
        { val: '4', label: 'Tennessee-specific programs' },
        { val: '$0', label: 'cost to apply to most' },
      ]}
    >
      <Callout icon="🎯" title="Start here" color="bg-coral-50 border-coral-200">
        <p className="text-coral-900">Before applying anywhere: know your number. How much do you need for 12-18 months of runway? What will you do with it specifically? Investors and grant committees fund plans, not ideas.</p>
      </Callout>

      {/* Tennessee-specific */}
      <Section title="🏔 Tennessee-specific programs">
        <p className="text-muted text-sm leading-relaxed mb-5">These organizations are actively investing in Tennessee founders. Being local gives you a real advantage — use it.</p>
        <div className="space-y-3">
          <ResourceCard
            name="LaunchTN"
            description="Tennessee's statewide entrepreneurship network. Runs the 36|86 Entrepreneurship Festival, invests in Tennessee startups, and connects founders to investors and resources statewide."
            url="https://launchtn.org"
            tag="Statewide"
            tagColor="bg-blue-100 text-blue-700"
          />
          <ResourceCard
            name="Knoxville Entrepreneur Center (KEC)"
            description="East Tennessee's premier startup hub. Offers mentorship, programming, office space, and connections to regional investors. Strong community for early-stage founders."
            url="https://knoxec.com"
            tag="East TN"
            tagColor="bg-orange-100 text-orange-700"
          />
          <ResourceCard
            name="Spark CleanTech Accelerator"
            description="Focused on clean energy and sustainability startups. Program includes mentorship, funding access, and connections to industry partners in the energy sector."
            url="https://sparkcleantech.com"
            tag="CleanTech"
            tagColor="bg-green-100 text-green-700"
          />
          <ResourceCard
            name="TNInvestco"
            description="Tennessee state-backed investment program that has deployed capital into Tennessee startups. Ask your local SBDC or KEC for connections to TNInvestco-backed funds."
            url="https://www.tn.gov/ecd/entrepreneurship/tninvestco.html"
            tag="State-backed"
            tagColor="bg-purple-100 text-purple-700"
          />
          <ResourceCard
            name="Nashville Entrepreneur Center"
            description="Middle Tennessee's startup hub. Programs, mentorship, and investor access for Nashville-area founders. Strong network in healthcare, music tech, and consumer brands."
            url="https://ec.co"
            tag="Nashville"
            tagColor="bg-pink-100 text-pink-700"
          />
          <ResourceCard
            name="TSBDC (Tennessee SBDC)"
            description="Free business advising through Tennessee's Small Business Development Center network. Help with grant applications, business planning, and funding strategy at no cost."
            url="https://www.tsbdc.org"
            tag="Free advising"
            tagColor="bg-amber-100 text-amber-700"
          />
        </div>
      </Section>

      {/* National accelerators */}
      <Section title="🚀 National accelerators worth applying to">
        <div className="space-y-3">
          <ResourceCard
            name="Builders + Backers"
            description="Provides $18k in no-equity idea grants to entrepreneurs who need support to test their idea. One of the most founder-friendly early programs — no pitch deck required."
            url="https://buildersandbackers.com"
            tag="No equity"
            tagColor="bg-green-100 text-green-700"
          />
          <ResourceCard
            name="Y Combinator"
            description="The most prestigious accelerator globally. $500k for 7%. Apply even if it feels like a long shot — the application process forces clarity on your business."
            url="https://www.ycombinator.com/apply"
            tag="$500k"
            tagColor="bg-orange-100 text-orange-700"
          />
          <ResourceCard
            name="Techstars"
            description="Global network with programs in 50+ cities including industry-specific tracks. $120k for 6%. Check for programs relevant to your category."
            url="https://www.techstars.com/accelerators"
            tag="$120k"
            tagColor="bg-blue-100 text-blue-700"
          />
          <ResourceCard
            name="500 Global"
            description="One of the most active early-stage investors globally. Runs accelerator programs and invests across many industries and geographies."
            url="https://500.co"
            tag="Global"
            tagColor="bg-purple-100 text-purple-700"
          />
          <ResourceCard
            name="MassChallenge"
            description="Zero-equity accelerator with programs in multiple cities. Strong for social impact, health, and food startups. Cash prizes, not investment."
            url="https://masschallenge.org"
            tag="No equity"
            tagColor="bg-green-100 text-green-700"
          />
        </div>
      </Section>

      {/* Non-dilutive */}
      <Section title="🎁 Non-dilutive funding first">
        <p className="text-muted text-sm leading-relaxed mb-4">Before giving away equity, exhaust your non-dilutive options. Grants and competitions don't require repayment or ownership — they're free money.</p>
        <Callout icon="💡" color="bg-amber-50 border-amber-200">
          <p className="text-amber-900 text-sm">The SBIR/STTR program was reauthorized through 2031 in March 2026. If you're building anything technology-focused, this should be on your radar.</p>
        </Callout>
        <div className="space-y-3 mt-4">
          <ResourceCard name="SBIR / STTR" description="Federal R&D grants up to $2M. Just reauthorized through 2031. Best for tech, health, and sustainability startups doing innovation." url="https://www.sbir.gov" tag="Up to $2M" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="Grants.gov" description="Search all federal grant opportunities. Set up email alerts for your industry so you never miss a relevant deadline." url="https://www.grants.gov" tag="Federal" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="FedFunds (GrantWatch)" description="Curated database of grants for small businesses and nonprofits. Searchable by state, category, and deadline." url="https://www.grantwatch.com" tag="Database" tagColor="bg-purple-100 text-purple-700" />
        </div>
      </Section>

      {/* How to approach investors */}
      <Section title="📋 How to approach early investors">
        <StepList steps={[
          { title: 'Get warm introductions', desc: 'Cold emails to investors convert at under 1%. A warm intro from a founder they know converts at 40%+. Ask your accelerator, SBDC advisor, or KEC network for connections.' },
          { title: 'Lead with traction, not the idea', desc: "Investors fund momentum. Even small signals matter — 5 paying customers beats a perfect pitch deck every time." },
          { title: 'Know your ask precisely', desc: 'Say "$500k seed round, $250k committed, raising on a SAFE at $3M cap" not "we\'re raising some money." Precision signals sophistication.' },
          { title: 'Research before you reach out', desc: "Look at every deal an investor has made in the last 2 years. Only reach out if your startup genuinely fits their portfolio." },
          { title: 'Follow up exactly once', desc: 'If no response after 5 business days, send one short follow-up. After that, move on. Time spent chasing cold investors is time not spent building.' },
        ]} />
      </Section>

    </GuideLayout>
  )
}
