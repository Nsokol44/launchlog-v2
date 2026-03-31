// supabase/functions/marketing-agent/index.ts
// Generates platform-specific marketing content for a startup
// Deploy: supabase functions deploy marketing-agent

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
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

Deno.serve(async (req) => {
  try {
    const { startup, run_id } = await req.json()

    const context = `
Startup: ${startup.name}
Tagline: ${startup.tagline}
What it does: ${startup.product}
Target customer: ${startup.target_customer || 'Not specified'}
Revenue model: ${startup.revenue_model || 'Not specified'}
Stage: ${startup.stage || 'Early stage'}
Category: ${startup.category}
City: ${startup.city || 'Not specified'}
Founder: ${startup.founder_name || 'The founder'}
    `.trim()

    // Generate content for each platform in parallel
    const platforms = [
      {
        platform: 'twitter',
        prompt: `You are a startup marketing expert. Write 3 different Twitter/X posts for this startup. Each should be under 280 characters, conversational, and end with a call to action. No hashtag spam — maximum 2 relevant hashtags per post. Format as JSON array of strings.

${context}

Return ONLY a JSON array like: ["post 1", "post 2", "post 3"]`,
      },
      {
        platform: 'linkedin',
        prompt: `You are a startup marketing expert. Write a LinkedIn post for this startup. It should be 150-200 words, professional but personable, tell the founder's story briefly, explain the problem being solved, and end with a question to drive engagement.

${context}

Return ONLY the post text, no JSON wrapper.`,
      },
      {
        platform: 'reddit',
        prompt: `You are a startup marketing expert. Write a Reddit post for this startup to share in a relevant subreddit (suggest which subreddit). It should be authentic, not salesy, share the founder's journey, and invite genuine feedback. Format as JSON with keys: "subreddit", "title", "body".

${context}

Return ONLY valid JSON like: {"subreddit": "r/startups", "title": "...", "body": "..."}`,
      },
      {
        platform: 'email',
        prompt: `You are a startup marketing expert. Write a launch email the founder can send to their personal network announcing their startup. Subject line + body. Should be personal, exciting, and ask recipients to share. Under 200 words total. Format as JSON with keys: "subject", "body".

${context}

Return ONLY valid JSON like: {"subject": "...", "body": "..."}`,
      },
      {
        platform: 'producthunt',
        prompt: `You are a startup marketing expert. Write a Product Hunt launch description for this startup. Include: tagline (under 60 chars), a compelling description (150-200 words), and 3 key features as bullet points. Format as JSON with keys: "tagline", "description", "features" (array of 3 strings).

${context}

Return ONLY valid JSON.`,
      },
    ]

    const results = await Promise.allSettled(
      platforms.map(async ({ platform, prompt }) => {
        const content = await callClaude(prompt)
        return { platform, content }
      })
    )

    // Save all generated content to database
    const inserts = results
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => ({
        run_id,
        startup_id: startup.id,
        platform: r.value.platform,
        content: r.value.content,
        status: 'pending',
      }))

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_marketing').insert(inserts)
      if (error) throw error
    }

    return new Response(
      JSON.stringify({ success: true, generated: inserts.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
