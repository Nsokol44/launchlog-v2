// supabase/functions/discovery-agent/index.ts
// Finds potential customers who match the startup's target profile
// Deploy: supabase functions deploy discovery-agent

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

async function callClaude(prompt: string, useWebSearch = false): Promise<string> {
  const body: any = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  }

  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  // Extract text from response (may include tool use blocks)
  const textBlocks = (data.content || [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n')

  return textBlocks
}

Deno.serve(async (req) => {
  try {
    const { startup, run_id } = await req.json()

    const context = `
Startup: ${startup.name}
What it does: ${startup.product}
Target customer: ${startup.target_customer || 'Not specified'}
Problem solved: ${startup.tagline}
Category: ${startup.category}
    `.trim()

    // Step 1: Use Claude to identify where target customers hang out
    const wherePrompt = `You are a customer discovery expert. For this startup, identify exactly where their target customers congregate online — specific subreddits, Twitter communities, LinkedIn groups, Slack communities, Discord servers, or forums.

${context}

Return a JSON object with:
{
  "subreddits": ["r/example1", "r/example2", "r/example3"],
  "twitter_searches": ["search term 1", "search term 2", "search term 3"],
  "search_queries": ["google search 1", "google search 2"],
  "communities": ["community name and URL 1", "community name and URL 2"],
  "pain_point_keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}

Return ONLY valid JSON.`

    const whereResult = await callClaude(wherePrompt)

    let discoveryMap: any = {}
    try {
      const cleaned = whereResult.replace(/```json|```/g, '').trim()
      discoveryMap = JSON.parse(cleaned)
    } catch {
      discoveryMap = { pain_point_keywords: [], subreddits: [], twitter_searches: [] }
    }

    // Step 2: Use Claude with web search to find actual prospects
    const findProspectsPrompt = `You are a customer discovery expert helping a startup find their first customers.

Startup context:
${context}

Target communities to search: ${JSON.stringify(discoveryMap.subreddits || [])}
Pain point keywords: ${JSON.stringify(discoveryMap.pain_point_keywords || [])}

Search Reddit and Twitter to find real people who have expressed the problem this startup solves. Look for people complaining about the pain point, asking for solutions, or discussing the topic.

For each prospect found, return a JSON array of objects:
[
  {
    "name": "username or display name",
    "platform": "reddit or twitter",
    "profile_url": "URL to their profile or post",
    "context": "what they said that indicates they're a good prospect",
    "pain_point": "the specific problem they expressed in their own words"
  }
]

Find 10-15 real prospects. Return ONLY valid JSON array.`

    const prospectsResult = await callClaude(findProspectsPrompt, true)

    let prospects: any[] = []
    try {
      const cleaned = prospectsResult.replace(/```json|```/g, '').trim()
      // Find JSON array in the response
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (match) {
        prospects = JSON.parse(match[0])
      }
    } catch {
      prospects = []
    }

    // Step 3: Save prospects to database
    if (prospects.length > 0) {
      const inserts = prospects.slice(0, 15).map(p => ({
        run_id,
        startup_id: startup.id,
        name: p.name || 'Unknown',
        platform: p.platform || 'unknown',
        profile_url: p.profile_url || null,
        context: p.context || '',
        pain_point: p.pain_point || '',
        outreach_status: 'discovered',
      }))

      const { error } = await supabase.from('agent_prospects').insert(inserts)
      if (error) throw error
    }

    // Step 4: Save discovery map as a report insight
    await supabase.from('agent_reports').upsert([{
      startup_id: startup.id,
      week_of: new Date().toISOString().split('T')[0],
      prospects_found: prospects.length,
      summary: `Found ${prospects.length} potential customers. Key communities: ${(discoveryMap.subreddits || []).slice(0, 3).join(', ')}. Top pain point keywords: ${(discoveryMap.pain_point_keywords || []).slice(0, 3).join(', ')}.`,
    }], { onConflict: 'startup_id,week_of' })

    return new Response(
      JSON.stringify({ success: true, prospects_found: prospects.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
