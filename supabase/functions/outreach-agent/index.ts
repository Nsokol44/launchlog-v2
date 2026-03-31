// supabase/functions/outreach-agent/index.ts
// Drafts personalized outreach messages for each discovered prospect
// Deploy: supabase functions deploy outreach-agent

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

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
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

Deno.serve(async (req) => {
  try {
    const { startup, run_id } = await req.json()

    // Wait a moment for discovery agent to populate prospects
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Fetch prospects found by discovery agent for this run
    const { data: prospects, error: fetchError } = await supabase
      .from('agent_prospects')
      .select('*')
      .eq('run_id', run_id)
      .eq('outreach_status', 'discovered')

    if (fetchError) throw fetchError
    if (!prospects || prospects.length === 0) {
      return new Response(
        JSON.stringify({ success: true, drafted: 0, message: 'No prospects to draft for yet' }),
        { status: 200 }
      )
    }

    const context = `
Startup: ${startup.name}
What it does: ${startup.product}
Tagline: ${startup.tagline}
Founder: ${startup.founder_name || 'The founder'}
LaunchLog profile: https://launchlog-v2.vercel.app/startup/${startup.id}
    `.trim()

    // Draft personalized messages for each prospect
    const drafts = await Promise.allSettled(
      prospects.map(async (prospect) => {
        const prompt = `You are a startup founder writing a genuine, personalized outreach message to a potential early customer. 

Your startup:
${context}

The person you're reaching out to:
- Name/handle: ${prospect.name}
- Platform: ${prospect.platform}
- What they said: ${prospect.context}
- Their pain point: ${prospect.pain_point}

Write a SHORT, genuine outreach message (under 100 words) that:
1. References something specific they said (show you actually read their post)
2. Briefly explains how your startup solves their exact pain point
3. Asks one simple question or offers something valuable (free access, feedback call, etc.)
4. Does NOT sound like a sales pitch
5. Sounds like a real person, not marketing copy

Return ONLY the message text, nothing else.`

        const draft = await callClaude(prompt)
        return { prospect_id: prospect.id, draft }
      })
    )

    // Update prospects with their drafts
    const updatePromises = drafts
      .filter(d => d.status === 'fulfilled')
      .map(async (d: any) => {
        return supabase
          .from('agent_prospects')
          .update({
            outreach_draft: d.value.draft,
            outreach_status: 'draft_ready',
          })
          .eq('id', d.value.prospect_id)
      })

    await Promise.allSettled(updatePromises)

    const drafted = drafts.filter(d => d.status === 'fulfilled').length

    // Update the weekly report
    await supabase
      .from('agent_reports')
      .update({ posts_generated: drafted })
      .eq('startup_id', startup.id)
      .eq('week_of', new Date().toISOString().split('T')[0])

    return new Response(
      JSON.stringify({ success: true, drafted }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
