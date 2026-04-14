// ================================================================
// LaunchLog Resources Database
// Edit this file to add/update resources
// ================================================================

export const FUNDING_RESOURCES = [
  // ── Non-dilutive ──────────────────────────────────────────────
  {
    name: 'SBIR / STTR Program',
    type: 'non-dilutive',
    amount: 'Up to $2M',
    description: 'Federal grants for small businesses doing R&D. One of the largest sources of non-dilutive funding in the US.',
    url: 'https://www.sbir.gov',
    categories: ['tech', 'health', 'sustainability', 'manufacturing'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue'],
  },
  {
    name: 'USDA Rural Development Grants',
    type: 'non-dilutive',
    amount: 'Varies',
    description: 'Grants for businesses in rural areas focused on agriculture, food, and rural economic development.',
    url: 'https://www.rd.usda.gov/programs-services/business-programs',
    categories: ['food', 'sustainability', 'manufacturing'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue', 'Growing'],
  },
  {
    name: 'NSF SBIR',
    type: 'non-dilutive',
    amount: 'Up to $2M',
    description: 'National Science Foundation grants for deep tech and science-based startups.',
    url: 'https://seedfund.nsf.gov',
    categories: ['tech', 'health', 'sustainability'],
    stages: ['Idea stage', 'Pre-revenue'],
  },
  {
    name: 'DOE Loan Programs',
    type: 'non-dilutive',
    amount: 'Up to $40M',
    description: 'Department of Energy loans and grants for clean energy and sustainability startups.',
    url: 'https://www.energy.gov/lpo/loan-programs-office',
    categories: ['sustainability'],
    stages: ['Early revenue', 'Growing'],
  },
  {
    name: 'EDA Build to Scale',
    type: 'non-dilutive',
    amount: 'Up to $500k',
    description: 'Economic Development Administration grants for regional startup ecosystems and scaling companies.',
    url: 'https://eda.gov/funding/programs/build-to-scale',
    categories: ['all'],
    stages: ['Early revenue', 'Growing'],
  },
  {
    name: 'Opportunity Finance Network',
    type: 'non-dilutive',
    amount: 'Varies',
    description: 'CDFIs providing affordable loans to underserved entrepreneurs and small businesses.',
    url: 'https://ofn.org',
    categories: ['all'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue'],
  },
  {
    name: 'Grants.gov',
    type: 'non-dilutive',
    amount: 'Varies',
    description: 'The official federal grants database. Search thousands of government grants by category.',
    url: 'https://www.grants.gov',
    categories: ['all'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue', 'Growing'],
  },
  // ── Dilutive ──────────────────────────────────────────────────
  {
    name: 'Y Combinator',
    type: 'dilutive',
    amount: '$500k for 7%',
    description: 'The most prestigious startup accelerator. Two batches per year, strong network.',
    url: 'https://www.ycombinator.com/apply',
    categories: ['all'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue'],
  },
  {
    name: 'Techstars',
    type: 'dilutive',
    amount: '$120k for 6%',
    description: 'Global accelerator with industry-specific programs in 50+ cities.',
    url: 'https://www.techstars.com/accelerators',
    categories: ['all'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue'],
  },
  {
    name: 'AngelList',
    type: 'dilutive',
    amount: 'Varies',
    description: 'Platform to connect with angel investors and raise a rolling SAFE.',
    url: 'https://www.angellist.com',
    categories: ['all'],
    stages: ['Idea stage', 'Pre-revenue', 'Early revenue'],
  },
  {
    name: 'Republic',
    type: 'dilutive',
    amount: 'Up to $5M',
    description: 'Equity crowdfunding under Reg CF. Raise from your community.',
    url: 'https://republic.com',
    categories: ['all'],
    stages: ['Pre-revenue', 'Early revenue'],
  },
  {
    name: 'Wefunder',
    type: 'dilutive',
    amount: 'Up to $5M',
    description: 'Crowdfunding platform. Good for consumer brands with an existing audience.',
    url: 'https://wefunder.com',
    categories: ['food', 'cpg', 'entertainment', 'sustainability'],
    stages: ['Pre-revenue', 'Early revenue'],
  },
  {
    name: 'SBA 7(a) Loan',
    type: 'dilutive',
    amount: 'Up to $5M',
    description: 'Government-backed small business loans with favorable terms.',
    url: 'https://www.sba.gov/funding-programs/loans/7a-loans',
    categories: ['all'],
    stages: ['Early revenue', 'Growing'],
  },
]

export const TOOL_RESOURCES = [
  // Finance
  { category: 'finance', name: 'Financial Projection Template', description: '5-year P&L, cash flow, and balance sheet template for early-stage startups.', type: 'template', url: 'https://www.score.org/resource/financial-projections-template', tags: ['all'] },
  { category: 'finance', name: 'Cap Table Template', description: 'Track founder equity, employee options, and investor ownership.', type: 'template', url: 'https://carta.com/cap-table-template/', tags: ['all'] },
  { category: 'finance', name: 'Startup Budget Calculator', description: 'Plan your runway and burn rate with this monthly budget tool.', type: 'tool', url: 'https://www.score.org/resource/business-budget-template', tags: ['all'] },
  { category: 'finance', name: 'Unit Economics Calculator', description: 'Calculate CAC, LTV, and payback period for your business model.', type: 'tool', url: 'https://www.cobloom.com/blog/saas-metrics-calculator', tags: ['saas', 'tech'] },
  // Legal
  { category: 'legal', name: 'Y Combinator SAFE Agreement', description: 'The standard Simple Agreement for Future Equity used by thousands of startups.', type: 'template', url: 'https://www.ycombinator.com/documents/', tags: ['all'] },
  { category: 'legal', name: 'Founder Agreement Template', description: 'Establishes equity splits, vesting, and IP assignment between co-founders.', type: 'template', url: 'https://www.docracy.com/0kn4bjp3ko8/co-founder-agreement', tags: ['all'] },
  { category: 'legal', name: 'NDA Template', description: 'Standard mutual NDA for sharing confidential information.', type: 'template', url: 'https://www.docracy.com/1/mutual-non-disclosure-agreement', tags: ['all'] },
  { category: 'legal', name: 'Privacy Policy Generator', description: 'Generate a GDPR and CCPA compliant privacy policy for your website.', type: 'tool', url: 'https://www.privacypolicies.com/privacy-policy-generator/', tags: ['all'] },
  // Customer Discovery
  { category: 'customer-discovery', name: 'Customer Interview Script', description: 'The Mom Test framework — questions that get honest answers from customers.', type: 'template', url: 'https://www.notion.so/Customer-Interview-Template', tags: ['all'] },
  { category: 'customer-discovery', name: 'ICP Worksheet', description: 'Define your ideal customer profile step by step.', type: 'template', url: 'https://www.hubspot.com/make-my-persona', tags: ['all'] },
  { category: 'customer-discovery', name: 'Customer Discovery Survey', description: 'Pre-built survey template you can clone and customize in Typeform.', type: 'tool', url: 'https://www.typeform.com/templates/t/customer-discovery-survey/', tags: ['all'] },
  // Marketing
  { category: 'marketing', name: 'Pitch Deck Template (Sequoia)', description: "Sequoia's recommended pitch deck structure used by hundreds of funded startups.", type: 'template', url: 'https://www.sequoiacap.com/article/writing-a-business-plan/', tags: ['all'] },
  { category: 'marketing', name: 'One Pager Template', description: 'A clean one-page company overview for investor meetings.', type: 'template', url: 'https://www.canva.com/templates/business-one-pagers/', tags: ['all'] },
  { category: 'marketing', name: 'Content Calendar Template', description: 'Plan and schedule your social media and content marketing.', type: 'template', url: 'https://buffer.com/library/social-media-calendar-template/', tags: ['all'] },
  // Growth
  { category: 'growth', name: 'OKR Template', description: 'Set quarterly objectives and key results to keep your team focused.', type: 'template', url: 'https://www.notion.so/OKR-Template', tags: ['all'] },
  { category: 'growth', name: 'Product Roadmap Template', description: 'Plan and communicate your product priorities to team and investors.', type: 'template', url: 'https://www.notion.so/Roadmap-Template', tags: ['all'] },
  { category: 'growth', name: 'Go-to-Market Strategy Template', description: 'Step-by-step GTM planning framework for launching your product.', type: 'template', url: 'https://www.hubspot.com/go-to-market-strategy', tags: ['all'] },
]

export const COMMUNITY_RESOURCES = [
  { name: 'Indie Hackers', description: 'Community of founders building profitable products. Best for bootstrapped and early-stage.', url: 'https://www.indiehackers.com', tags: ['all'] },
  { name: 'On Deck', description: 'Fellowship programs for founders, investors, and operators. Strong network.', url: 'https://www.beondeck.com', tags: ['all'] },
  { name: 'SCORE Mentorship', description: 'Free mentorship from experienced business executives. Local chapters nationwide.', url: 'https://www.score.org', tags: ['all'] },
  { name: 'SBA Local Assistance', description: 'Find your local Small Business Development Center for free advising.', url: 'https://www.sba.gov/local-assistance', tags: ['all'] },
  { name: 'AgTech / Food Tech Community', description: 'Network for founders building in food, agriculture, and sustainability.', url: 'https://www.agfunder.com/community', tags: ['food', 'sustainability', 'cpg', 'manufacturing'] },
  { name: 'Health Tech Founders', description: 'Community of founders building health and wellness products.', url: 'https://healthtechfounders.com', tags: ['health'] },
  { name: 'SaaS Community', description: 'The largest SaaS founder community with weekly office hours and peer feedback.', url: 'https://www.saasclub.io', tags: ['saas', 'tech'] },
  { name: 'Founder Slack Communities', description: 'Curated list of the best Slack groups for founders by category.', url: 'https://slofile.com/slack/startups', tags: ['all'] },
]

export const RESOURCE_CATEGORIES = [
  { id: 'funding',            label: 'Funding',             icon: '💰', desc: 'Grants, loans, and investors'               },
  { id: 'finance',            label: 'Finance & Planning',  icon: '📊', desc: 'Financial templates and planning tools'     },
  { id: 'legal',              label: 'Legal',               icon: '⚖️',  desc: 'Agreements, templates, and compliance'     },
  { id: 'customer-discovery', label: 'Customer Discovery',  icon: '🔍', desc: 'Find and validate your target customer'     },
  { id: 'marketing',          label: 'Marketing',           icon: '📣', desc: 'Pitch decks, content, and brand templates'  },
  { id: 'growth',             label: 'Growth',              icon: '📈', desc: 'Frameworks and tools for scaling'           },
  { id: 'community',          label: 'Community',           icon: '🤝', desc: 'Networks, mentors, and peer groups'         },
]
