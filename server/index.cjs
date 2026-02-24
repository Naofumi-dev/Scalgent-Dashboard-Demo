/**
 * server/index.cjs
 * FlowSight backend — Express + Socket.io
 *
 * Real integrations:
 *  - GoHighLevel (GHL) API v2 via private integration token
 *  - Google Gemini (gemini-2.0-flash) for AI insights
 *
 * Env vars required (.env):
 *   GHL_API_KEY        — GHL private integration token (pit-...)
 *   GHL_LOCATION_ID    — GHL location/sub-account ID
 *   GEMINI_API_KEY     — Google Gemini API key
 *   PORT               — server port (default 3001)
 */

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const https = require('https')

require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'http://localhost:4173', 'https://scalgent-dashboard-demo.netlify.app', 'https://scalgent-dashboard-demo.netlify.app/'], methods: ['GET', 'POST'] }
})

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173', 'https://scalgent-dashboard-demo.netlify.app', 'https://scalgent-dashboard-demo.netlify.app/'] }))
app.use(express.json())

// ── Config ────────────────────────────────────────────────
const GHL_API_KEY = process.env.GHL_API_KEY
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.0-flash'
const AIRTABLE_PAT = process.env.AIRTABLE_PAT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TASKS_TABLE = process.env.AIRTABLE_TASKS_TABLE || 'Tasks'

// ── Helpers ───────────────────────────────────────────────

/** Simple fetch wrapper using Node's built-in https */
function fetchJSON(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url)
        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        }
        const req = https.request(reqOptions, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) })
                } catch {
                    resolve({ status: res.statusCode, body: data })
                }
            })
        })
        req.on('error', reject)
        if (options.body) req.write(JSON.stringify(options.body))
        req.end()
    })
}

/** GHL API base headers */
const ghlHeaders = () => ({
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Version': '2021-07-28',
    'Content-Type': 'application/json',
})

// ── Health check ──────────────────────────────────────────
app.get('/', (req, res) => {
    res.send('FlowSight API Server is running! 🚀<br><br>The React dashboard is available here: <a href="http://localhost:5173">http://localhost:5173</a>')
})

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        ghl: { configured: !!GHL_API_KEY, locationId: GHL_LOCATION_ID || '⚠ not set' },
        gemini: { configured: !!GEMINI_API_KEY, model: GEMINI_MODEL },
        timestamp: new Date().toISOString()
    })
})

// ── GHL: Contacts ─────────────────────────────────────────
app.get('/api/ghl/contacts', async (req, res) => {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
        return res.json({ source: 'mock', contacts: getMockContacts() })
    }

    try {
        const limit = req.query.limit || 20
        const result = await fetchJSON(
            `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=${limit}`,
            { headers: ghlHeaders() }
        )

        if (result.status !== 200) {
            console.warn('[GHL] contacts fetch failed:', result.status, result.body?.message)
            return res.json({ source: 'mock', error: result.body?.message, contacts: getMockContacts() })
        }

        const contacts = (result.body.contacts || []).map(c => ({
            id: c.id,
            name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email,
            email: c.email,
            phone: c.phone,
            stage: c.customField?.find(f => f.id === 'stage')?.value || c.tags?.[0] || 'New Lead',
            tags: c.tags || [],
            score: Math.floor(Math.random() * 40 + 55), // AI score (Gemini can enhance this)
            lastActivity: c.dateLastActivity
                ? new Date(c.dateLastActivity).toLocaleString()
                : 'Unknown',
        }))

        res.json({ source: 'ghl', contacts })
    } catch (err) {
        console.error('[GHL] error:', err.message)
        res.json({ source: 'mock', error: err.message, contacts: getMockContacts() })
    }
})

// ── GHL: Pipelines ────────────────────────────────────────
app.get('/api/ghl/pipelines', async (req, res) => {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
        return res.json({ source: 'mock', pipelines: [] })
    }
    try {
        const result = await fetchJSON(
            `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`,
            { headers: ghlHeaders() }
        )
        res.json({ source: result.status === 200 ? 'ghl' : 'mock', pipelines: result.body?.pipelines || [] })
    } catch (err) {
        res.json({ source: 'mock', pipelines: [], error: err.message })
    }
})

// ── GHL Webhook → Socket.io ───────────────────────────────
app.post('/api/ghl/webhook', (req, res) => {
    const event = req.body
    console.log('[GHL webhook]', event?.type || 'event received')
    io.emit('ghl:event', { ...event, receivedAt: new Date().toISOString() })
    res.json({ received: true })
})

// ── n8n Webhook → Socket.io ───────────────────────────────
app.post('/api/n8n/webhook', (req, res) => {
    const payload = req.body
    console.log('[n8n webhook]', payload?.workflowId)
    io.emit('n8n:event', { ...payload, receivedAt: new Date().toISOString() })
    res.json({ received: true })
})

// ── Gemini: AI Insights ───────────────────────────────────
app.get('/api/insights', async (req, res) => {
    if (!GEMINI_API_KEY) {
        return res.json({ source: 'mock', insights: getMockInsights() })
    }

    const prompt = `You are an AI operations assistant for a GoHighLevel CRM business dashboard.
  
Generate exactly 3 actionable business insights in JSON format based on typical SMB CRM data.
Return ONLY a valid JSON array like this:
[
  {"type": "warning",  "message": "..."},
  {"type": "success",  "message": "..."},
  {"type": "action",   "message": "..."}
]

Types must be one of: warning, success, action. Keep each message under 120 characters.`

    try {
        const result = await fetchJSON(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { contents: [{ parts: [{ text: prompt }] }] }
            }
        )

        if (result.status === 429) {
            console.warn('[Gemini] rate limited — using fallback insights')
            return res.json({ source: 'mock', rateLimited: true, insights: getMockInsights() })
        }

        if (result.status !== 200) {
            console.warn('[Gemini] error:', result.status, result.body?.error?.message)
            return res.json({ source: 'mock', error: result.body?.error?.message, insights: getMockInsights() })
        }

        const text = result.body?.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
        // Strip markdown code fences if present
        const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
        const insights = JSON.parse(cleaned)

        res.json({ source: 'gemini', model: GEMINI_MODEL, insights, generated_at: new Date().toISOString() })
    } catch (err) {
        console.error('[Gemini] error:', err.message)
        res.json({ source: 'mock', error: err.message, insights: getMockInsights() })
    }
})

// ── Airtable: Tasks ─────────────────────────────────────────
app.get('/api/airtable/tasks', async (req, res) => {
    if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
        return res.json({ source: 'mock', tasks: [] })
    }

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TASKS_TABLE)}`
        const result = await fetchJSON(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_PAT}`,
                'Content-Type': 'application/json'
            }
        })

        if (result.status !== 200) {
            console.warn('[Airtable] fetch failed:', result.status, result.body?.error)
            return res.json({ source: 'mock', error: result.body?.error, tasks: [] })
        }

        const tasks = (result.body.records || []).map(r => ({
            id: r.id,
            name: r.fields['Task Name'] || r.fields.Task || r.fields.Name || 'Unnamed Task',
            status: r.fields.Status || 'To Do',
            priority: r.fields.Priority || 'Medium',
            assignee: r.fields.Owner?.name || r.fields.Assignee?.name || 'Unassigned',
            dueDate: r.fields['Due Date'] || null,
        }))

        res.json({ source: 'airtable', tasks })
    } catch (err) {
        console.error('[Airtable] error:', err.message)
        res.json({ source: 'mock', error: err.message, tasks: [] })
    }
})

// ── Gemini: AI Chat ───────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    const { message, history = [] } = req.body
    if (!message) return res.status(400).json({ error: 'message required' })

    if (!GEMINI_API_KEY) {
        return res.json({ reply: getMockChatReply(message) })
    }

    const systemCtx = `You are an AI operations lead assistant embedded in a GoHighLevel + n8n business dashboard.
You help business owners understand their CRM data, optimize workflows, and grow revenue.
Be concise (under 150 words), specific, and actionable. Reference GHL features when relevant.`

    const contents = [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: `${systemCtx}\n\nUser: ${message}` }] }
    ]

    try {
        const result = await fetchJSON(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { contents } }
        )

        if (result.status === 429) {
            return res.json({ reply: getMockChatReply(message), rateLimited: true })
        }

        const reply = result.body?.candidates?.[0]?.content?.parts?.[0]?.text || getMockChatReply(message)
        res.json({ source: 'gemini', reply })
    } catch (err) {
        res.json({ source: 'mock', reply: getMockChatReply(message) })
    }
})

// ── Core Monitoring: 5-Minute Polling ─────────────────────
setInterval(async () => {
    console.log('[System] Running 5-minute data sync (GHL, n8n, Airtable)...')
    try {
        let ghlStatus = 'ok'
        if (GHL_API_KEY && GHL_LOCATION_ID) {
            const res = await fetchJSON(`https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`, { headers: ghlHeaders() })
            if (res.status !== 200) ghlStatus = 'error'
        }

        let airtableStatus = 'ok'
        if (AIRTABLE_PAT && AIRTABLE_BASE_ID) {
            const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TASKS_TABLE)}?maxRecords=1`
            const res = await fetchJSON(url, { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` } })
            if (res.status !== 200) airtableStatus = 'error'
        }

        if (ghlStatus === 'error' || airtableStatus === 'error') {
            io.emit('system:alert', {
                type: 'sync_failure',
                message: `Data sync partially failed. GHL: ${ghlStatus}, Airtable: ${airtableStatus}`,
                severity: 'warning'
            })
        } else {
            console.log('[System] Sync complete.')
        }
    } catch (e) {
        console.error('[System] CRON polling error:', e)
        io.emit('system:alert', { type: 'sync_error', message: 'Critical backend mapping failure during 5-minute CRON sync.', severity: 'error' })
    }
}, 300000)

// ── Socket.io ─────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log('[Socket.io]  connected:', socket.id)

    // Send initial state on connect
    socket.emit('dashboard:init', {
        message: 'FlowSight connected',
        timestamp: new Date().toISOString(),
        ghlConnected: !!(GHL_API_KEY && GHL_LOCATION_ID),
        geminiConnected: !!GEMINI_API_KEY,
    })

    socket.on('disconnect', () => {
        console.log('[Socket.io] disconnected:', socket.id)
    })
})

// ── Mock data fallbacks ───────────────────────────────────
function getMockContacts() {
    return [
        { id: 'c1', name: 'Sarah Chen', email: 'sarah@company.co', phone: '+1 (415) 234-5678', stage: 'Qualified Lead', tags: ['Hot Lead', 'E-commerce'], score: 87, lastActivity: '2h ago' },
        { id: 'c2', name: 'Marcus Rivera', email: 'marcus@startup.io', phone: '+1 (310) 987-6543', stage: 'Proposal Sent', tags: ['SaaS'], score: 62, lastActivity: '1d ago' },
        { id: 'c3', name: 'Priya Patel', email: 'priya@growth.com', phone: '+1 (628) 345-9012', stage: 'Closed Won', tags: ['VIP'], score: 95, lastActivity: '5m ago' },
        { id: 'c4', name: 'James Okafor', email: 'james@agency.net', phone: '+1 (212) 567-3456', stage: 'New Lead', tags: ['Cold'], score: 41, lastActivity: '3d ago' },
        { id: 'c5', name: 'Lucia Martinez', email: 'lucia@firm.com', phone: '+1 (303) 678-9012', stage: 'Nurturing', tags: ['Warm'], score: 73, lastActivity: '6h ago' },
    ]
}

function getMockInsights() {
    return [
        { type: 'warning', message: 'Churn risk detected for 14 contacts — trigger re-engagement workflow now.' },
        { type: 'success', message: 'Appointment Reminder workflow hit 99% success rate this week. 🎉' },
        { type: 'action', message: 'AOV is down 8% — add an upsell step to your post-purchase sequence.' },
    ]
}

function getMockChatReply(message) {
    const lower = message.toLowerCase()
    if (lower.includes('churn')) return 'Churn risk is elevated for 14 contacts (21+ days inactive). I recommend triggering the re-engagement workflow immediately with a personalized "We miss you" email sequence.'
    if (lower.includes('revenue') || lower.includes('aov')) return 'Revenue is up 7.5% week-over-week. AOV is slightly down at $18.50 — consider adding a post-purchase upsell node to your order confirmation workflow.'
    if (lower.includes('workflow') || lower.includes('automation')) return 'Your top performer is "Lead Nurture Sequence" at 94% success. The weakest is "Churn Prevention" at 71% — it likely needs a time delay adjustment and clearer branching conditions.'
    return `Analyzing your GHL data for "${message}"... Your pipeline looks healthy overall, but I'd recommend reviewing the underperforming sequences. Want a step-by-step optimization plan?`
}

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`\n✅ FlowSight server  →  http://localhost:${PORT}`)
    console.log(`   GHL API key:  ${GHL_API_KEY ? '✓ set' : '✗ missing'}`)
    console.log(`   GHL Location: ${GHL_LOCATION_ID ? '✓ ' + GHL_LOCATION_ID : '⚠  not set — add GHL_LOCATION_ID to .env'}`)
    console.log(`   Gemini API:   ${GEMINI_API_KEY ? '✓ set (model: ' + GEMINI_MODEL + ')' : '✗ missing'}\n`)
})
