'use client'
import { GuideLayout, Section, Callout, PromptCard, StepList, ResourceCard } from './GuideLayout'

export default function AiForBusinessClient() {
  return (
    <GuideLayout
      badge="🤖 AI Guide"
      title="Using AI to build your business"
      description="Practical prompts for market research, business brainstorming, and financial projections. No technical skills required — just copy, paste, and edit."
      stats={[
        { val: '15+ prompts', label: 'ready to copy and use' },
        { val: '3 use cases', label: 'covered in depth' },
        { val: '$0', label: 'tools required to start' },
      ]}
    >
      <Callout icon="💡" title="Before you start" color="bg-amber-50 border-amber-200">
        <p className="text-amber-900">The quality of AI output depends entirely on the quality of your input. Vague prompts get vague answers. The prompts below are specific by design — fill in the brackets with your actual details before using them.</p>
      </Callout>

      {/* Market Research */}
      <Section title="📊 Market Research">
        <p className="text-muted text-sm leading-relaxed mb-5">Use AI to understand your market before spending money on research tools. These prompts work best in Claude or ChatGPT-4.</p>

        <h3 className="font-semibold text-sm mb-3">Define your market size</h3>
        <PromptCard
          title="TAM / SAM / SOM calculation"
          context="Fill in your specific details before using"
          prompt={`I'm building [describe your startup in one sentence]. My target customer is [specific description — e.g., independent restaurant owners with 1-3 locations in the US].

Help me calculate:
1. TAM (Total Addressable Market) — how many potential customers exist globally
2. SAM (Serviceable Addressable Market) — how many I can realistically reach
3. SOM (Serviceable Obtainable Market) — how many I can capture in year 1-3

For each number, show your calculation and list your assumptions. Use publicly available data where possible.`}
        />

        <PromptCard
          title="Competitor analysis"
          prompt={`I'm building [startup description]. My main competitors are [list 2-3 competitors, or say "I'm not sure yet"].

For each competitor, help me identify:
- Their main value proposition
- Pricing model
- Who they serve well
- Where they fall short
- How I could differentiate

If you don't know the competitors, suggest who I should be researching.`}
        />

        <PromptCard
          title="Customer persona deep dive"
          prompt={`My target customer is [specific description]. Help me build a detailed profile:

1. Demographics (age, income, role, location)
2. A day in their life — what does their typical workday look like?
3. Top 3 frustrations related to [your problem area]
4. Where do they spend time online? What communities, publications, podcasts?
5. What does success look like for them?
6. What would make them trust a new product?

Be specific. Avoid generic marketing language.`}
        />

        <h3 className="font-semibold text-sm mb-3 mt-5">Validate demand signals</h3>
        <PromptCard
          title="Find where customers talk about this problem"
          prompt={`My startup solves [specific problem] for [target customer].

Help me find:
1. The exact Reddit communities where these people discuss this problem (list specific subreddits)
2. Keywords they use when searching for solutions
3. Types of questions they post online
4. Industry publications, newsletters, or podcasts they follow
5. Professional associations or groups they belong to

I want to find 20 warm prospects this week.`}
        />
      </Section>

      {/* Business Brainstorming */}
      <Section title="💡 Business Brainstorming">
        <p className="text-muted text-sm leading-relaxed mb-5">Use AI as a thinking partner — not to give you answers, but to pressure-test your assumptions and generate options you haven't considered.</p>

        <PromptCard
          title="Stress-test your business model"
          prompt={`Here is my startup's business model:
- Product: [what you're building]
- Customer: [who buys it]
- Revenue: [how you charge]
- Key assumptions: [list 3-5 assumptions your model depends on]

Play devil's advocate. What are the 5 most likely reasons this fails? For each risk, suggest one concrete thing I could do to test whether it's real before I build further.`}
        />

        <PromptCard
          title="Generate alternative revenue models"
          prompt={`My startup: [description]
Current revenue model: [how you plan to charge]

Generate 6 alternative revenue models I haven't considered. For each one:
- Describe how it works
- Who pays and what they pay for
- Best-case scenario where this outperforms my current model
- Biggest risk

I want to consider options I may have dismissed too quickly.`}
        />

        <PromptCard
          title="Name and positioning brainstorm"
          prompt={`My startup: [description]
Target customer: [specific person]
Core value: [one sentence — what you do better than alternatives]

Generate:
1. 10 potential brand names (memorable, available as .com likely, appropriate for the audience)
2. 5 tagline options (under 8 words each)
3. 3 different positioning angles I could take in the market

Explain the reasoning behind each suggestion.`}
        />

        <PromptCard
          title="Pricing strategy"
          prompt={`My startup: [description]
Target customer: [description with approximate revenue/budget size]
Competitors charge: [price range you know about, or "I don't know yet"]

Help me think through pricing:
1. What pricing model fits this business best (subscription, usage, one-time, freemium)?
2. What price point would feel like a no-brainer vs. a hesitation?
3. What's the risk of pricing too low?
4. How should I structure tiers if I want multiple plans?

Base your answer on what similar products charge and what this type of customer typically budgets for tools.`}
        />
      </Section>

      {/* Financial Projections */}
      <Section title="💰 Financial Projections">
        <p className="text-muted text-sm leading-relaxed mb-5">AI can help you build the logic behind projections, identify key assumptions, and sense-check numbers. Always verify outputs against real data.</p>

        <Callout icon="⚠️" color="bg-red-50 border-red-200">
          <p className="text-red-800">AI financial projections are starting points, not final answers. Use them to build structure and test assumptions — then validate numbers with a SCORE mentor or accountant before presenting to investors.</p>
        </Callout>

        <PromptCard
          title="Build a simple revenue model"
          prompt={`Help me build a 3-year revenue projection for my startup.

Business model: [subscription / one-time / usage-based / etc.]
Price per customer: $[amount] per [month/year/transaction]
Current customers: [number]
Target customers by end of year 1: [number]
Expected monthly growth rate: [%]

Create a month-by-month model for year 1 and annual totals for years 2-3.
Show: new customers, total customers, monthly revenue, annual revenue, cumulative revenue.
List every assumption you're making.`}
        />

        <PromptCard
          title="Calculate burn rate and runway"
          prompt={`My startup's monthly expenses:
- Salaries/founder pay: $[amount]
- Software/tools: $[amount]
- Marketing: $[amount]
- Other fixed costs: $[amount]

Current cash in bank: $[amount]
Monthly revenue (if any): $[amount]

Calculate:
1. Monthly burn rate (net)
2. Runway in months
3. What revenue level makes us break even
4. At what point should I start fundraising to avoid running out of money?`}
        />

        <PromptCard
          title="Fundraising ask calculator"
          prompt={`I'm preparing to raise a seed round. Help me calculate the right amount to raise.

My plan for the next 18 months:
- Hires needed: [list roles and estimated salaries]
- Marketing budget: $[amount/month]
- Product development costs: $[amount]
- Other major expenses: [list]

Current monthly burn: $[amount]
Current revenue: $[amount]

Calculate:
1. Total capital needed for 18 months
2. Recommended raise amount (18 months + 20% buffer)
3. How to explain the use of funds to an investor in 3 bullet points`}
        />
      </Section>

      {/* Tools */}
      <Section title="🛠 Recommended AI tools">
        <div className="space-y-3">
          <ResourceCard name="Claude (Anthropic)" description="Best for long-form analysis, business writing, and nuanced reasoning. Handles complex prompts exceptionally well." url="https://claude.ai" tag="Best for analysis" tagColor="bg-coral-50 text-coral" />
          <ResourceCard name="ChatGPT (OpenAI)" description="Widely used, strong for brainstorming and structured outputs. GPT-4 is significantly better than GPT-3.5." url="https://chat.openai.com" tag="Popular choice" tagColor="bg-green-100 text-green-700" />
          <ResourceCard name="Perplexity AI" description="AI-powered search that cites sources. Best for market research where you need real data with references." url="https://perplexity.ai" tag="Research" tagColor="bg-blue-100 text-blue-700" />
          <ResourceCard name="Notion AI" description="AI built into Notion. Great for business docs, meeting notes, and drafting content inside your workspace." url="https://notion.so" tag="Productivity" tagColor="bg-purple-100 text-purple-700" />
        </div>
      </Section>

    </GuideLayout>
  )
}
