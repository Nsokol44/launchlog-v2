// supabase/functions/agent-orchestrator/index.ts
// Triggered when a startup is approved OR manually from the agent dashboard
// Deploy: supabase functions deploy agent-orchestrator

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const { startup_id, triggered_by = 'manual' } = await req.json()

    if (!startup_id) {
      return new Response(JSON.stringify({ error: 'startup_id required' }), { status: 400 })
    }

    // Fetch the startup
    const { data: startup, error: startupError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startup_id)
      .single()

    if (startupError || !startup) {
      return new Response(JSON.stringify({ error: 'Startup not found' }), { status: 404 })
    }

    // Create an agent run record
    const { data: run, error: runError } = await supabase
      .from('agent_runs')
      .insert([{ startup_id, triggered_by, status: 'running' }])
      .select()
      .single()

    if (runError) throw runError

    // Fire all three agents in parallel (don't await — let them run async)
    const agentPayload = { startup, run_id: run.id }

    const invokeAgent = (fnName: string) =>
      fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify(agentPayload),
      }).catch(err => console.error(`${fnName} failed:`, err))

    // Run all three agents simultaneously
    await Promise.allSettled([
      invokeAgent('marketing-agent'),
      invokeAgent('discovery-agent'),
      invokeAgent('outreach-agent'),
    ])

    // Mark run complete
    await supabase
      .from('agent_runs')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', run.id)

    return new Response(
      JSON.stringify({ success: true, run_id: run.id, startup: startup.name }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
