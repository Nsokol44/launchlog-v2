import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
 
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
 
async function callClaude(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.[0]?.text ?? ''
}
 
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }
 
  try {
    const { startup_id, triggered_by = 'manual' } = await req.json()
 
    if (!startup_id) {
      return new Response(JSON.stringify({ error: 'startup_id required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }
 
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }
 
    // Fetch the startup
    const { data: startup, error: startupError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startup_id)
      .single()
 
    if (startupError || !startup) {
      return new Response(JSON.stringify({ error: 'Startup not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }
 
    // Create agent run record
    const { data: run, error: runError } = await supabase
      .from('agent_runs')
      .insert([{ startup_id, triggered_by, status: 'running' }])
      .select()
      .single()
 
    if (runError) throw runError
 
    const context = `
Startup: ${startup.name}
Tagline: ${startup.tagline}
What it does: ${startup.product}
Target customer: ${startup.target_customer ?? 'Not specified'}
Revenue model: ${startup.revenue_model ?? 'Not specified'}
Stage: ${startup.stage ?? 'Early stage'}
Category: ${startup.category}
City: ${startup.city ?? 'Not specified'}
Founder: ${startup.founder_name ?? 'The founder'}
    `.trim()
 
    // ── MARKETING AGENT ────────────────────────────────────────
    const marketingPrompts = [
      {
        platform: 'twitter',
        prompt: `Write 3 different Twitter/X posts for this startup. Each under 280 characters, conversational, max 2 hashtags. Return ONLY a JSON array of 3 strings.
 
${context}
 
Return: ["post 1", "post 2", "post 3"]`,
      },
      {
        platform: 'linkedin',
        prompt: `Write a LinkedIn post for this startup. 150-200 words, professional but personable, end with a question. Return only the post text.
 
${context}`,
      },
      {
        platform: 'reddit',
        prompt: `Write a Reddit post for this startup. Authentic, not salesy, invite feedback. Return ONLY valid JSON: {"subreddit":"r/example","title":"...","body":"..."}
 
${context}`,
      },
      {
        platform: 'email',
        prompt: `Write a launch email the founder can send to their network. Personal, exciting, under 200 words. Return ONLY valid JSON: {"subject":"...","body":"..."}
 
${context}`,
      },
    ]
 
    const marketingResults = await Promise.allSettled(
      marketingPrompts.map(async ({ platform, prompt }) => {
        const content = await callClaude(prompt)
        return { platform, content }
      })
    )
 
    const marketingInserts = marketingResults
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => ({
        run_id: run.id,
        startup_id: startup.id,
        platform: r.value.platform,
        content: r.value.content,
        status: 'pending',
      }))
 
    if (marketingInserts.length > 0) {
      await supabase.from('agent_marketing').insert(marketingInserts)
    }
 
    // ── DISCOVERY AGENT ────────────────────────────────────────
    const discoveryPrompt = `You are a customer discovery expert. For this startup, identify 8-10 potential customers — real types of people who would have this problem.
 
${context}
 
Return ONLY a valid JSON array:
[
  {
    "name": "descriptive persona name",
    "platform": "reddit",
    "profile_url": "https://reddit.com/r/relevant_subreddit",
    "context": "This type of person would be found complaining about X in Y community",
    "pain_point": "specific pain point they have that this startup solves"
  }
]`
 
    const discoveryResult = await callClaude(discoveryPrompt)
 
    let prospects: any[] = []
    try {
      const cleaned = discoveryResult.replace(/```json|```/g, '').trim()
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (match) prospects = JSON.parse(match[0])
    } catch {
      prospects = []
    }
 
    // ── OUTREACH AGENT ─────────────────────────────────────────
    const prospectsWithDrafts = await Promise.allSettled(
      prospects.slice(0, 10).map(async (prospect: any) => {
        const outreachPrompt = `Write a short personalized outreach message (under 80 words) from a startup founder to this potential customer. Reference their specific pain point. Sound genuine, not salesy. No subject line needed.
 
Startup: ${startup.name} — ${startup.tagline}
Founder: ${startup.founder_name ?? 'The founder'}
Profile: https://launchlog-v2.vercel.app/startup/${startup.id}
 
Prospect pain point: ${prospect.pain_point}
Where they hang out: ${prospect.platform} — ${prospect.profile_url}
 
Return only the message text.`
 
        const draft = await callClaude(outreachPrompt)
        return { ...prospect, outreach_draft: draft }
      })
    )
 
    const prospectInserts = prospectsWithDrafts
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => ({
        run_id: run.id,
        startup_id: startup.id,
        name: r.value.name,
        platform: r.value.platform,
        profile_url: r.value.profile_url,
        context: r.value.context,
        pain_point: r.value.pain_point,
        outreach_draft: r.value.outreach_draft,
        outreach_status: r.value.outreach_draft ? 'draft_ready' : 'discovered',
      }))
 
    if (prospectInserts.length > 0) {
      await supabase.from('agent_prospects').insert(prospectInserts)
    }
 
    // ── WEEKLY REPORT ──────────────────────────────────────────
    const reportPrompt = `Based on this startup, write a 2-sentence weekly agent summary and 1 actionable recommendation.
 
${context}
Posts generated: ${marketingInserts.length}
Prospects found: ${prospectInserts.length}
 
Return ONLY valid JSON: {"summary":"...","recommendations":"..."}`
 
    const reportResult = await callClaude(reportPrompt)
    try {
      const cleaned = reportResult.replace(/```json|```/g, '').trim()
      const report = JSON.parse(cleaned)
      await supabase.from('agent_reports').upsert([{
        startup_id: startup.id,
        week_of: new Date().toISOString().split('T')[0],
        posts_generated: marketingInserts.length,
        prospects_found: prospectInserts.length,
        summary: report.summary,
        recommendations: report.recommendations,
      }], { onConflict: 'startup_id,week_of' })
    } catch {}
 
    // Mark run complete
    await supabase
      .from('agent_runs')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', run.id)
 
    return new Response(
      JSON.stringify({
        success: true,
        run_id: run.id,
        startup: startup.name,
        marketing_generated: marketingInserts.length,
        prospects_found: prospectInserts.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (err: any) {
    console.error('Agent error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
})