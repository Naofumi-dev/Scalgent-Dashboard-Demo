import { useState, useEffect } from 'react'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Sparkles, ShieldAlert, RefreshCw } from 'lucide-react'
import './Analytics.css'

const CHART_TOOLTIP_STYLE = {
    contentStyle: { background: '#22252a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 },
    labelStyle: { color: '#8b8fa8' },
}

const PIPELINE_COLORS = {
    'New Lead': '#6366f1',
    'Qualified': '#a855f7',
    'Proposal': '#ec4899',
    'Closed Won': '#10b981',
    'Closed Lost': '#ef4444',
}

function getChurnRisk(score) {
    if (score >= 85) return { label: 'Very Low', risk: 'green' }
    if (score >= 70) return { label: 'Low', risk: 'green' }
    if (score >= 55) return { label: 'Medium', risk: 'amber' }
    return { label: 'High', risk: 'coral' }
}

export default function Analytics() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        fetch(`${apiUrl}/api/ghl/contacts`)
            .then(res => res.json())
            .then(data => {
                if (data.contacts && data.contacts.length > 0) {
                    setContacts(data.contacts)
                }
            })
            .catch(err => console.error('Failed to fetch contacts:', err))
            .finally(() => setLoading(false))
    }, [])

    // Derive pipeline data from contacts
    const stageCounts = {}
    contacts.forEach(c => {
        const stage = c.stage || 'New Lead'
        stageCounts[stage] = (stageCounts[stage] || 0) + 1
    })
    const pipeline = Object.entries(stageCounts).map(([stage, value]) => ({
        stage,
        value,
        fill: PIPELINE_COLORS[stage] || '#6366f1',
    }))

    // KPIs derived from real data
    const totalLeads = contacts.length
    const avgScore = contacts.length > 0
        ? Math.round(contacts.reduce((sum, c) => sum + (c.score || 0), 0) / contacts.length)
        : 0
    const highRiskCount = contacts.filter(c => (c.score || 0) < 55).length

    const kpis = [
        { label: 'Total Leads', value: totalLeads.toLocaleString(), change: 12.4 },
        { label: 'Avg. AI Score', value: `${avgScore}%`, change: avgScore > 70 ? 3.2 : -1.5 },
        { label: 'High Risk Contacts', value: highRiskCount, change: highRiskCount > 2 ? -4.8 : 2.1 },
        { label: 'Active Workflows', value: '18', change: -2 },
    ]

    const revenueForecast = [
        { month: 'Jan', actual: 45000, projected: 45000 },
        { month: 'Feb', actual: 52000, projected: 52000 },
        { month: 'Mar', actual: 48000, projected: 48000 },
        { month: 'Apr', actual: 61000, projected: 61000 },
        { month: 'May', projected: 69000 },
        { month: 'Jun', projected: 78000 },
    ]

    return (
        <div className="analytics-layout animate-fade-in">
            {/* KPI row */}
            <div className="kpi-row">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="card card-dark kpi-card">
                        <div className="text-xs text-secondary" style={{ marginBottom: 6 }}>{kpi.label}</div>
                        <div className="font-black text-2xl" style={{ color: '#fff', letterSpacing: '-0.5px' }}>
                            {kpi.value}
                        </div>
                        <div className={`flex items-center gap-1 ${kpi.change >= 0 ? 'text-green' : 'text-coral'}`} style={{ marginTop: 4, fontSize: 12 }}>
                            {kpi.change >= 0
                                ? <TrendingUp size={13} />
                                : <TrendingDown size={13} />}
                            <span>{kpi.change >= 0 ? '+' : ''}{kpi.change}%</span>
                            <span className="text-muted text-xs">vs last week</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="charts-row">
                {/* ML Revenue Forecast */}
                <div className="card card-dark chart-card" style={{ flex: 2 }}>
                    <div className="flex items-center gap-2 mb-4" style={{ marginBottom: 16 }}>
                        <Sparkles size={16} color="#a855f7" />
                        <div className="font-bold text-sm" style={{ color: '#fff' }}>AI Revenue Forecast (6mo)</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueForecast}>
                            <defs>
                                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...CHART_TOOLTIP_STYLE} />
                            <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#actualGrad)" name="Actual Revenue" />
                            <Area type="monotone" dataKey="projected" stroke="#a855f7" strokeDasharray="5 5" strokeWidth={3} fillOpacity={1} fill="url(#projGrad)" name="AI Projected" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pipeline — real from GHL */}
                <div className="card card-dark chart-card">
                    <div className="font-bold text-sm" style={{ color: '#fff', marginBottom: 16 }}>Pipeline Health</div>
                    {pipeline.length > 0 ? (
                        <div className="pipeline-chart-inner">
                            <ResponsiveContainer width={180} height={180}>
                                <PieChart>
                                    <Pie dataKey="value" data={pipeline} cx="50%" cy="50%" innerRadius={55} outerRadius={80} strokeWidth={0}>
                                        {pipeline.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip {...CHART_TOOLTIP_STYLE} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pipeline-legend">
                                {pipeline.map(p => (
                                    <div key={p.stage} className="flex items-center gap-2">
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.fill, flexShrink: 0, display: 'inline-block' }} />
                                        <span className="text-xs text-secondary">{p.stage}</span>
                                        <span className="text-xs font-semibold" style={{ color: '#fff', marginLeft: 'auto' }}>{p.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-muted" style={{ padding: 20, textAlign: 'center' }}>
                            {loading ? 'Loading pipeline...' : 'No pipeline data'}
                        </div>
                    )}
                </div>
            </div>

            {/* Churn Risk Ledger — real GHL contacts */}
            <div className="card card-dark">
                <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
                    <ShieldAlert size={16} color="#ec4899" />
                    <div className="font-bold text-sm" style={{ color: '#fff' }}>Predictive Churn Risk Ledger</div>
                    {loading && <RefreshCw size={14} className="animate-spin" style={{ color: '#8b8fa8' }} />}
                </div>
                <table className="lead-table">
                    <thead>
                        <tr>
                            <th>Contact</th><th>Stage</th><th>Score</th><th>Churn Risk</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length > 0 ? contacts.map(contact => {
                            const churn = getChurnRisk(contact.score)
                            return (
                                <tr key={contact.id}>
                                    <td className="font-medium text-sm" style={{ color: '#fff' }}>{contact.name}</td>
                                    <td className="text-xs text-secondary">{contact.stage}</td>
                                    <td>
                                        <div className="score-bar-wrap">
                                            <div className="score-bar" style={{ width: `${contact.score}%`, background: contact.score > 80 ? 'var(--green)' : contact.score > 60 ? 'var(--amber)' : 'var(--coral)' }} />
                                            <span className="text-xs font-semibold" style={{ color: '#fff' }}>{contact.score}</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge badge-${churn.risk}`}>{churn.label}</span></td>
                                    <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Nurture</button></td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan={5} className="text-xs text-muted" style={{ textAlign: 'center', padding: 20 }}>
                                    {loading ? 'Loading contacts...' : 'No contacts found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
