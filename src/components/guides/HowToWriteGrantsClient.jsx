'use client'
import { GuideLayout, Section, Callout, StepList, ResourceCard, PromptCard, CheckList } from './GuideLayout'

export default function HowToWriteGrantsClient() {
  return (
    <GuideLayout
      badge="📝 Grants Guide"
      title="How to write grants (and actually win)"
      description="A step-by-step guide to finding, writing, and submitting winning grant applications — plus the best tools and resources to help you do it faster."
      stats={[
        { val: '10–30%', label: 'typical win rate for well-written grants' },
        { val: '$0', label: 'cost to apply to most grants' },
        { val: '3–6 months', label: 'typical timeline from apply to funds' },
      ]}
    >
      <Callout icon="💡" title="The most important thing to know about grants" color="bg-coral-50 border-coral-200">
        <p className="text-coral-900">Grant reviewers read hundreds of applications. The ones that win are not the most impressive companies — they're the ones that most clearly answer the funder's specific questions and demonstrate they will use the money well. Clarity beats complexity every time.</p>
      </Callout>

      <Section title="Step 1 — Find the right grants to apply for">
        <p className="text-muted text-sm leading-relaxed mb-4">Don't apply to everything. Find 3-5 grants you genuinely qualify for and write excellent applications. One strong application beats ten weak ones.</p>
        <StepList steps={[
          { title: 'Define your eligibility', desc: 'Industry, location, stage, revenue, founder demographics, and mission. These filter out 80% of grants immediately.' },
          { title: 'Search by category', desc: 'Federal grants (Grants.gov), state grants (your state economic development office), foundation grants (GrantWatch), and industry-specific programs.' },
          { title: 'Check for Tennessee-specific programs', desc: 'LaunchTN, TSBDC, and Tennessee Department of Economic and Community Development all have programs for local founders.' },
          { title: 'Look for repeat winners in your space', desc: "Search '[your industry] + SBIR winner' or '[your city] + small business grant winner' to find programs that have funded companies like yours before." },
          { title: 'Create a tracking spreadsheet', desc: 'Name, amount, deadline, requirements, status. Apply in order of best fit, not largest amount.' },
        ]} />
        <div className="mt-4 space-y-3">
          <ResourceCard name="Grants.gov" description="Official federal grants database. Set up email alerts for your industry keywords." url="https://www.grants.gov" tag="Federal" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="GrantWatch" description="Curated database of grants for small businesses, nonprofits, and startups. Searchable by state and category." url="https://www.grantwatch.com" tag="Database" tagColor="bg-purple-100 text-purple-700" />
          <ResourceCard name="LaunchTN" description="Tennessee-specific funding programs and connections to regional investors and grant programs." url="https://launchtn.org" tag="Tennessee" tagColor="bg-orange-100 text-orange-700" />
          <ResourceCard name="TSBDC Grant Assistance" description="Free help from Tennessee SBDC advisors on finding and applying for grants. They know which programs are active." url="https://www.tsbdc.org" tag="Free help" tagColor="bg-green-100 text-green-700" />
        </div>
      </Section>

      <Section title="Step 2 — Understand what reviewers want">
        <p className="text-muted text-sm leading-relaxed mb-4">Every grant has a scoring rubric. Read it before you write a word. Then write your application to score points, not to tell your story.</p>
        <div className="space-y-3">
          {[
            { q: 'What problem are you solving?', tip: 'Be specific and use data. "40% of restaurant owners waste $800/month on inventory" beats "restaurants have inefficiencies."' },
            { q: 'Why are you the right team?', tip: 'Relevant experience, domain expertise, and proof you\'ve executed before. Connect your background directly to this problem.' },
            { q: 'How will you use the funds?', tip: 'Give a specific budget breakdown. "Marketing" is not specific enough. "$15k for Facebook ads targeting restaurant owners, $10k for trade show booth" is.' },
            { q: 'What impact will this have?', tip: 'Quantify everything. Jobs created, revenue generated, community served, problem reduced by X%. Funders want measurable outcomes.' },
            { q: 'What\'s your sustainability plan?', tip: 'Grants aren\'t meant to fund you forever. Show how you become self-sustaining after the grant period ends.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4">
              <p className="font-semibold text-sm text-ink mb-1">"{item.q}"</p>
              <p className="text-xs text-muted leading-relaxed">💡 {item.tip}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 3 — Write a winning application">
        <p className="text-muted text-sm leading-relaxed mb-4">Follow this structure for every grant narrative, adapting length and detail to match the specific requirements.</p>
        <StepList steps={[
          { title: 'Hook in the first sentence', desc: 'Start with the problem in vivid, specific terms. Reviewers decide in the first paragraph whether to keep reading.' },
          { title: 'State your solution clearly', desc: 'One paragraph. What you built, who it\'s for, and what makes it different. No jargon.' },
          { title: 'Prove the market need', desc: 'Use data — industry statistics, customer interviews, existing demand. Cite your sources.' },
          { title: 'Show your traction', desc: 'Customers, revenue, pilots, letters of intent, partnerships. Anything that proves people want this.' },
          { title: 'Introduce your team with relevance', desc: 'Not your resume — your relevant experience. "I ran a restaurant for 8 years and felt this pain" is more compelling than a list of credentials.' },
          { title: 'Give a specific budget', desc: 'Line-item budget with justification. Show you\'ve thought carefully about how you\'ll spend the money.' },
          { title: 'Describe your outcomes', desc: 'What will be measurably different in 12 months because of this grant? Be specific and realistic.' },
        ]} />
      </Section>

      <Section title="Use AI to write faster (not to replace thinking)">
        <p className="text-muted text-sm leading-relaxed mb-4">AI can help you structure, draft, and improve grant applications — but the facts, numbers, and story have to come from you.</p>
        <PromptCard
          title="Draft a grant narrative from your notes"
          prompt={`I'm applying for a grant and need help writing a compelling narrative. Here are my notes:

Company: [name and one-sentence description]
Problem: [the problem you solve and who has it]
Solution: [what you built]
Traction: [customers, revenue, pilots, any proof points]
Team: [relevant experience]
Grant ask: $[amount]
How I'll use it: [specific uses]
Expected outcomes: [measurable results in 12 months]

Please write a grant narrative of approximately [500/750/1000] words that:
1. Opens with a compelling problem statement
2. Clearly explains the solution and why it works
3. Demonstrates market need with the data above
4. Shows the team is qualified
5. Makes a clear, specific case for the funding request

Write in a professional but conversational tone. Avoid jargon.`}
        />
        <PromptCard
          title="Review and improve a draft"
          prompt={`Please review this grant application narrative and give me specific feedback:

[paste your draft]

Specifically:
1. Is the problem statement compelling? How could it be stronger?
2. Is the solution clearly explained?
3. What proof points are missing or weak?
4. Does the budget ask feel justified?
5. What would a skeptical reviewer push back on?
6. Rewrite the opening paragraph to be more compelling.`}
        />
        <PromptCard
          title="Write a budget justification"
          prompt={`I need to write a budget justification for a grant application. Here's my proposed budget:

[list each line item and amount]

For each line item, write a 1-2 sentence justification explaining:
- What specifically this money will be used for
- Why this cost is necessary to achieve the grant's objectives
- How the amount was calculated (if applicable)

Keep the tone factual and professional.`}
        />
      </Section>

      <Section title="Grant writing resources and tools">
        <div className="space-y-3">
          <ResourceCard name="SCORE Grant Writing Mentors" description="Free one-on-one help from SCORE mentors experienced in grant applications. Find a mentor with grant writing expertise." url="https://www.score.org/find-mentor" tag="Free" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="Foundation Center / Candid" description="The most comprehensive database of grant-making foundations. Search by focus area, geography, and grant size." url="https://candid.org" tag="Database" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="GrantStation" description="Searchable database of grant opportunities with deadline tracking and application guidance." url="https://grantstation.com" tag="Subscription" tagColor="bg-purple-100 text-purple-700" />
          <ResourceCard name="SBIR.gov Resources" description="Free guides, webinars, and sample applications for federal SBIR/STTR grants. Best training for federal grant writing." url="https://www.sbir.gov/tutorials" tag="Federal" tagColor="bg-orange-100 text-orange-700" />
          <ResourceCard name="Tennessee State Library — Grant Resources" description="Tennessee-specific grant resources and databases available through the state library system." url="https://tnsos.gov/TSLA/foundation_center.php" tag="Tennessee" tagColor="bg-amber-100 text-amber-700" />
        </div>
      </Section>

      <Section title="Common reasons grants get rejected">
        <CheckList
          items={[
            'Application doesn\'t match the funder\'s stated priorities — read the guidelines carefully',
            'Vague budget with no justification — reviewers need to trust you\'ll spend wisely',
            'No proof of need — assertions without data are ignored',
            'Team section doesn\'t connect experience to this specific project',
            'Missing required documents or attachments',
            'Submitted late — most systems close automatically at the deadline, no exceptions',
            'Narrative is too long and buries the key points — be concise',
            'Outcomes are not measurable — "raising awareness" is not an outcome',
          ]}
          color="text-red-500"
        />
      </Section>

    </GuideLayout>
  )
}
